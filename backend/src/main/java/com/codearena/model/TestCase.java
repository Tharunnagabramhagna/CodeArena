package com.codearena.model;
public class TestCase {
    private int id;
    private String input;
    private String expectedOutput;
    private int problemId;
    private boolean sample;
    private String createdAt;

    // Default constructor
    public TestCase() {
    }

   // Parameterized constructor
    public TestCase(int id, String input, String expectedOutput, int problemId, boolean sample, String createdAt) {
    this.id = id;
    this.input = input;
    this.expectedOutput = expectedOutput;
    this.problemId = problemId;
    this.sample = sample;
    this.createdAt = createdAt;
    }
    // Getter for id
    public int getId() {
        return id;
    }

    // Setter for id
    public void setId(int id) {
        this.id = id;
    }

    // Getter for input
    public String getInput() {
        return input;
    }

    // Setter for input
    public void setInput(String input) {
        this.input = input;
    }

    // Getter for expectedOutput
    public String getExpectedOutput() {
        return expectedOutput;
    }

    // Setter for expectedOutput
    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }

    // Getter for problemId
    public int getProblemId() {
        return problemId;
    }

    // Setter for problemId
    public void setProblemId(int problemId) {
        this.problemId = problemId;
    }       

    // Getter for sample
    public boolean isSample() {
        return sample;
    }

    // Setter for sample
    public void setSample(boolean sample) {
        this.sample = sample;
    }

    // Getter for createdAt     
    public String getCreatedAt() {
        return createdAt;
    }

    // Setter for createdAt
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
