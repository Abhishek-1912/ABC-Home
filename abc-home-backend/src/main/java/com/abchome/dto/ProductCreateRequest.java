package com.abchome.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductCreateRequest {

    @NotBlank
    private String sku;

    @NotBlank
    private String name;

    @NotBlank
    private String slug;

    private String shortDescription;
    private String description;

    @NotNull
    private Long categoryId;

    private String brand;

    @NotNull @DecimalMin("0.0")
    private BigDecimal mrp;

    @NotNull @DecimalMin("0.0")
    private BigDecimal sellingPrice;

    private BigDecimal costPrice;

    @Min(0)
    private int stockQuantity;

    private BigDecimal weight;
    private BigDecimal length;
    private BigDecimal width;
    private BigDecimal height;

    private boolean featured;
    private boolean newArrival;

    // image URLs already uploaded via /api/admin/uploads/image
    private List<String> imageUrls;

    private List<VariantInput> variants;

    @Getter
    @Setter
    public static class VariantInput {
        @NotBlank private String variantName;
        @NotBlank private String variantValue;
        private BigDecimal additionalPrice = BigDecimal.ZERO;
        private int stock;
        private String sku;
    }
}