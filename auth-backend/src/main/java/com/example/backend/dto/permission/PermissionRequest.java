package com.example.backend.dto.permission;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PermissionRequest {
    @NotNull
    private Long moduleId;
    
    private Boolean canAdd = false;
    private Boolean canEdit = false;
    private Boolean canDelete = false;
    private Boolean canView = false;
}
