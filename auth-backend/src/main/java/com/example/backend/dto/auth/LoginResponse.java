package com.example.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private UserCheckDto userCheck;
    private RoleDto role;
    private java.util.List<com.example.backend.dto.permission.PermissionResponse> permissions;

    @Data
    @Builder
    public static class UserCheckDto {
        private Long userId;
        private String userName;
        private String firstName;
        private String lastName;
        private String email;
        private Long roleId;
        private Boolean isActive;
        private Boolean isDeleted;
    }

    @Data
    @Builder
    public static class RoleDto {
        private Long roleId;
        private String roleName;
        private String description;
        private Boolean isActive;
    }
}
