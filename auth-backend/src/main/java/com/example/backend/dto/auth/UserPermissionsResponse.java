package com.example.backend.dto.auth;

import com.example.backend.dto.permission.PermissionResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPermissionsResponse {
    private String userData;
    private List<PermissionResponse> permissions;
}
