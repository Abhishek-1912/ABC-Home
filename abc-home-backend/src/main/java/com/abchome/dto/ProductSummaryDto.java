package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductSummaryDto {
    private Long id;
    private String name;
    private String slug;
    private BigDecimal mrp;
    private BigDecimal sellingPrice;
    private String primaryImageUrl;
    private boolean featured;
    private boolean newArrival;
    private double averageRating;
    private long reviewCount;
}