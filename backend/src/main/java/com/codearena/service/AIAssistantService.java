
package com.codearena.service;

public class AIAssistantService {

    public String generateResponse(String message) {

        if (message == null || message.trim().isEmpty()) {
            return "Please enter a question so I can help you.";
        }

        String question = message.toLowerCase().trim();

        if (question.contains("recursion")) {
            return "Recursion is a programming technique where a method calls itself. " +
                   "Every recursive method needs a base case to stop the calls.";
        }

        if (question.contains("array")) {
            return "An array stores multiple values of the same data type. " +
                   "You can access each element using its index, starting from 0.";
        }

        if (question.contains("oops") || question.contains("object oriented")) {
            return "The four main OOP principles are Encapsulation, Inheritance, " +
                   "Polymorphism, and Abstraction.";
        }

        if (question.contains("hashmap")) {
            return "HashMap stores data as key-value pairs. It provides efficient " +
                   "lookup using keys and belongs to Java's Collections Framework.";
        }

        if (question.contains("exception")) {
            return "Java exception handling uses try, catch, finally, throw, and throws " +
                   "to handle runtime errors gracefully.";
        }

        if (question.contains("loop")) {
            return "Java supports for, while, and do-while loops. " +
                   "They help execute a block of code repeatedly.";
        }

        if (question.contains("class") || question.contains("object")) {
            return "A class is a blueprint for creating objects. An object is an " +
                   "instance of a class containing state and behavior.";
        }

        if (question.contains("string")) {
            return "In Java, String represents text. Strings are immutable, " +
                   "meaning their contents cannot be changed after creation.";
        }

        return "Good question! Try breaking the programming problem into smaller " +
               "steps. Identify the input, expected output, and logic. " +
               "You can also ask me about Java, arrays, loops, OOP, recursion, or exceptions.";
    }
}
