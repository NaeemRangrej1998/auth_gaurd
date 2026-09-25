package com.example.backend.dto.permission;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PermissionResponse {
    private Long permissionId;
    private Long roleId;
    private Long moduleId;
    private String accessTypes;
    private ModuleDto module;

    @Data
    @Builder
    public static class ModuleDto {
        private Long moduleId;
        private String moduleName;
    }
}
