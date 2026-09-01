package com.abchome.controller;

import com.abchome.dto.CartItemRequest;
import com.abchome.dto.CartResponse;
import com.abchome.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/items")
    public CartResponse addItem(Authentication authentication, @Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(authentication.getName(), request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateQuantity(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestParam int quantity
    ) {
        return cartService.updateQuantity(authentication.getName(), itemId, quantity);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(Authentication authentication, @PathVariable Long itemId) {
        return cartService.removeItem(authentication.getName(), itemId);
    }

    @DeleteMapping
    public CartResponse clear(Authentication authentication) {
        return cartService.clear(authentication.getName());
    }
}