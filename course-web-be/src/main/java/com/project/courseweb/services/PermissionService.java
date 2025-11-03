package com.project.courseweb.services;

import com.project.courseweb.entities.authentication.Permission;
import org.springframework.stereotype.Service;

@Service
public interface PermissionService {
    Permission createPermission(String permissionName, String description);
}
