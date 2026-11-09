package com.codearena.execution;

public class ExecutionResult {
    private String status;
    private String output;
    private String error;
    private long executionTime;
    private int exitCode;

    public ExecutionResult() {
    }

    public ExecutionResult(String status, String output, String error, long executionTime, int exitCode) {
        this.status = status;
        this.output = output;
        this.error = error;
        this.executionTime = executionTime;
        this.exitCode = exitCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public int getExitCode() {
        return exitCode;
    }

    public void setExitCode(int exitCode) {
        this.exitCode = exitCode;
    }
}
