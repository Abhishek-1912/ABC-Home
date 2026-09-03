package com.abchome.service;

import com.abchome.dto.CouponRequest;
import com.abchome.dto.CouponResponse;
import com.abchome.dto.CouponValidationResponse;
import com.abchome.entity.Coupon;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;

    public List<CouponResponse> listAll() {
        return couponRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public CouponResponse create(CouponRequest req) {
        if (couponRepository.findByCodeIgnoreCase(req.getCode()).isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists: " + req.getCode());
        }

        Coupon coupon = new Coupon();
        coupon.setCode(req.getCode().toUpperCase());
        coupon.setDiscountType(req.getDiscountType());
        coupon.setDiscountValue(req.getDiscountValue());
        coupon.setMinOrderValue(req.getMinOrderValue());
        coupon.setMaxDiscountAmount(req.getMaxDiscountAmount());
        coupon.setUsageLimit(req.getUsageLimit());
        coupon.setActive(req.isActive());
        coupon.setExpiresAt(req.getExpiresAt());

        couponRepository.save(coupon);
        return toDto(coupon);
    }

    @Transactional
    public void delete(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    /**
     * Validates a coupon against a cart subtotal WITHOUT consuming it.
     * Used at checkout time to preview the discount before the order is placed.
     */
    public CouponValidationResponse validate(String code, BigDecimal subtotal) {
        Coupon coupon = getValidatedCoupon(code, subtotal);
        BigDecimal discount = calculateDiscount(coupon, subtotal);
        return new CouponValidationResponse(coupon.getCode(), discount, subtotal.subtract(discount));
    }

    /**
     * Called by OrderService at actual order placement time — re-validates
     * (never trust a discount amount the frontend sends back) and increments used_count.
     */
    @Transactional
    public CouponApplication applyForOrder(String code, BigDecimal subtotal) {
        Coupon coupon = getValidatedCoupon(code, subtotal);
        BigDecimal discount = calculateDiscount(coupon, subtotal);

        coupon.setUsedCount(coupon.getUsedCount() + 1);

        return new CouponApplication(coupon.getId(), discount);
    }

    private Coupon getValidatedCoupon(String code, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code"));

        if (!coupon.isActive()) {
            throw new IllegalArgumentException("This coupon is no longer active");
        }
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("This coupon has expired");
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new IllegalArgumentException("This coupon has reached its usage limit");
        }
        if (subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new IllegalArgumentException(
                    "This coupon requires a minimum order of ₹" + coupon.getMinOrderValue()
            );
        }

        return coupon;
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;

        if (coupon.getDiscountType().equals("PERCENTAGE")) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else { // FIXED
            discount = coupon.getDiscountValue();
        }

        // Never let a discount exceed the subtotal itself
        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }

        return discount;
    }

    private CouponResponse toDto(Coupon c) {
        return new CouponResponse(
                c.getId(), c.getCode(), c.getDiscountType(), c.getDiscountValue(), c.getMinOrderValue(),
                c.getMaxDiscountAmount(), c.getUsageLimit(), c.getUsedCount(), c.isActive(), c.getExpiresAt()
        );
    }

    public record CouponApplication(Long couponId, BigDecimal discountAmount) {}
}