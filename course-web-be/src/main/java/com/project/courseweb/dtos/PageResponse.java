package com.project.courseweb.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@Builder
public class PageResponse<T> {
    List<T> content;// data
    int pageNo;// current page number
    int pageSize;// number of items per page
    long totalElements;// total number of items
    int totalPages;// total number of pages
    boolean last;// is this the last page
}
