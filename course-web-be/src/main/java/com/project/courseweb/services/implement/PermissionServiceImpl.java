package com.project.courseweb.services.implement;

import com.project.courseweb.entities.authentication.Permission;
import com.project.courseweb.repositories.PermissionRepository;
import com.project.courseweb.services.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class PermissionServiceImpl implements PermissionService {
    PermissionRepository permissionRepository;
    @Override
    public Permission createPermission(String permissionName, String description) {
         return  permissionRepository.findById(permissionName)
                .orElseGet(
                        () -> {
                                permissionRepository.save(
                                    Permission.builder()
                                            .name(permissionName)
                                            .description(description)
                                            .build()
                                );
                                return null;
                            }
                        );
    }
}
