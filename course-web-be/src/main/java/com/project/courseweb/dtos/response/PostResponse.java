package com.project.courseweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostResponse {
//    static final long serialVersionUID = 1L;
    Long id;
    String author;
    String title;
    String category;
    String thumbnailUrl;
    String content;
    String fullContent;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;
    String statusPost;
}
