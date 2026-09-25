package com.example.backend.service;

import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.LoginResponse;
import com.example.backend.dto.permission.PermissionResponse;
import com.example.backend.entity.User;
import com.example.backend.repository.RolePermissionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!user.getIsActive() || user.getIsDeleted()) {
            throw new BadCredentialsException("User account is not active");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), java.util.Collections.emptyList()),
                user.getId(),
                user.getRole().getRoleId()
        );

        return LoginResponse.builder()
                .token(token)
                .userCheck(LoginResponse.UserCheckDto.builder()
                        .userId(user.getId())
                        .userName(user.getUsername())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .roleId(user.getRole().getRoleId())
                        .isActive(user.getIsActive())
                        .isDeleted(user.getIsDeleted())
                        .build())
                .role(LoginResponse.RoleDto.builder()
                        .roleId(user.getRole().getRoleId())
                        .roleName(user.getRole().getRoleName())
                        .description(user.getRole().getDescription())
                        .isActive(user.getRole().getIsActive())
                        .build())
                .permissions(getMyPermissions(user.getUsername()))
                .build();
    }
    
    public List<PermissionResponse> getMyPermissions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return rolePermissionRepository.findByRole_RoleId(user.getRole().getRoleId()).stream()
                .map(permission -> {
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
                }).collect(Collectors.toList());
    }
}
