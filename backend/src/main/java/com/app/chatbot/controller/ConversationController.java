package com.app.chatbot.controller;

import com.app.chatbot.dto.ConversationDtos.*;
import com.app.chatbot.entity.Conversation;
import com.app.chatbot.service.ConversationService;
import com.app.chatbot.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final UserDetailsServiceImpl userDetailsService;

    private Long getUserId(Authentication auth) {
        com.app.chatbot.entity.User user = userDetailsService.loadUserEntityByEmail(auth.getName());
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<ConversationSummary>> getAll(Authentication auth) {
        return ResponseEntity.ok(conversationService.getConversations(getUserId(auth)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationDetail> getOne(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(conversationService.getConversation(id, getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody CreateConversationRequest request,
            Authentication auth) {
        Conversation conv = conversationService.createConversation(
            getUserId(auth), request.getTitle(), request.getModelName()
        );
        return ResponseEntity.ok(Map.of(
            "id", conv.getId(),
            "title", conv.getTitle(),
            "createdAt", conv.getCreatedAt()
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> rename(
            @PathVariable Long id,
            @RequestBody RenameRequest request,
            Authentication auth) {
        Conversation conv = conversationService.renameConversation(id, getUserId(auth), request.getTitle());
        return ResponseEntity.ok(Map.of("id", conv.getId(), "title", conv.getTitle()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id, Authentication auth) {
        conversationService.deleteConversation(id, getUserId(auth));
        return ResponseEntity.ok(Map.of("message", "Conversation deleted"));
    }
}
