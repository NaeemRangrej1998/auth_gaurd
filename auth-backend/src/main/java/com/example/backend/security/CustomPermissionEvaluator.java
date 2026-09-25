package com.example.backend.security;

import com.example.backend.entity.RolePermission;
import com.example.backend.repository.RolePermissionRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.io.Serializable;

@Component("customPermissionEvaluator")
@RequiredArgsConstructor
public class CustomPermissionEvaluator implements PermissionEvaluator {

    private final UserRepository userRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return false;
        
        var user = userOpt.get();
        if (!user.getIsActive() || user.getIsDeleted() || !user.getRole().getIsActive()) {
            return false;
        }

        if ("SuperAdmin".equalsIgnoreCase(user.getRole().getRoleName())) {
            return true;
        }

        String moduleName = targetDomainObject.toString();
        String action = permission.toString();

        return rolePermissionRepository.findByRole_RoleId(user.getRole().getRoleId()).stream()
                .filter(rp -> rp.getModule().getModuleName().equalsIgnoreCase(moduleName))
                .anyMatch(rp -> hasActionPermission(rp, action));
    }

    private boolean hasActionPermission(RolePermission rp, String action) {
        return switch (action.toLowerCase()) {
            case "add" -> rp.getCanAdd();
            case "edit" -> rp.getCanEdit();
            case "delete" -> rp.getCanDelete();
            case "view" -> rp.getCanView();
            default -> false;
        };
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        return false;
    }
}
