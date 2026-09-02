package com.abchome.service;

import com.abchome.dto.CategoryDto;
import com.abchome.dto.CategoryRequest;
import com.abchome.entity.Category;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.CategoryRepository;
import com.abchome.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository; // Injected to compute product counts

    public List<CategoryDto> getTree() {
        return categoryRepository.findByParentIsNullOrderByDisplayOrder().stream()
                .map(this::toDto)
                .toList();
    }

    // Flat list (not nested tree) — easier for an admin dropdown/table
    public List<CategoryDto> listFlat() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDto(
                        c.getId(),
                        c.getName(),
                        c.getSlug(),
                        c.getParent() != null ? c.getParent().getId() : null,
                        List.of(),
                        productRepository.countByCategoryId(c.getId())
                ))
                .toList();
    }

    @Transactional
    public CategoryDto create(CategoryRequest req) {
        if (categoryRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new IllegalArgumentException("Slug already exists: " + req.getSlug());
        }

        Category category = new Category();
        category.setName(req.getName());
        category.setSlug(req.getSlug());
        category.setDisplayOrder(req.getDisplayOrder());

        if (req.getParentId() != null) {
            Category parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
        }

        categoryRepository.save(category);
        
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getParent() != null ? category.getParent().getId() : null,
                List.of(),
                productRepository.countByCategoryId(category.getId())
        );
    }

    @Transactional
    public CategoryDto update(Long id, CategoryRequest req) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        category.setName(req.getName());
        category.setSlug(req.getSlug());
        category.setDisplayOrder(req.getDisplayOrder());

        if (req.getParentId() != null) {
            Category parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        categoryRepository.save(category);

        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getParent() != null ? category.getParent().getId() : null,
                List.of(),
                productRepository.countByCategoryId(category.getId())
        );
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        categoryRepository.delete(category);
    }

    private CategoryDto toDto(Category category) {
        List<CategoryDto> children = categoryRepository.findByParentIdOrderByDisplayOrder(category.getId()).stream()
                .map(this::toDto)
                .toList();
        
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getParent() != null ? category.getParent().getId() : null,
                children,
                productRepository.countByCategoryId(category.getId())
        );
    }
}