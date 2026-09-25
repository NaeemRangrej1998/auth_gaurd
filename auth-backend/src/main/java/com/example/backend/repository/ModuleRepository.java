package com.example.backend.repository;

import com.example.backend.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    Optional<Module> findByModuleName(String moduleName);
    boolean existsByModuleName(String moduleName);
}
