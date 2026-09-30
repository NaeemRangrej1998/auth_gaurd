package com.example.backend.service;

import com.example.backend.dto.AreaRequest;
import com.example.backend.entity.Area;
import com.example.backend.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {
    private final AreaRepository areaRepository;

    public List<Area> getAllAreas() {
        return areaRepository.findAll();
    }

    public Area createArea(AreaRequest request) {
        Area area = Area.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return areaRepository.save(area);
    }
    
    public Area updateArea(Long id, AreaRequest request) {
        Area area = areaRepository.findById(id).orElseThrow(() -> new RuntimeException("Area not found"));
        area.setName(request.getName());
        area.setDescription(request.getDescription());
        return areaRepository.save(area);
    }
    
    public void deleteArea(Long id) {
        areaRepository.deleteById(id);
    }
}
