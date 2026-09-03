package com.abchome.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class CouponRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String discountType; // PERCENTAGE or FIXED

    @NotNull
    private BigDecimal discountValue;

    private BigDecimal minOrderValue = BigDecimal.ZERO;
    private BigDecimal maxDiscountAmount;
    private Integer usageLimit;
    private boolean active = true;
    private LocalDateTime expiresAt;
}