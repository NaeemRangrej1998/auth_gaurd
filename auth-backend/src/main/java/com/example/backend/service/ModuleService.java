package com.example.backend.service;

import com.example.backend.dto.module.ModuleRequest;
import com.example.backend.dto.module.ModuleResponse;
import com.example.backend.entity.Module;
import com.example.backend.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleResponse createModule(ModuleRequest request) {
        if (moduleRepository.existsByModuleName(request.getModuleName())) {
            throw new RuntimeException("Module already exists");
        }
        Module module = Module.builder()
                .moduleName(request.getModuleName())
                .build();
        return mapToResponse(moduleRepository.save(module));
    }

    public List<ModuleResponse> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }

    private ModuleResponse mapToResponse(Module module) {
        return ModuleResponse.builder()
                .moduleId(module.getModuleId())
                .moduleName(module.getModuleName())
                .createdAt(module.getCreatedAt())
                .updatedAt(module.getUpdatedAt())
                .build();
    }
}
