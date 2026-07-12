package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AuthDto;
import org.example.backend.service.AuthService;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for employee sign up, sign in, and profile management")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping({"/register", "/signup"})
    @Operation(summary = "Register or sign up a new employee")
    public ResponseEntity<AuthDto.UserDto> signup(@Valid @RequestBody AuthDto.UserRegistrationDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Log in using email and password, returning JWT token")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.UserLoginDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get the current authenticated user details")
    public ResponseEntity<AuthDto.UserDto> me() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PostMapping("/logout")
    @Operation(summary = "Clear/Invalidate session (client-side token removal)")
    public ResponseEntity<String> logout() {
        // Since JWT is stateless, server logout is informational or clients discard tokens.
        return ResponseEntity.ok("Successfully logged out");
    }
}
