package com.project.courseweb.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.PostService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;


import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/posts")
public class PostController {
    PostService postService;

    @PostMapping("/upload-thumbnail")
    ApiResponse<FileResponse> uploadPostThumbnail(@RequestParam ("file") MultipartFile file) {
        return ApiResponse.ok(this.postService.uploadPostThumbnail(file), SuccessCode.UPLOAD_POST_THUMBNAIL_SUCCESS);
    }

    @PostMapping("/create-post")
    ApiResponse<PostResponse> createPost(@RequestBody PostRequest post) {
        return ApiResponse.ok(this.postService.createPost(post), SuccessCode.CREATE_POST_SUCCESS);
    }

    @GetMapping("/my-posts")
    ApiResponse<PageResponse<PostResponse>> getPostsByStatus(@RequestParam ("status") String status, Pageable pageable) {
        return ApiResponse.ok(this.postService.getPostsByStatus(pageable, status), SuccessCode.GET_POSTS_BY_STATUS_SUCCESS);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending-posts")
    ApiResponse<PageResponse<PostResponse>> getPostsByStatusPending(Pageable pageable) {
        return ApiResponse.ok(this.postService.getPostsByStatusPending(pageable), SuccessCode.GET_POSTS_BY_STATUS_SUCCESS);
    }
    
    @GetMapping("/my-posts/{id}")
    ApiResponse<PostResponse> getPostById(@PathVariable Long id) {
        return ApiResponse.ok(this.postService.getPostById(id), SuccessCode.GET_POST_SUCCESS);
    }

    @PutMapping("/my-posts/update-post/{id}")
    ApiResponse<PostResponse> updatePost(@PathVariable Long id, @RequestBody PostRequest request) {
        return ApiResponse.ok(this.postService.updatePost(id, request), SuccessCode.UPDATED_POST_SUCCESS);
    }

    @GetMapping("/published")
    ApiResponse<PageResponse<PostResponse>> getAllPosts(Pageable pageable) {
        return ApiResponse.ok(this.postService.getAllPostsByStatusPublished(pageable), SuccessCode.GET_POST_SUCCESS);
    }
    
    @DeleteMapping("/my-posts/{id}")
    ApiResponse<Void> deletePost(@PathVariable Long id) {
        this.postService.deletePost(id);
        return ApiResponse.ok(null, SuccessCode.DELETE_POST_SUCCESS);
    }
}  