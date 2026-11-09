
package com.codearena.execution;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class JavaExecutionService {

    private static final int MAX_OUTPUT_SIZE = 1024 * 1024; // 1 MB limit per stream
    private static final long STREAM_READ_TIMEOUT_MS = 2000L; // 2 seconds bounded wait for stream collection

    public ExecutionResult execute(Path workingDirectory, String input, long timeoutMillis) {
        if (workingDirectory == null || !Files.exists(workingDirectory) || !Files.isDirectory(workingDirectory)) {
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Working directory does not exist or is invalid.",
                0L,
                1
            );
        }

        Path classFile = workingDirectory.resolve("Main.class");
        if (!Files.exists(classFile)) {
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Main.class not found in working directory.",
                0L,
                1
            );
        }

        ProcessBuilder pb = new ProcessBuilder(
            getJavaExecutable(),
            "-cp",
            workingDirectory.toAbsolutePath().toString(),
            "Main"
        );
        pb.directory(workingDirectory.toFile());

        Process process = null;
        ExecutorService streamExecutor = Executors.newFixedThreadPool(3);
        long startTime = System.nanoTime();

        try {
            process = pb.start();

            // Read standard output and standard error concurrently to prevent deadlock
            final Process proc = process;
            Future<String> stdoutFuture = streamExecutor.submit(() -> readStream(proc.getInputStream(), MAX_OUTPUT_SIZE));
            Future<String> stderrFuture = streamExecutor.submit(() -> readStream(proc.getErrorStream(), MAX_OUTPUT_SIZE));

            // Write standard input asynchronously so large or unread input never blocks the execution timeout
            Future<?> stdinFuture = streamExecutor.submit(() -> writeInput(proc.getOutputStream(), input));

            // Wait for the process to complete up to timeoutMillis
            boolean finished = process.waitFor(timeoutMillis, TimeUnit.MILLISECONDS);
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;

            if (!finished) {
                // Timeout exceeded: terminate process and any descendant processes
                try {
                    process.descendants().forEach(ProcessHandle::destroyForcibly);
                } catch (Exception ignored) {
                }
                process.destroy();
                if (!process.waitFor(200, TimeUnit.MILLISECONDS)) {
                    process.destroyForcibly();
                    process.waitFor(200, TimeUnit.MILLISECONDS);
                }

                stdinFuture.cancel(true);
                String stdout = "";
                String stderr = "";
                try {
                    stdout = stdoutFuture.get(200, TimeUnit.MILLISECONDS);
                } catch (Exception ignored) {
                    stdoutFuture.cancel(true);
                }
                try {
                    stderr = stderrFuture.get(200, TimeUnit.MILLISECONDS);
                } catch (Exception ignored) {
                    stderrFuture.cancel(true);
                }

                return new ExecutionResult("TIME_LIMIT_EXCEEDED", stdout, stderr, executionTime, -1);
            }

            // Process finished within timeout: collect streams with a shared bounded deadline
            int exitCode = process.exitValue();
            String stdout;
            String stderr;
            try {
                long deadline = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(STREAM_READ_TIMEOUT_MS);
                stdout = getStreamOutput(stdoutFuture, deadline);
                stderr = getStreamOutput(stderrFuture, deadline);
            } catch (TimeoutException e) {
                // An inherited background child process may be holding output streams open
                try {
                    process.descendants().forEach(ProcessHandle::destroyForcibly);
                } catch (Exception ignored) {
                }
                process.destroyForcibly();
                stdoutFuture.cancel(true);
                stderrFuture.cancel(true);
                return new ExecutionResult(
                    "EXECUTION_ERROR",
                    "",
                    "Stream reading timed out; output stream was kept open after process exit.",
                    (System.nanoTime() - startTime) / 1_000_000,
                    1
                );
            }

            String status = (exitCode == 0) ? "SUCCESS" : "RUNTIME_ERROR";
            return new ExecutionResult(status, stdout, stderr, executionTime, exitCode);

        } catch (ExecutionException e) {
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;
            Throwable cause = e.getCause() != null ? e.getCause() : e;
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Stream reading failure: " + cause.getMessage(),
                executionTime,
                1
            );
        } catch (InterruptedException e) {
            if (process != null) {
                try {
                    process.descendants().forEach(ProcessHandle::destroyForcibly);
                } catch (Exception ignored) {
                }
                process.destroyForcibly();
            }
            Thread.currentThread().interrupt();
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Execution was interrupted: " + e.getMessage(),
                executionTime,
                1
            );
        } catch (IOException e) {
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "I/O error during execution: " + e.getMessage(),
                executionTime,
                1
            );
        } catch (Exception e) {
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Unexpected error during execution: " + e.getMessage(),
                executionTime,
                1
            );
        } finally {
            try {
                if (process != null) {
                    process.descendants().forEach(ProcessHandle::destroyForcibly);
                }
            } catch (Exception ignored) {
            }
            if (process != null && process.isAlive()) {
                process.destroyForcibly();
            }
            streamExecutor.shutdownNow();
        }
    }

    private void writeInput(OutputStream stdin, String input) {
        try (stdin) {
            if (input != null && !input.isEmpty()) {
                stdin.write(input.getBytes(StandardCharsets.UTF_8));
                stdin.flush();
            }
        } catch (IOException ignored) {
            // Process may terminate or close stdin early before all input is consumed
        }
    }

    private String getJavaExecutable() {
        String javaHome = System.getProperty("java.home");
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        String executableName = isWindows ? "java.exe" : "java";
        return Paths.get(javaHome, "bin", executableName).toString();
    }

    private String readStream(InputStream inputStream, int maxBytes) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[8192];
        int bytesRead;
        int totalBytes = 0;

        try (inputStream) {
            while ((bytesRead = inputStream.read(data)) != -1) {
                if (totalBytes < maxBytes) {
                    int bytesToWrite = Math.min(bytesRead, maxBytes - totalBytes);
                    buffer.write(data, 0, bytesToWrite);
                    totalBytes += bytesToWrite;
                }
            }
        }

        return buffer.toString(StandardCharsets.UTF_8);
    }

    private String getStreamOutput(Future<String> future, long deadlineNanos)
            throws ExecutionException, InterruptedException, TimeoutException {
        long remaining = deadlineNanos - System.nanoTime();
        if (remaining <= 0) {
            throw new TimeoutException("Stream collection timed out.");
        }
        return future.get(remaining, TimeUnit.NANOSECONDS);
    }
}
