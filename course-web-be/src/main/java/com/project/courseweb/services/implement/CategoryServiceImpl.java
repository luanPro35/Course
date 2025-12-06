package com.project.courseweb.services.implement;

import java.util.Optional;

import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import org.springframework.stereotype.Component;

import com.project.courseweb.entities.Category;
import com.project.courseweb.enums.CategoryType;
import com.project.courseweb.repositories.CategoryRepository;
import com.project.courseweb.services.CategoryService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Component
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    @Override
    public void createCategory(CategoryType categoryName) {
        Optional<Category> existingCategory = this.categoryRepository.findBySlug(categoryName);
        if (existingCategory.isPresent()) {
            Category category = existingCategory.get();
            category.setSlug(categoryName);
            this.categoryRepository.save(category);
            return;
        }
        var category = Category.builder()
                .slug(categoryName)
                .build();
        this.categoryRepository.save(category);
    }
    @Override
        public Category getCategoryByName(CategoryType categoryName) {
        return this.categoryRepository.findBySlug(categoryName)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }
}
