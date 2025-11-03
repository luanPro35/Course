package com.project.courseweb.configurations;

import com.project.courseweb.entities.authentication.Permission;
import com.project.courseweb.enums.Permissions;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.services.PermissionService;
import com.project.courseweb.services.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ApplicationInitConfig implements ApplicationRunner {
    PermissionService permissionService;
    RoleService roleService;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Application started");
        var permission_upload_course = this.permissionService.createPermission(
                Permissions.UPLOAD_COURSE.toString(), "Upload course"
        );
        var permission_delete_course = this.permissionService.createPermission(
                Permissions.DELETE_COURSE.toString(), "Delete course"
        );
        var permission_edit_course = this.permissionService.createPermission(
                Permissions.EDIT_COURSE.toString(), "Edit course"
        );
        Set<Permission> permissions_admin = new HashSet<>();
        permissions_admin.add(permission_upload_course);
        permissions_admin.add(permission_delete_course);
        permissions_admin.add(permission_edit_course);
        this.roleService.createRole(
                Roles.ADMIN.name(), "Admin", permissions_admin
        );
        Set<Permission> permissions_user = new HashSet<>();
        this.roleService.createRole(Roles.USER.name(), "User",permissions_user);


    }
}
