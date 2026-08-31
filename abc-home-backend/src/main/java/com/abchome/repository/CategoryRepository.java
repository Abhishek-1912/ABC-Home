package com.abchome.repository;

import com.abchome.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    List<Category> findByParentIsNullOrderByDisplayOrder(); // top-level categories
    List<Category> findByParentIdOrderByDisplayOrder(Long parentId); // subcategories
}