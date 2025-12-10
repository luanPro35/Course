package com.project.courseweb.services;


import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.PostResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public interface PostService {
//    FileResponse uploadPostThumbnail(MultipartFile file);

    PostResponse createPost(PostRequest request, MultipartFile file);

    PageResponse<PostResponse> getPostsByStatus(Pageable pageable, String status);

    PostResponse getPostById(Long id);

    PostResponse updatePost(Long id, PostRequest request, MultipartFile file);

    PageResponse<PostResponse> getAllPostsByStatusPublished(Pageable pageable);

    void deletePost(Long id);
}
