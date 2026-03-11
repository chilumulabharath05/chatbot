package com.app.chatbot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String message;
    private Long conversationId;
    private String model;
    private String fileContent;
    private String fileName;
    private String fileType;
}
