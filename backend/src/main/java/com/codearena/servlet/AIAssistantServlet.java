
package com.codearena.servlet;

import com.codearena.service.AIAssistantService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/ai-assistant")
public class AIAssistantServlet extends HttpServlet {

    private final AIAssistantService assistantService =
            new AIAssistantService();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> result = new HashMap<>();

        try {
            Map<String, String> requestData =
                    objectMapper.readValue(
                            request.getInputStream(),
                            Map.class
                    );

            String message = requestData.get("message");

            if (message == null || message.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                result.put("success", false);
                result.put("error", "Message cannot be empty.");
            } else {
                String answer =
                        assistantService.generateResponse(message);

                result.put("success", true);
                result.put("reply", answer);
            }

        } catch (Exception exception) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            result.put("success", false);
            result.put("error", "Unable to process your message.");
        }

        objectMapper.writeValue(response.getOutputStream(), result);
    }
}
