package com.project.courseweb.controllers;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.PostService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/posts")
public class PostController {
    PostService postService;

//    @PostMapping("/upload-thumbnail")
//    ApiResponse<FileResponse> uploadPostThumbnail(@RequestParam("file") MultipartFile file) {
//        return ApiResponse.ok(this.postService.uploadPostThumbnail(file), SuccessCode.UPLOAD_POST_THUMBNAIL_SUCCESS);
//    }

    @PostMapping("/create-post")
    ApiResponse<PostResponse> createPost(@RequestPart(value = "file", required = false) MultipartFile file,
                                         @RequestPart(value = "request") PostRequest post) {
        return ApiResponse.ok(this.postService.createPost(post, file), SuccessCode.CREATE_POST_SUCCESS);
    }

    @GetMapping("/my-posts")
    ApiResponse<PageResponse<PostResponse>> getPostsByStatus(@RequestParam("status") String status, Pageable pageable) {
        return ApiResponse.ok(this.postService.getPostsByStatus(pageable, status), SuccessCode.GET_POSTS_BY_STATUS_SUCCESS);
    }

    @GetMapping("/my-posts/{id}")
    ApiResponse<PostResponse> getPostById(@PathVariable Long id) {
        return ApiResponse.ok(this.postService.getPostById(id), SuccessCode.GET_POST_SUCCESS);
    }

    @PutMapping("/my-posts/update-post/{id}")
    ApiResponse<PostResponse> updatePost(@PathVariable Long id,
                                         @RequestPart(value = "file", required = false) MultipartFile file,
                                         @RequestPart(value = "request", required = false) PostRequest request) {
        return ApiResponse.ok(this.postService.updatePost(id, request, file), SuccessCode.UPDATED_POST_SUCCESS);
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