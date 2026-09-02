package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class ProductDetailDto {
    private Long id;
    private String sku;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private String categoryName;
    private String categorySlug;
    private String brand;
    private BigDecimal mrp;
    private BigDecimal sellingPrice;
    private int stockQuantity;
    private double averageRating;
    private long reviewCount;
    
    private List<ImageDto> images;
    private List<VariantDto> variants;

    @Getter
    @AllArgsConstructor
    public static class ImageDto {
        private String imageUrl;
        private String altText;
    }

    @Getter
    @AllArgsConstructor
    public static class VariantDto {
        private Long id;
        private String variantName;
        private String variantValue;
        private BigDecimal additionalPrice;
        private int stock;
    }
}