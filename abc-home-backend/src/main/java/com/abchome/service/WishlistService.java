package com.abchome.service;

import com.abchome.dto.WishlistItemDto;
import com.abchome.entity.Product;
import com.abchome.entity.User;
import com.abchome.entity.WishlistItem;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.ProductRepository;
import com.abchome.repository.UserRepository;
import com.abchome.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<WishlistItemDto> list(String userEmail) {
        User user = getUser(userEmail);
        return wishlistItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void add(String userEmail, Long productId) {
        User user = getUser(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (wishlistItemRepository.findByUserIdAndProductId(user.getId(), productId).isPresent()) {
            return; // already wishlisted — treat as success, no-op
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);

        try {
            wishlistItemRepository.save(item);
        } catch (DataIntegrityViolationException e) {
            // race condition: two rapid clicks both passed the check above — safe to ignore
        }
    }

    @Transactional
    public void remove(String userEmail, Long productId) {
        User user = getUser(userEmail);
        wishlistItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private WishlistItemDto toDto(WishlistItem item) {
        Product p = item.getProduct();
        String image = p.getImages().stream()
                .min(Comparator.comparingInt(pi -> pi.getDisplayOrder()))
                .map(pi -> pi.getImageUrl())
                .orElse(null);

        return new WishlistItemDto(p.getId(), p.getName(), p.getSlug(), image, p.getSellingPrice(), p.getMrp());
    }
}