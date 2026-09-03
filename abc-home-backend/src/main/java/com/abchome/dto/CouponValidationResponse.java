package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class CouponValidationResponse {
    private String code;
    private BigDecimal discountAmount; // the actual rupee amount to subtract
    private BigDecimal newTotal;
}