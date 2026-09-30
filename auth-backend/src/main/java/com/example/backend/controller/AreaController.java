package com.example.backend.controller;

import com.example.backend.dto.AreaRequest;
import com.example.backend.entity.Area;
import com.example.backend.response.ApiResponse;
import com.example.backend.service.AreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {
    private final AreaService areaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Area>>> getAllAreas() {
        return ResponseEntity.ok(new ApiResponse<>(200, "Areas fetched", areaService.getAllAreas()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Area>> createArea(@Valid @RequestBody AreaRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Area created", areaService.createArea(request)));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Area>> updateArea(@PathVariable Long id, @Valid @RequestBody AreaRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "Area updated", areaService.updateArea(id, request)));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArea(@PathVariable Long id) {
        areaService.deleteArea(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Area deleted", null));
    }
}
