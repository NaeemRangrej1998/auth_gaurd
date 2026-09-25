package com.example.backend.service;

import com.example.backend.dto.permission.PermissionRequest;
import com.example.backend.dto.permission.PermissionResponse;
import com.example.backend.entity.Module;
import com.example.backend.entity.Role;
import com.example.backend.entity.RolePermission;
import com.example.backend.repository.ModuleRepository;
import com.example.backend.repository.RolePermissionRepository;
import com.example.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final RolePermissionRepository rolePermissionRepository;
    private final RoleRepository roleRepository;
    private final ModuleRepository moduleRepository;

    public PermissionResponse setPermission(Long roleId, PermissionRequest request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        Module module = moduleRepository.findById(request.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found"));

        RolePermission permission = rolePermissionRepository
                .findByRole_RoleIdAndModule_ModuleId(roleId, request.getModuleId())
                .orElse(RolePermission.builder().role(role).module(module).build());

        permission.setCanAdd(request.getCanAdd());
        permission.setCanEdit(request.getCanEdit());
        permission.setCanDelete(request.getCanDelete());
        permission.setCanView(request.getCanView());

        return mapToResponse(rolePermissionRepository.save(permission));
    }

    public List<PermissionResponse> getPermissionsForRole(Long roleId) {
        return rolePermissionRepository.findByRole_RoleId(roleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deletePermission(Long permissionId) {
        rolePermissionRepository.deleteById(permissionId);
    }

    private PermissionResponse mapToResponse(RolePermission permission) {
        String accessTypes = String.format("{\"add\":%b,\"edit\":%b,\"delete\":%b,\"view\":%b}",
                permission.getCanAdd(), permission.getCanEdit(), permission.getCanDelete(), permission.getCanView());

        return PermissionResponse.builder()
                .permissionId(permission.getId())
                .roleId(permission.getRole().getRoleId())
                .moduleId(permission.getModule().getModuleId())
                .accessTypes(accessTypes)
                .module(PermissionResponse.ModuleDto.builder()
                        .moduleId(permission.getModule().getModuleId())
                        .moduleName(permission.getModule().getModuleName())
                        .build())
                .build();
    }
}
