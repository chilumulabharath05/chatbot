package com.app.chatbot.service;

import com.app.chatbot.dto.ConversationDtos.*;
import com.app.chatbot.entity.*;
import com.app.chatbot.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<ConversationSummary> getConversations(Long userId) {
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId)
            .stream()
            .map(c -> {
                List<Message> messages = c.getMessages();
                String lastMsg = "";
                if (messages != null && !messages.isEmpty()) {
                    Message last = messages.get(messages.size() - 1);
                    lastMsg = last.getContent().length() > 60
                        ? last.getContent().substring(0, 60) + "..."
                        : last.getContent();
                }
                return ConversationSummary.builder()
                    .id(c.getId())
                    .title(c.getTitle())
                    .createdAt(c.getCreatedAt())
                    .updatedAt(c.getUpdatedAt())
                    .modelName(c.getModelName())
                    .messageCount(messages != null ? messages.size() : 0)
                    .lastMessage(lastMsg)
                    .build();
            })
            .collect(Collectors.toList());
    }

    public ConversationDetail getConversation(Long id, Long userId) {
        Conversation conv = conversationRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));

        List<MessageDto> msgs = conv.getMessages().stream()
            .map(m -> MessageDto.builder()
                .id(m.getId())
                .role(m.getRole())
                .content(m.getContent())
                .timestamp(m.getTimestamp())
                .modelUsed(m.getModelUsed())
                .build())
            .collect(Collectors.toList());

        return ConversationDetail.builder()
            .id(conv.getId())
            .title(conv.getTitle())
            .createdAt(conv.getCreatedAt())
            .updatedAt(conv.getUpdatedAt())
            .modelName(conv.getModelName())
            .messages(msgs)
            .build();
    }

    @Transactional
    public Conversation createConversation(Long userId, String title, String modelName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conv = Conversation.builder()
            .title(title != null ? title : "New Chat")
            .user(user)
            .modelName(modelName != null ? modelName : "gemini-1.5-flash")
            .build();

        return conversationRepository.save(conv);
    }

    @Transactional
    public Conversation renameConversation(Long id, Long userId, String newTitle) {
        Conversation conv = conversationRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conv.setTitle(newTitle);
        return conversationRepository.save(conv);
    }

    @Transactional
    public void deleteConversation(Long id, Long userId) {
        Conversation conv = conversationRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversationRepository.delete(conv);
    }

    @Transactional
    public Message addMessage(Long conversationId, Long userId, String role, String content, String modelUsed) {
        Conversation conv = conversationRepository.findByIdAndUserId(conversationId, userId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = Message.builder()
            .conversation(conv)
            .role(role)
            .content(content)
            .modelUsed(modelUsed)
            .build();

        Message saved = messageRepository.save(message);

        // Auto-title from first user message
        if (role.equals("user") && (conv.getTitle() == null || conv.getTitle().equals("New Chat"))) {
            String autoTitle = content.length() > 40 ? content.substring(0, 40) + "..." : content;
            conv.setTitle(autoTitle);
            conversationRepository.save(conv);
        }

        return saved;
    }

    public List<Message> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }
}
