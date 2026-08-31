package com.abchome.service;

import com.abchome.dto.CategoryDto;
import com.abchome.entity.Category;
import com.abchome.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getTree() {
        return categoryRepository.findByParentIsNullOrderByDisplayOrder().stream()
                .map(this::toDto)
                .toList();
    }

    private CategoryDto toDto(Category category) {
        List<CategoryDto> children = categoryRepository.findByParentIdOrderByDisplayOrder(category.getId()).stream()
                .map(this::toDto)
                .toList();
        return new CategoryDto(category.getId(), category.getName(), category.getSlug(), children);
    }
}