package com.codearena.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class AIAssistantService {

    private static final String API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private final ObjectMapper mapper = new ObjectMapper();

    private final HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();

    public String generateResponse(String message) {

        if (message == null || message.trim().isEmpty()) {
            return "Please enter a question so I can help you.";
        }

        String apiKey = System.getenv("GEMINI_API_KEY");

        // No API key? Use the existing Java fallback.
        if (apiKey == null || apiKey.isBlank()) {
            return generateFallbackResponse(message);
        }

        try {
            ObjectNode requestBody = mapper.createObjectNode();

            ArrayNode contents = requestBody.putArray("contents");
            ObjectNode content = contents.addObject();
            ArrayNode parts = content.putArray("parts");

            parts.addObject().put("text",
                "You are CodeArena's friendly Java programming tutor. " +
                "Explain programming concepts clearly with examples. " +
                "Keep answers beginner-friendly and focused on coding. " +
                "Student's question: " + message
            );

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .timeout(Duration.ofSeconds(20))
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(
                    mapper.writeValueAsString(requestBody)))
                .build();

            HttpResponse<String> response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() == 200) {
                JsonNode result = mapper.readTree(response.body());

                JsonNode textNode = result.path("candidates")
                    .path(0).path("content")
                    .path("parts").path(0).path("text");

                if (!textNode.isMissingNode()
                        && !textNode.asText().isBlank()) {
                    return textNode.asText();
                }
            }

        } catch (Exception e) {
            System.err.println(
                "Gemini API unavailable. Using fallback response."
            );
        }

        // API failure? Still provide a response.
        return generateFallbackResponse(message);
    }

    private String generateFallbackResponse(String message) {

        String question = message.toLowerCase().trim();

        if (question.contains("recursion")) {
            return "Recursion is a programming technique where a method calls itself. " +
                   "Every recursive method needs a base case to stop the calls.";
        }

        if (question.contains("array")) {
            return "An array stores multiple values of the same data type. " +
                   "You can access each element using its index, starting from 0.";
        }

        if (question.contains("oops") ||
                question.contains("object oriented")) {
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

        if (question.contains("class") ||
                question.contains("object")) {
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
