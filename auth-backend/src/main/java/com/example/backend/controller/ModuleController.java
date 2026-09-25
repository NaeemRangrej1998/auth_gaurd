package com.example.backend.controller;

import com.example.backend.dto.module.ModuleRequest;
import com.example.backend.dto.module.ModuleResponse;
import com.example.backend.response.ApiResponse;
import com.example.backend.service.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @PreAuthorize("hasPermission('Module', 'add')")
    @PostMapping
    public ResponseEntity<ApiResponse<ModuleResponse>> createModule(@Valid @RequestBody ModuleRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Module created", moduleService.createModule(request)));
    }

    @PreAuthorize("hasPermission('Module', 'view')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ModuleResponse>>> getAllModules() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Modules fetched", moduleService.getAllModules()));
    }

    @PreAuthorize("hasPermission('Module', 'delete')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Module deleted", null));
    }
}
