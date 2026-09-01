package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal total;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private List<Item> items;

    @Getter
    @AllArgsConstructor
    public static class Item {
        private String productName;
        private String variantLabel;
        private BigDecimal unitPrice;
        private int quantity;
        private BigDecimal lineTotal;
    }
}