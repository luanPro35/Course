package com.project.courseweb.configurations;

import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.entities.authentication.Permission;
import com.project.courseweb.enums.CategoryType;
import com.project.courseweb.enums.Permissions;
import com.project.courseweb.enums.Roles;
import com.project.courseweb.services.AuthService;
import com.project.courseweb.services.CategoryService;
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
    CategoryService categoryService;
    AuthService authService;

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
        var permission_view_course = this.permissionService.createPermission(
                Permissions.VIEW_COURSE.toString(), "View course"
        );
        var permission_create_post = this.permissionService.createPermission(
                Permissions.CREATE_POST.toString(), "Create post"
        );
        var permission_edit_post = this.permissionService.createPermission(
                Permissions.EDIT_POST.toString(), "Edit post"
        );
        var permission_delete_post = this.permissionService.createPermission(
                Permissions.DELETE_POST.toString(), "Delete post"
        );
        var permission_enroll_course = this.permissionService.createPermission(
                Permissions.ENROLL_COURSE.toString(), "Enroll course"
        );
        Set<Permission> permissions_admin = new HashSet<>();
        permissions_admin.add(permission_upload_course);
        permissions_admin.add(permission_delete_course);
        permissions_admin.add(permission_edit_course);
        permissions_admin.add(permission_create_post);
        permissions_admin.add(permission_edit_post);
        permissions_admin.add(permission_delete_post);
        permissions_admin.add(permission_view_course);
        permissions_admin.add(permission_enroll_course);
        Set<Permission> permissions_user = new HashSet<>();
        permissions_user.add(permission_create_post);
        permissions_user.add(permission_edit_post);
        permissions_user.add(permission_delete_post);
        permissions_user.add(permission_view_course);
        permissions_user.add(permission_enroll_course);

        this.roleService.createRole(Roles.USER.name(), "User", permissions_user);
        this.roleService.createRole(Roles.ADMIN.name(), "Admin", permissions_admin);

        this.categoryService.createCategory(CategoryType.cpp);
        this.categoryService.createCategory(CategoryType.devops);
        this.categoryService.createCategory(CategoryType.javascript);
        this.categoryService.createCategory(CategoryType.python);
        this.categoryService.createCategory(CategoryType.react_native);

        this.authService.createAuthAdmin(Auth.builder()
                .email("admin@gmail.com")
                .passwordHash("admin123")
                .phone("1234567890")
                .build());

    }
}
