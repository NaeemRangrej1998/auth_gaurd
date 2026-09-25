package com.example.backend.controller;

import com.example.backend.dto.user.UserRequest;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.response.ApiResponse;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasPermission('User', 'add')")
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "User created", userService.createUser(request)));
    }

    @PreAuthorize("hasPermission('User', 'view')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Users fetched", userService.getAllUsers()));
    }

    @PreAuthorize("hasPermission('User', 'view')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "User fetched", userService.getUserById(id)));
    }

    @PreAuthorize("hasPermission('User', 'edit')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "User updated", userService.updateUser(id, request)));
    }

    @PreAuthorize("hasPermission('User', 'edit')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(@PathVariable Long id, @RequestParam Boolean isActive) {
        userService.updateUserStatus(id, isActive);
        return ResponseEntity.ok(new ApiResponse<>(200, "User status updated", null));
    }

    @PreAuthorize("hasPermission('User', 'delete')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "User deleted", null));
    }
}
