package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class CartResponse {
    private List<Item> items;
    private BigDecimal subtotal;
    private int totalItems;

    @Getter
    @AllArgsConstructor
    public static class Item {
        private Long cartItemId;
        private Long productId;
        private String productName;
        private String productSlug;
        private String imageUrl;
        private Long variantId;
        private String variantLabel; // e.g. "Color: Black" or null
        private BigDecimal unitPrice; // sellingPrice + variant.additionalPrice
        private int quantity;
        private BigDecimal lineTotal;
    }
}