
package com.codearena.judge;

public class ExecutionRequest {

    private String sourceCode;
    private String input;
    private String language;

    public ExecutionRequest() {
    }

    public ExecutionRequest(
            String sourceCode,
            String input,
            String language) {

        this.sourceCode = sourceCode;
        this.input = input;
        this.language = language;
    }

    public String getSourceCode() {
        return sourceCode;
    }

    public void setSourceCode(String sourceCode) {
        this.sourceCode = sourceCode;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
