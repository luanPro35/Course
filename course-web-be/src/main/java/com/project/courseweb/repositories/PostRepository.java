package com.project.courseweb.repositories;

import com.project.courseweb.entities.Post;
import com.project.courseweb.enums.PostStatus;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> getPostsByStatusAndProfileId(PostStatus status, Long profileId, Pageable pageable);

    Optional<Post> getPostByIdAndProfileId(Long id, Long profileId);

    Page<Post> getPostsByStatus(PostStatus status, Pageable pageable);
}
