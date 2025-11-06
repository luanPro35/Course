package com.project.courseweb.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.courseweb.dtos.ApiResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.enums.SuccessCode;
import com.project.courseweb.services.PostService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

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
    ApiResponse<PostResponse> createPostStatusPublished(@RequestBody PostRequest post) {
        return ApiResponse.ok(this.postService.createPost(post), SuccessCode.CREATE_POST_SUCCESS);
    }
}