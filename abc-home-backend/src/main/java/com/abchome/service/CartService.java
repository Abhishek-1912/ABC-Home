package com.abchome.service;

import com.abchome.dto.CartItemRequest;
import com.abchome.dto.CartResponse;
import com.abchome.entity.*;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public CartResponse addItem(String userEmail, CartItemRequest req) {
        Cart cart = getOrCreateCart(userEmail);

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + req.getProductId()));

        ProductVariant variant = null;
        int availableStock = product.getStockQuantity();
        if (req.getVariantId() != null) {
            variant = productVariantRepository.findById(req.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found: " + req.getVariantId()));
            availableStock = variant.getStock();
        }

        var existing = cartItemRepository.findByCartIdAndProductIdAndVariantId(
                cart.getId(), req.getProductId(), req.getVariantId()
        );

        int desiredQuantity = req.getQuantity() + existing.map(CartItem::getQuantity).orElse(0);
        if (desiredQuantity > availableStock) {
            throw new IllegalArgumentException("Only " + availableStock + " in stock");
        }

        if (existing.isPresent()) {
            existing.get().setQuantity(desiredQuantity);
            cartItemRepository.save(existing.get());
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setVariant(variant);
            item.setQuantity(req.getQuantity());
            cart.getItems().add(item);
            
            // Explicitly save and flush so the database generates the ID immediately
            cartItemRepository.saveAndFlush(item);
        }

        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateQuantity(String userEmail, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = findOwnedItem(cart, cartItemId);

        int availableStock = item.getVariant() != null ? item.getVariant().getStock() : item.getProduct().getStockQuantity();
        if (quantity > availableStock) {
            throw new IllegalArgumentException("Only " + availableStock + " in stock");
        }
        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
        }

        return toResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCart(userEmail);
        CartItem item = findOwnedItem(cart, cartItemId);
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse clear(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        return toResponse(cart);
    }

    public CartResponse getCart(String userEmail) {
        return toResponse(getOrCreateCart(userEmail));
    }

    private CartItem findOwnedItem(Cart cart, Long cartItemId) {
        return cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
    }

    private Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    private CartResponse toResponse(Cart cart) {
        List<CartResponse.Item> items = cart.getItems().stream()
                .sorted(Comparator.comparing(CartItem::getId))
                .map(this::toItemDto)
                .toList();

        BigDecimal subtotal = items.stream()
                .map(CartResponse.Item::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream().mapToInt(CartResponse.Item::getQuantity).sum();

        return new CartResponse(items, subtotal, totalItems);
    }

    private CartResponse.Item toItemDto(CartItem item) {
        Product product = item.getProduct();
        ProductVariant variant = item.getVariant();

        BigDecimal unitPrice = product.getSellingPrice();
        String variantLabel = null;
        if (variant != null) {
            unitPrice = unitPrice.add(variant.getAdditionalPrice());
            variantLabel = variant.getVariantName() + ": " + variant.getVariantValue();
        }

        String imageUrl = product.getImages().stream()
                .min(Comparator.comparingInt(pi -> pi.getDisplayOrder()))
                .map(pi -> pi.getImageUrl())
                .orElse(null);

        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return new CartResponse.Item(
                item.getId(), product.getId(), product.getName(), product.getSlug(), imageUrl,
                variant != null ? variant.getId() : null, variantLabel,
                unitPrice, item.getQuantity(), lineTotal
        );
    }
}