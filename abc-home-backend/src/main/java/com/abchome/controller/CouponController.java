package com.abchome.controller;

import com.abchome.dto.CouponValidationResponse;
import com.abchome.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/validate")
    public CouponValidationResponse validate(
            @RequestParam String code,
            @RequestParam BigDecimal subtotal
    ) {
        return couponService.validate(code, subtotal);
    }
}