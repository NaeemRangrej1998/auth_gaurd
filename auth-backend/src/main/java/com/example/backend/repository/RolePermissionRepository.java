package com.example.backend.repository;

import com.example.backend.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    List<RolePermission> findByRole_RoleId(Long roleId);
    Optional<RolePermission> findByRole_RoleIdAndModule_ModuleId(Long roleId, Long moduleId);
    boolean existsByRole_RoleIdAndModule_ModuleId(Long roleId, Long moduleId);
}
