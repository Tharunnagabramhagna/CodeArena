
package com.codearena.execution;

import com.codearena.model.ExecutionRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.stream.Stream;

public class CodeExecutor {

    private final JavaCompilerService compilerService;
    private final JavaExecutionService executionService;

    public CodeExecutor() {
        this.compilerService = new JavaCompilerService();
        this.executionService = new JavaExecutionService();
    }

    public CodeExecutor(JavaCompilerService compilerService, JavaExecutionService executionService) {
        this.compilerService = compilerService;
        this.executionService = executionService;
    }

    public ExecutionResult execute(ExecutionRequest request, long timeoutMillis) {
        if (request == null) {
            return new ExecutionResult("EXECUTION_ERROR", "", "Execution request cannot be null.", 0L, 1);
        }

        if (request.getSourceCode() == null || request.getSourceCode().isBlank()) {
            return new ExecutionResult("EXECUTION_ERROR", "", "Source code cannot be null or blank.", 0L, 1);
        }

        if (request.getLanguage() == null || !request.getLanguage().trim().equalsIgnoreCase("java")) {
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Unsupported language: " + request.getLanguage() + ". Only Java is supported.",
                0L,
                1
            );
        }

        if (timeoutMillis <= 0) {
            return new ExecutionResult("EXECUTION_ERROR", "", "Timeout must be greater than zero.", 0L, 1);
        }

        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("codearena_exec_");

            ExecutionResult compileResult = compilerService.compile(request.getSourceCode(), tempDir);
            if (!"COMPILED".equals(compileResult.getStatus())) {
                return compileResult;
            }

            ExecutionResult executionResult = executionService.execute(tempDir, request.getInput(), timeoutMillis);
            executionResult.setExecutionTime(compileResult.getExecutionTime() + executionResult.getExecutionTime());
            return executionResult;

        } catch (IOException e) {
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Failed to initialize working directory: " + e.getMessage(),
                0L,
                1
            );
        } catch (Exception e) {
            return new ExecutionResult(
                "EXECUTION_ERROR",
                "",
                "Unexpected error during code execution: " + e.getMessage(),
                0L,
                1
            );
        } finally {
            if (tempDir != null) {
                deleteDirectoryQuietly(tempDir);
            }
        }
    }

    private void deleteDirectoryQuietly(Path directory) {
        if (directory == null || !Files.exists(directory)) {
            return;
        }
        try (Stream<Path> stream = Files.walk(directory)) {
            stream.sorted(Comparator.reverseOrder())
                  .forEach(path -> {
                      try {
                          Files.deleteIfExists(path);
                      } catch (IOException ignored) {
                          // Handle cleanup errors without hiding the actual execution result
                      }
                  });
        } catch (IOException ignored) {
            // Handle cleanup errors without hiding the actual execution result
        }
    }
}
