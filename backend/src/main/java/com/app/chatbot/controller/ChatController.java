package com.app.chatbot.controller;

import com.app.chatbot.dto.ChatRequest;
import com.app.chatbot.dto.ChatResponse;
import com.app.chatbot.entity.Conversation;
import com.app.chatbot.entity.Message;
import com.app.chatbot.service.AIService;
import com.app.chatbot.service.ConversationService;
import com.app.chatbot.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final AIService aiService;
    private final ConversationService conversationService;
    private final UserDetailsServiceImpl userDetailsService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        com.app.chatbot.entity.User user = userDetailsService.loadUserEntityByEmail(email);
        Long userId = user.getId();

        try {
            Long conversationId = request.getConversationId();

            // Create new conversation if not provided
            if (conversationId == null) {
                Conversation newConv = conversationService.createConversation(
                    userId, "New Chat", request.getModel()
                );
                conversationId = newConv.getId();
            }

            // Build message content (with file if provided)
            String messageContent = request.getMessage();
            if (request.getFileContent() != null && !request.getFileContent().isEmpty()) {
                messageContent += "\n\n[Attached file: " + request.getFileName() + "]\n" + request.getFileContent();
            }

            // Get conversation history
            List<Message> history = conversationService.getMessages(conversationId);

            // Save user message
            conversationService.addMessage(conversationId, userId, "user", messageContent, null);

            // Call AI
            String aiResponse = aiService.generateResponse(messageContent, history, request.getModel());

            // Save AI response
            Message savedMsg = conversationService.addMessage(
                conversationId, userId, "assistant", aiResponse, request.getModel()
            );

            return ResponseEntity.ok(ChatResponse.builder()
                .response(aiResponse)
                .conversationId(conversationId)
                .messageId(savedMsg.getId())
                .model(request.getModel())
                .success(true)
                .build());

        } catch (Exception e) {
            log.error("Chat error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ChatResponse.builder()
                .success(false)
                .error("An error occurred: " + e.getMessage())
                .build());
        }
    }

    @GetMapping("/models")
    public ResponseEntity<List<String>> getModels() {
        return ResponseEntity.ok(aiService.getAvailableModels());
    }
}
