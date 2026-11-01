package com.codearena.model;

public class Problem {

    // Problem details
    private int id;
    private String title;
    private String description;
    private String difficulty;
    private String constraints;
    private String inputFormat;
    private String outputFormat;
    private String sampleInput;
    private String sampleOutput;
    private String createdAt;
    private boolean active;

    // Default constructor
    public Problem() {

    }

    // Parameterized constructor
    public Problem(int id, String title, String description, String difficulty) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
    }

    // Getter for id
    public int getId() {
        return id;
    }

    // Setter for id
    public void setId(int id) {
    this.id = id;
    }

    // Getter for title
    public String getTitle() {
        return title;
    }

    //setter for title
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
    }   

    // Getter for difficulty
    public String getDifficulty() {
       return difficulty;
    }

    // Setter for difficulty
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    // Getter for constraints
    public String getConstraints() {
        return constraints;
    }

    // Setter for constraints
    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }

    // Getter for inputFormat
    public String getInputFormat() {
       return inputFormat;
    }

    // Setter for inputFormat
    public void setInputFormat(String inputFormat) {
        this.inputFormat = inputFormat;
    }

    // Getter for outputFormat
    public String getOutputFormat() {
        return outputFormat;
    }

    // Setter for outputFormat
    public void setOutputFormat(String outputFormat) {
        this.outputFormat = outputFormat;
    }

    // Getter for sampleInput
    public String getSampleInput() {    
        return sampleInput;
    }           

    // Setter for sampleInput
    public void setSampleInput(String sampleInput) {        
        this.sampleInput = sampleInput;
    }

    // Getter for sampleOutput
    public String getSampleOutput() {        
        return sampleOutput;
    }                   

    // Setter for sampleOutput
    public void setSampleOutput(String sampleOutput) {
        this.sampleOutput = sampleOutput;
    }               

    // Getter for createdAt
    public String getCreatedAt() {
        return createdAt;
    }   

    // Setter for createdAt
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }   

    // Getter for active
    public boolean isActive() { 
        return active;
    }

    // Setter for active
    public void setActive(boolean active) {
        this.active = active;
    }                       
}