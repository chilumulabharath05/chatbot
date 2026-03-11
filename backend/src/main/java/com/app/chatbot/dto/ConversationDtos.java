package com.app.chatbot.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

public class ConversationDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationSummary {
        private Long id;
        private String title;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String modelName;
        private int messageCount;
        private String lastMessage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationDetail {
        private Long id;
        private String title;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String modelName;
        private List<MessageDto> messages;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageDto {
        private Long id;
        private String role;
        private String content;
        private LocalDateTime timestamp;
        private String modelUsed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateConversationRequest {
        private String title;
        private String modelName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RenameRequest {
        private String title;
    }
}
