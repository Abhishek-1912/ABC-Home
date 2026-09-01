package com.abchome.service;

import com.abchome.dto.OrderResponse;
import com.abchome.dto.PlaceOrderRequest;
import com.abchome.entity.*;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional
    public OrderResponse placeOrder(String userEmail, PlaceOrderRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Address address = addressRepository.findByIdAndUserId(req.getAddressId(), user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        // Step 1: validate stock for EVERY item before touching anything
        for (CartItem item : cart.getItems()) {
            int available = item.getVariant() != null ? item.getVariant().getStock() : item.getProduct().getStockQuantity();
            if (item.getQuantity() > available) {
                throw new IllegalArgumentException(
                        "Not enough stock for " + item.getProduct().getName() + " (only " + available + " left)"
                );
            }
        }

        // Step 2: build the order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setAddress(address);
        order.setPaymentMethod(req.getPaymentMethod());
        order.setPaymentStatus("PENDING");
        order.setStatus("PLACED");

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            ProductVariant variant = cartItem.getVariant();

            BigDecimal unitPrice = product.getSellingPrice();
            String variantLabel = null;
            if (variant != null) {
                unitPrice = unitPrice.add(variant.getAdditionalPrice());
                variantLabel = variant.getVariantName() + ": " + variant.getVariantValue();
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setVariant(variant);
            orderItem.setProductName(product.getName()); // snapshot
            orderItem.setVariantLabel(variantLabel);       // snapshot
            orderItem.setUnitPrice(unitPrice);              // snapshot
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setLineTotal(lineTotal);
            order.getItems().add(orderItem);

            // Step 3: decrement stock
            if (variant != null) {
                variant.setStock(variant.getStock() - cartItem.getQuantity());
            } else {
                product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            }
        }

        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(999)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(49);

        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotal(subtotal.add(shippingFee));

        orderRepository.save(order);

        // Step 4: clear the cart
        cart.getItems().clear();

        return toDto(order);
    }

    public List<OrderResponse> myOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    public OrderResponse getOrder(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toDto(order);
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().toString().replace("-", "");
        int randomPart = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ABC-" + datePart + "-" + randomPart;
    }

    private OrderResponse toDto(Order order) {
        List<OrderResponse.Item> items = order.getItems().stream()
                .map(i -> new OrderResponse.Item(i.getProductName(), i.getVariantLabel(), i.getUnitPrice(), i.getQuantity(), i.getLineTotal()))
                .toList();

        return new OrderResponse(
                order.getId(), order.getOrderNumber(), order.getSubtotal(), order.getShippingFee(),
                order.getTotal(), order.getStatus(), order.getPaymentStatus(), order.getPaymentMethod(),
                order.getCreatedAt(), items
        );
    }
}