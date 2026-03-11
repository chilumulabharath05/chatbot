package com.app.chatbot.service;

import com.app.chatbot.dto.AuthDtos.*;
import com.app.chatbot.entity.User;
import com.app.chatbot.repository.UserRepository;
import com.app.chatbot.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                .success(false)
                .message("Email already in use")
                .build();
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .username(request.getUsername())
            .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getId());

        return AuthResponse.builder()
            .token(token)
            .email(saved.getEmail())
            .username(saved.getUsername())
            .userId(saved.getId())
            .success(true)
            .message("Account created successfully")
            .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                .success(false)
                .message("Invalid email or password")
                .build();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .username(user.getUsername())
            .userId(user.getId())
            .success(true)
            .message("Login successful")
            .build();
    }
}
