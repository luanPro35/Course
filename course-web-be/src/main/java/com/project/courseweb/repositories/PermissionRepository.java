package com.project.courseweb.repositories;

import com.project.courseweb.entities.authentication.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
