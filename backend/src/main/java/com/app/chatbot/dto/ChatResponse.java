package com.app.chatbot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private String response;
    private Long conversationId;
    private Long messageId;
    private String model;
    private boolean success;
    private String error;
}
