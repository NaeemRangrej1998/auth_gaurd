package com.example.backend.controller;

import com.example.backend.dto.role.RoleRequest;
import com.example.backend.dto.role.RoleResponse;
import com.example.backend.response.ApiResponse;
import com.example.backend.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PreAuthorize("hasPermission('Role', 'add')")
    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(@Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Role created", roleService.createRole(request)));
    }

    @PreAuthorize("hasPermission('Role', 'view')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Roles fetched", roleService.getAllRoles()));
    }

    @PreAuthorize("hasPermission('Role', 'view')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Role fetched", roleService.getRoleById(id)));
    }

    @PreAuthorize("hasPermission('Role', 'edit')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(@PathVariable Long id, @Valid @RequestBody RoleRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Role updated", roleService.updateRole(id, request)));
    }

    @PreAuthorize("hasPermission('Role', 'edit')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateRoleStatus(@PathVariable Long id, @RequestParam Boolean isActive) {
        roleService.updateRoleStatus(id, isActive);
        return ResponseEntity.ok(new ApiResponse<>(200, "Role status updated", null));
    }

    @PreAuthorize("hasPermission('Role', 'delete')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Role deleted", null));
    }
}
