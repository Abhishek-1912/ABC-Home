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
    private String primaryImageUrl; // first image, or null
    private boolean featured;
    private boolean newArrival;
}