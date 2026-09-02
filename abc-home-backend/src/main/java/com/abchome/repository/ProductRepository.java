package com.abchome.repository;

import com.abchome.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlugAndStatus(String slug, String status);
    boolean existsBySku(String sku);
    boolean existsBySlug(String slug);
    
    // Add this method so CategoryService can count products per category
    long countByCategoryId(Long categoryId);
}