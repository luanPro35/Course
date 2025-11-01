package com.project.courseweb.repositories;

import com.project.courseweb.entities.authentication.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}
