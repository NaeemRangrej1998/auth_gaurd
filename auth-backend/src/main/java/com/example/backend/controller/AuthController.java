package com.example.backend.controller;

import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.LoginResponse;
import com.example.backend.dto.auth.UserPermissionsResponse;
import com.example.backend.dto.permission.PermissionResponse;
import com.example.backend.response.ApiResponse;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(200, "User logged in successfully", loginResponse));
    }
    
    @GetMapping("/me/permissions")
    public ResponseEntity<ApiResponse<UserPermissionsResponse>> getMyPermissions(Authentication authentication) {
        String dummyUserData = "c7cf15f687cdc15a7ecc336bb5fe30a3:edfa0556672fa78b66075974ad99cf0bff3831cce56d83287331690d4bf2dfb60cae65ed11bfa042b428d580ea3e7c007b8e1c59861939728b808343749a89ae4ef752ec5e54daa0165f338fe87193c5f36adcd3288ae29bc7fdd226c6f47a5e54b8243783e46d7be9dcf17c0e61eadc35b762f02dfb3dc195467910194a7e54ebe089efd98ad8e535c008844a9347d1";
        UserPermissionsResponse response = UserPermissionsResponse.builder()
                .userData(dummyUserData)
                .permissions(authService.getMyPermissions(authentication.getName()))
                .build();
        return ResponseEntity.ok(new ApiResponse<>(200, "user data fetched successfully", response));
    }
}
