package com.abchome.service;

import com.abchome.dto.AuthResponse;
import com.abchome.dto.LoginRequest;
import com.abchome.dto.RegisterRequest;
import com.abchome.entity.Role;
import com.abchome.entity.User;
import com.abchome.repository.RoleRepository;
import com.abchome.repository.UserRepository;
import com.abchome.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role not seeded in DB"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(customerRole);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), Map.of("role", customerRole.getName()));
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), customerRole.getName());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User vanished after authentication"));

        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().getName()));
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().getName());
    }
}