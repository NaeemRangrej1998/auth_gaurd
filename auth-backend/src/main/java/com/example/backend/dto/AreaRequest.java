package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AreaRequest {
    @NotBlank
    private String name;
    private String description;
}
