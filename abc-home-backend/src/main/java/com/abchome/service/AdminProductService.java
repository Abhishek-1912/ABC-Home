package com.abchome.service;

import com.abchome.dto.ProductAdminSummaryDto;
import com.abchome.dto.ProductCreateRequest;
import com.abchome.dto.ProductDetailDto;
import com.abchome.entity.Category;
import com.abchome.entity.Product;
import com.abchome.entity.ProductImage;
import com.abchome.entity.ProductVariant;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.mapper.ProductMapper;
import com.abchome.repository.CategoryRepository;
import com.abchome.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public List<ProductAdminSummaryDto> listAll() {
        return productRepository.findAll().stream()
                .map(p -> new ProductAdminSummaryDto(
                        p.getId(), p.getSku(), p.getName(), p.getCategory().getName(),
                        p.getSellingPrice(), p.getStockQuantity(), p.getStatus()
                ))
                .toList();
    }

    @Transactional
    public ProductDetailDto create(ProductCreateRequest req) {
        if (productRepository.existsBySku(req.getSku())) {
            throw new IllegalArgumentException("SKU already exists: " + req.getSku());
        }
        if (productRepository.existsBySlug(req.getSlug())) {
            throw new IllegalArgumentException("Slug already exists: " + req.getSlug());
        }

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));

        Product product = new Product();
        applyRequestToProduct(product, req, category);

        if (req.getImageUrls() != null) {
            int order = 0;
            for (String url : req.getImageUrls()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(url);
                img.setDisplayOrder(order++);
                product.getImages().add(img);
            }
        }

        if (req.getVariants() != null) {
            for (ProductCreateRequest.VariantInput v : req.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                variant.setVariantName(v.getVariantName());
                variant.setVariantValue(v.getVariantValue());
                variant.setAdditionalPrice(v.getAdditionalPrice());
                variant.setStock(v.getStock());
                variant.setSku(v.getSku());
                product.getVariants().add(variant);
            }
        }

        productRepository.save(product);
        return productMapper.toDetail(product);
    }

    @Transactional
    public ProductDetailDto update(Long id, ProductCreateRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + req.getCategoryId()));

        applyRequestToProduct(product, req, category);

        // Replace images and variants entirely on update (simple, predictable approach)
        product.getImages().clear();
        if (req.getImageUrls() != null) {
            int order = 0;
            for (String url : req.getImageUrls()) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(url);
                img.setDisplayOrder(order++);
                product.getImages().add(img);
            }
        }

        product.getVariants().clear();
        if (req.getVariants() != null) {
            for (ProductCreateRequest.VariantInput v : req.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                variant.setVariantName(v.getVariantName());
                variant.setVariantValue(v.getVariantValue());
                variant.setAdditionalPrice(v.getAdditionalPrice());
                variant.setStock(v.getStock());
                variant.setSku(v.getSku());
                product.getVariants().add(variant);
            }
        }

        return productMapper.toDetail(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        product.setStatus("INACTIVE"); // soft delete — keeps order history intact
        // If you truly want hard delete instead: productRepository.delete(product);
    }

    private void applyRequestToProduct(Product product, ProductCreateRequest req, Category category) {
        product.setSku(req.getSku());
        product.setName(req.getName());
        product.setSlug(req.getSlug());
        product.setShortDescription(req.getShortDescription());
        product.setDescription(req.getDescription());
        product.setCategory(category);
        product.setBrand(req.getBrand());
        product.setMrp(req.getMrp());
        product.setSellingPrice(req.getSellingPrice());
        product.setCostPrice(req.getCostPrice());
        product.setStockQuantity(req.getStockQuantity());
        product.setWeight(req.getWeight());
        product.setLength(req.getLength());
        product.setWidth(req.getWidth());
        product.setHeight(req.getHeight());
        product.setFeatured(req.isFeatured());
        product.setNewArrival(req.isNewArrival());
    }
}