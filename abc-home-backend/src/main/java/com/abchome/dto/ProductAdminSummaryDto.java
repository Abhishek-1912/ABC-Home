package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductAdminSummaryDto {
    private Long id;
    private String sku;
    private String name;
    private String categoryName;
    private BigDecimal sellingPrice;
    private int stockQuantity;
    private String status;
}