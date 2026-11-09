
package com.codearena.judge;

public class ExecutionResult {

    private String output;
    private String error;
    private boolean compilationError;
    private boolean successful;
    private int exitCode;
    private long executionTime;
    private long memoryUsed;

    public ExecutionResult() {
    }

    public ExecutionResult(
            String output,
            String error,
            boolean compilationError,
            boolean successful,
            int exitCode,
            long executionTime,
            long memoryUsed) {

        this.output = output;
        this.error = error;
        this.compilationError = compilationError;
        this.successful = successful;
        this.exitCode = exitCode;
        this.executionTime = executionTime;
        this.memoryUsed = memoryUsed;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public boolean isCompilationError() {
        return compilationError;
    }

    public void setCompilationError(boolean compilationError) {
        this.compilationError = compilationError;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }

    public int getExitCode() {
        return exitCode;
    }

    public void setExitCode(int exitCode) {
        this.exitCode = exitCode;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public long getMemoryUsed() {
        return memoryUsed;
    }

    public void setMemoryUsed(long memoryUsed) {
        this.memoryUsed = memoryUsed;
    }
}
