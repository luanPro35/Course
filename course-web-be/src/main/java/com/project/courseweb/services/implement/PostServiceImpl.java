package com.project.courseweb.services.implement;


import com.project.courseweb.dtos.PageResponse;
import com.project.courseweb.dtos.request.PostRequest;
import com.project.courseweb.dtos.response.FileResponse;
import com.project.courseweb.dtos.response.PostResponse;
import com.project.courseweb.entities.Post;
import com.project.courseweb.enums.CategoryType;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.enums.PostStatus;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.mappers.PostMapper;
import com.project.courseweb.repositories.PostRepository;
import com.project.courseweb.services.CategoryService;
import com.project.courseweb.services.FileUploadAWSService;
import com.project.courseweb.services.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class PostServiceImpl implements PostService {

    PostRepository postRepository;
    FileUploadAWSService fileUploadAWSService;
    PostMapper postMapper;
    ProfileServiceImpl profileServiceImpl;
    CategoryService categoryService;

    @Override
    public FileResponse uploadPostThumbnail(MultipartFile file) {
        return FileResponse.builder()
                .url(this.fileUploadAWSService.uploadFile(
                                this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId()),
                                "post-thumbnail",
                                file
                        )
                )
                .build();
    }

    @Override
    @Transactional
    @PreAuthorize("hasAuthority('CREATE_POST')")
    @CacheEvict(value = "posts", allEntries = true)
    public PostResponse createPost(PostRequest request) {
        Post post = this.postMapper.toPostEntity(request);
        post.setProfile(this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId()));
        post.setStatus(PostStatus.valueOf(request.getStatusPost()));
        post.setCategory(this.categoryService.getCategoryByName(CategoryType.valueOf(request.getCategory())));
        var entity = this.postRepository.save(post);
        return this.toResponse(entity);
    }

    @Override
    public PageResponse<PostResponse> getPostsByStatus(Pageable pageable, String status) {
        var profile = this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId());
        Page<Post> posts = this.postRepository.getPostsByStatusAndProfileId(PostStatus.valueOf(status), profile.getId(), pageable);
        return this.toPageResponse(posts);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN') or @postServiceImpl.isPostOwner(#id)")
    @Cacheable(value = "post", key = "#id")
    public PostResponse getPostById(Long id) {
        return this.toResponse(this.postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND))
        );
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or (hasAuthority('EDIT_POST') and @postServiceImpl.isPostOwner(#id))")
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "post", key = "#id")
    })
    public PostResponse updatePost(Long id, PostRequest request) {
        // var profile = this.profileServiceImpl.getProfileById(this.profileServiceImpl.getId());
        // var postOptional = this.postRepository.getPostByIdAndProfileId(id, profile.getId());
        // if(!postOptional.isPresent()){
        //     throw new AppException(ErrorCode.POST_NOT_FOUND);
        // }   
        // var post = postOptional.get();
        var post = this.postRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND)
        );
        post.setUpdatedAt(LocalDateTime.now());
        post.setCategory(this.categoryService.getCategoryByName(CategoryType.valueOf(request.getCategory())));
        post.setStatus(PostStatus.valueOf(request.getStatusPost()));
        this.postMapper.updatePostFromRequest(request, post);
        return this.toResponse(this.postRepository.save(post));
    }

    @Override
    @Cacheable(value = "posts", key = "'published_page_' + #pageable.pageNumber + '_size_' + #pageable.pageSize")
    public PageResponse<PostResponse> getAllPostsByStatusPublished(Pageable pageable) {
        Page<Post> posts = this.postRepository.getPostsByStatus(PostStatus.PUBLISHED, pageable);
        return this.toPageResponse(posts);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or (hasAuthority('DELETE_POST') and @postServiceImpl.isPostOwner(#id))")
    @Caching(evict = {
            @CacheEvict(value = "posts", allEntries = true),
            @CacheEvict(value = "post", key = "#id")
    })
    public void deletePost(Long id) {
        Post post = this.postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        if (post.getThumbnailUrl() != null && !post.getThumbnailUrl().isEmpty()) {
            fileUploadAWSService.deleteFile(post.getThumbnailUrl());
        }

        this.postRepository.delete(post);
    }

    private PostResponse toResponse(Post post) {
        var res = this.postMapper.toPostResponse(post);
        res.setCategory(post.getCategory().getSlug().name());
        res.setStatusPost(post.getStatus().name());
        return res;
    }

    private PageResponse<PostResponse> toPageResponse(Page<Post> page) {
        var content = page.stream().map(this::toResponse).toList();
        return PageResponse.<PostResponse>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public boolean isPostOwner(Long id) {
        return postRepository.existsByIdAndProfileId(id, this.profileServiceImpl.getId());
    }
}
