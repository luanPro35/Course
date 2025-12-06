package com.project.courseweb.services;

import com.project.courseweb.entities.Category;
import com.project.courseweb.enums.CategoryType;
import org.springframework.stereotype.Service;

@Service
public interface CategoryService {
    void createCategory(CategoryType categoryType);

    Category getCategoryByName(CategoryType categoryType);
}
