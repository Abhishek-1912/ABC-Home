package com.abchome.service;

import com.abchome.dto.ProductDetailDto;
import com.abchome.dto.ProductSummaryDto;
import com.abchome.entity.Product;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.mapper.ProductMapper;
import com.abchome.repository.ProductRepository;
import com.abchome.repository.spec.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public Page<ProductSummaryDto> browse(
            String search, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice,
            String brand, Pageable pageable
    ) {
        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasStatus("ACTIVE"))
                .and(ProductSpecifications.search(search))
                .and(ProductSpecifications.inCategorySlug(categorySlug))
                .and(ProductSpecifications.priceBetween(minPrice, maxPrice))
                .and(ProductSpecifications.hasBrand(brand));

        return productRepository.findAll(spec, pageable).map(productMapper::toSummary);
    }

    public ProductDetailDto getBySlug(String slug) {
        Product product = productRepository.findBySlugAndStatus(slug, "ACTIVE")
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slug));
        return productMapper.toDetail(product);
    }
}