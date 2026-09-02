package com.abchome.controller;

import com.abchome.dto.ReviewRequest;
import com.abchome.dto.ReviewResponse;
import com.abchome.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/products/{productId}/reviews")
    public List<ReviewResponse> list(@PathVariable Long productId) {
        return reviewService.listForProduct(productId);
    }

    @PostMapping("/api/products/{productId}/reviews")
    public ReviewResponse create(
            Authentication authentication,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request
    ) {
        return reviewService.create(authentication.getName(), productId, request);
    }

    @DeleteMapping("/api/reviews/{reviewId}")
    public void delete(Authentication authentication, @PathVariable Long reviewId) {
        reviewService.delete(authentication.getName(), reviewId);
    }
}