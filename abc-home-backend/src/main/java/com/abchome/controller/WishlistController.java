package com.abchome.controller;

import com.abchome.dto.WishlistItemDto;
import com.abchome.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<WishlistItemDto> list(Authentication authentication) {
        return wishlistService.list(authentication.getName());
    }

    @PostMapping
    public void add(Authentication authentication, @RequestBody Map<String, Long> body) {
        wishlistService.add(authentication.getName(), body.get("productId"));
    }

    @DeleteMapping("/{productId}")
    public void remove(Authentication authentication, @PathVariable Long productId) {
        wishlistService.remove(authentication.getName(), productId);
    }
}