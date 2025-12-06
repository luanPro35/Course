package com.project.courseweb.services;


import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;


@Service
public interface PostService {
    FileResponse uploadPostThumbnail(MultipartFile file);

    PostResponse createPost(PostRequest request);

    PageResponse<PostResponse> getPostsByStatus(Pageable pageable, String status);

    PostResponse getPostById(Long id);

    PostResponse updatePost(Long id, PostRequest request);

    PageResponse<PostResponse> getAllPostsByStatusPublished(Pageable pageable);

    void deletePost(Long id);
}
