package com.example.backend.dto.module;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ModuleRequest {
    @NotBlank
    private String moduleName;
}
