package com.app.chatbot.service;

import com.app.chatbot.entity.Message;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AIService {

    @Value("AIzaSyDKfSahSdSUF3rPvKx2XmcQ2xLXGP9mzX0")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public String generateResponse(String userMessage, List<Message> history, String model) {
        String modelName = (model != null && !model.isEmpty()) ? model : "gemini-1.5-flash-latest";
        String url = apiUrl + "/" + modelName + ":generateContent?key=" + apiKey;

        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            ArrayNode contents = requestBody.putArray("contents");

            // Add conversation history
            for (Message msg : history) {
                ObjectNode contentNode = contents.addObject();
                contentNode.put("role", msg.getRole().equals("assistant") ? "model" : "user");
                ArrayNode parts = contentNode.putArray("parts");
                parts.addObject().put("text", msg.getContent());
            }

            // Add current user message
            ObjectNode currentMsg = contents.addObject();
            currentMsg.put("role", "user");
            ArrayNode parts = currentMsg.putArray("parts");
            parts.addObject().put("text", userMessage);

            // Generation config
            ObjectNode generationConfig = requestBody.putObject("generationConfig");
            generationConfig.put("temperature", 0.9);
            generationConfig.put("topK", 1);
            generationConfig.put("topP", 1);
            generationConfig.put("maxOutputTokens", 8192);

            // Safety settings
            ArrayNode safetySettings = requestBody.putArray("safetySettings");
            addSafetySetting(safetySettings, "HARM_CATEGORY_HARASSMENT", "BLOCK_MEDIUM_AND_ABOVE");
            addSafetySetting(safetySettings, "HARM_CATEGORY_HATE_SPEECH", "BLOCK_MEDIUM_AND_ABOVE");
            addSafetySetting(safetySettings, "HARM_CATEGORY_SEXUALLY_EXPLICIT", "BLOCK_MEDIUM_AND_ABOVE");
            addSafetySetting(safetySettings, "HARM_CATEGORY_DANGEROUS_CONTENT", "BLOCK_MEDIUM_AND_ABOVE");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                return extractResponseText(responseJson);
            }

            return "I encountered an error processing your request. Please try again.";

        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            if (e.getMessage() != null && e.getMessage().contains("API key")) {
                return "⚠️ Invalid API key. Please configure your Gemini API key in `application.properties`.";
            }
            return "I'm sorry, I encountered an error: " + e.getMessage();
        }
    }

    private void addSafetySetting(ArrayNode safetySettings, String category, String threshold) {
        ObjectNode setting = safetySettings.addObject();
        setting.put("category", category);
        setting.put("threshold", threshold);
    }

    private String extractResponseText(JsonNode responseJson) {
        try {
            JsonNode candidates = responseJson.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }

            // Check for blocked content
            JsonNode promptFeedback = responseJson.path("promptFeedback");
            if (!promptFeedback.isMissingNode()) {
                String blockReason = promptFeedback.path("blockReason").asText();
                if (!blockReason.isEmpty()) {
                    return "I can't respond to that request. Reason: " + blockReason;
                }
            }

            return "No response generated. Please try again.";
        } catch (Exception e) {
            log.error("Error extracting response text: {}", e.getMessage());
            return "Error parsing AI response.";
        }
    }

    public List<String> getAvailableModels() {
        return List.of(
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro-latest",
            "gemini-2.0-flash"
        );
    }
}
