package com.example.backend.controller;

import com.example.backend.dto.permission.PermissionRequest;
import com.example.backend.dto.permission.PermissionResponse;
import com.example.backend.response.ApiResponse;
import com.example.backend.service.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles/{roleId}/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    public ResponseEntity<ApiResponse<PermissionResponse>> setPermission(
            @PathVariable Long roleId,
            @Valid @RequestBody PermissionRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Permission saved", permissionService.setPermission(roleId, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionResponse>>> getPermissions(@PathVariable Long roleId) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Permissions fetched", permissionService.getPermissionsForRole(roleId)));
    }

    @DeleteMapping("/{permissionId}")
    public ResponseEntity<ApiResponse<Void>> deletePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {
        permissionService.deletePermission(permissionId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Permission deleted", null));
    }
}
