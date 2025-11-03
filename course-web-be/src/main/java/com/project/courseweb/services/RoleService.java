package com.project.courseweb.services;

import com.project.courseweb.entities.authentication.Permission;
import com.project.courseweb.entities.authentication.Role;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public interface RoleService {
    void createRole(String roleName, String description, Set<Permission> permissions);

    Role getRoleByName(String roleName);
}
