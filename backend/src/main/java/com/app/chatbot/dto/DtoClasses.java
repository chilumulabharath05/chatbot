package com.app.chatbot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

// ============ Auth DTOs ============
class AuthRequest {
    public String email;
    public String password;
    public String username;
}

class AuthResponse {
    public String token;
    public String email;
    public String username;
    public Long userId;
}

class SignupRequest {
    public String email;
    public String password;
    public String username;
}

// ============ Chat DTOs ============
class ChatMessage {
    public String role;
    public String content;
}

// ============ Conversation DTOs ============
class ConversationSummary {
    public Long id;
    public String title;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public String modelName;
    public int messageCount;
}
