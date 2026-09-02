package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class WishlistItemDto {
    private Long productId;
    private String name;
    private String slug;
    private String imageUrl;
    private BigDecimal sellingPrice;
    private BigDecimal mrp;
}