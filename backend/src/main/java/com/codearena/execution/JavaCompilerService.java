
package com.codearena.execution;

import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;

public class JavaCompilerService {

    public ExecutionResult compile(String sourceCode, Path workingDirectory) {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            return new ExecutionResult(
                "COMPILER_NOT_AVAILABLE",
                "",
                "System Java compiler is not available. Please ensure a JDK is being used.",
                0L,
                -1
            );
        }

        if (sourceCode == null || workingDirectory == null) {
            return new ExecutionResult(
                "COMPILATION_ERROR",
                "",
                "Source code and working directory must not be null.",
                0L,
                1
            );
        }

        long startTime = System.nanoTime();

        try {
            if (!Files.exists(workingDirectory)) {
                Files.createDirectories(workingDirectory);
            }

            Path classFilePath = workingDirectory.resolve("Main.class");
            Files.deleteIfExists(classFilePath);

            Path sourceFilePath = workingDirectory.resolve("Main.java");
            Files.writeString(sourceFilePath, sourceCode, StandardCharsets.UTF_8);

            DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
            boolean success;

            try (StandardJavaFileManager fileManager = compiler.getStandardFileManager(diagnostics, null, StandardCharsets.UTF_8)) {
                Iterable<? extends JavaFileObject> compilationUnits =
                        fileManager.getJavaFileObjectsFromPaths(Collections.singletonList(sourceFilePath));
                List<String> options = List.of("-d", workingDirectory.toString());

                JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, diagnostics, options, null, compilationUnits);
                success = Boolean.TRUE.equals(task.call());
            }

            long executionTime = (System.nanoTime() - startTime) / 1_000_000;

            if (success) {
                return new ExecutionResult("COMPILED", "", "", executionTime, 0);
            } else {
                StringBuilder errorMessages = new StringBuilder();
                for (Diagnostic<? extends JavaFileObject> diagnostic : diagnostics.getDiagnostics()) {
                    if (diagnostic.getKind() == Diagnostic.Kind.ERROR) {
                        if (diagnostic.getLineNumber() > 0) {
                            errorMessages.append("Line ")
                                         .append(diagnostic.getLineNumber())
                                         .append(": ");
                        }
                        errorMessages.append(diagnostic.getMessage(null))
                                     .append(System.lineSeparator());
                    }
                }

                String error = errorMessages.toString().trim();
                if (error.isEmpty()) {
                    error = "Compilation failed with errors.";
                }

                return new ExecutionResult("COMPILATION_ERROR", "", error, executionTime, 1);
            }

        } catch (IOException e) {
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;
            return new ExecutionResult(
                "COMPILATION_ERROR",
                "",
                "I/O error during compilation: " + e.getMessage(),
                executionTime,
                1
            );
        } catch (Exception e) {
            long executionTime = (System.nanoTime() - startTime) / 1_000_000;
            return new ExecutionResult(
                "COMPILATION_ERROR",
                "",
                "Unexpected compilation error: " + e.getMessage(),
                executionTime,
                1
            );
        }
    }
}
