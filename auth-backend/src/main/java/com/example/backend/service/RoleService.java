package com.example.backend.service;

import com.example.backend.dto.role.RoleRequest;
import com.example.backend.dto.role.RoleResponse;
import com.example.backend.entity.Role;
import com.example.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new RuntimeException("Role already exists");
        }
        Role role = Role.builder()
                .roleName(request.getRoleName())
                .description(request.getDescription())
                .isActive(true)
                .isDeleted(false)
                .build();
        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .filter(r -> !r.getIsDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RoleResponse getRoleById(Long id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToResponse(role);
    }

    public RoleResponse updateRole(Long id, RoleRequest request) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        
        if (!role.getRoleName().equals(request.getRoleName()) && roleRepository.existsByRoleName(request.getRoleName())) {
            throw new RuntimeException("Role already exists");
        }
        
        role.setRoleName(request.getRoleName());
        role.setDescription(request.getDescription());
        return mapToResponse(roleRepository.save(role));
    }

    public void updateRoleStatus(Long id, Boolean isActive) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        role.setIsActive(isActive);
        roleRepository.save(role);
    }

    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        role.setIsDeleted(true);
        roleRepository.save(role);
    }

    private RoleResponse mapToResponse(Role role) {
        return RoleResponse.builder()
                .roleId(role.getRoleId())
                .roleName(role.getRoleName())
                .description(role.getDescription())
                .isActive(role.getIsActive())
                .isDeleted(role.getIsDeleted())
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .build();
    }
}
