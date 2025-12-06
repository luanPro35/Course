package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.CourseCreateRequest;
import com.project.courseweb.dtos.request.CourseIngredientUpdateRequest;
import com.project.courseweb.dtos.response.*;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/admin")
public class AdminController {
    PostService postService;
    CourseService courseService;
    OrderService orderService;
    DashboardService dashboardService;
    UserService userService;

    @PostMapping("/courses/create")
    ApiResponse<CourseResponse> createCourse(@RequestBody CourseCreateRequest request) {
        return ApiResponse.ok(this.courseService.createCourse(request), SuccessCode.CREATE_COURSE_SUCCESS);
    }

    @PostMapping("/courses/upload-thumbnail")
    ApiResponse<FileResponse> uploadThumbnail(@RequestParam("file") MultipartFile file) {
        return ApiResponse.ok(this.courseService.uploadCourseThumbnail(file), SuccessCode.UPLOAD_FILE_SUCCESS);
    }

    @GetMapping("/courses/get/{id}")
    ApiResponse<CourseResponse> getCourseById(@PathVariable Long id) {
        return ApiResponse.ok(this.courseService.getCourseById(id), SuccessCode.GET_COURSE_SUCCESS);
    }

    @DeleteMapping("/courses/delete/{id}")
    ApiResponse<Void> deleteCourse(@PathVariable Long id) {
        this.courseService.deleteCourse(id);
        return ApiResponse.ok(null, SuccessCode.DELETE_COURSE_SUCCESS);
    }

    @PutMapping("/courses/update/{id}")
    ApiResponse<CourseResponse> updateFullCourse(@PathVariable Long id, @RequestBody CourseIngredientUpdateRequest request) {
        return ApiResponse.ok(this.courseService.updateCourseIngredient(id, request), SuccessCode.UPDATE_COURSE_SUCCESS);
    }

//    @PatchMapping("/courses/update/{id}")
//    ApiResponse<CourseResponse> updateCourse(@PathVariable Long id, @RequestBody CourseUpdateRequest request) {
//        return ApiResponse.ok(this.courseService.updateCourseInfo(id, request), SuccessCode.UPDATE_COURSE_SUCCESS);
//    }

    @PatchMapping("/courses/update-status/{id}")
    ApiResponse<CourseResponse> updateStatusCourse(@PathVariable Long id, @RequestParam String status) {
        return ApiResponse.ok(this.courseService.updateStatusCourse(id, status), SuccessCode.UPDATE_STATUS_COURSE_SUCCESS);
    }

    @GetMapping("/courses")
    ApiResponse<PageResponse<CourseLabelResponse>> getCoursesByStatus(@RequestParam String status, Pageable pageable) {
        return ApiResponse.ok(this.courseService.getCoursesByStatus(status, pageable), SuccessCode.GET_COURSES_SUCCESS);
    }

    @GetMapping("/orders")
    ApiResponse<PageResponse<OrderResponse>> getOrdersByStatus(Pageable pageable) {
        return ApiResponse.ok(this.orderService.getAllOrders(pageable), SuccessCode.GET_ORDERS_SUCCESS);
    }

    @GetMapping("/posts")
    ApiResponse<PageResponse<PostResponse>> getAllPosts(Pageable pageable) {
        return ApiResponse.ok(this.postService.getAllPostsByStatusPublished(pageable), SuccessCode.GET_POST_SUCCESS);
    }

    @GetMapping("/dashboard/stats")
    ApiResponse<DashboardStatsResponse> getDashboardStats() {
        return ApiResponse.ok(this.dashboardService.getDashboardStats(), SuccessCode.GET_DASHBOARD_STATS_SUCCESS);
    }

    @GetMapping("/users")
    ApiResponse<PageResponse<UserDashboardResponse>> getUsers(Pageable pageable) {
        return ApiResponse.ok(this.userService.getUserList(pageable), SuccessCode.GET_USERS_SUCCESS);
    }

    @DeleteMapping("/users/delete/{id}")
    ApiResponse<Void> deleteUser(@PathVariable Long id) {
        this.userService.deleteUser(id);
        return ApiResponse.ok(null, SuccessCode.DELETE_USER_SUCCESS);
    }
}
