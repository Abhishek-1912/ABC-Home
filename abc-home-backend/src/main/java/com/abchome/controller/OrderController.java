package com.abchome.controller;

import com.abchome.dto.OrderResponse;
import com.abchome.dto.PlaceOrderRequest;
import com.abchome.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse placeOrder(Authentication authentication, @Valid @RequestBody PlaceOrderRequest request) {
        return orderService.placeOrder(authentication.getName(), request);
    }

    @GetMapping
    public List<OrderResponse> myOrders(Authentication authentication) {
        return orderService.myOrders(authentication.getName());
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(Authentication authentication, @PathVariable Long id) {
        return orderService.getOrder(authentication.getName(), id);
    }

        @PostMapping("/{id}/cancel")
    public OrderResponse cancelOrder(Authentication authentication, @PathVariable Long id) {
        return orderService.cancelOrder(authentication.getName(), id);
    }

    @PostMapping("/{id}/return")
    public OrderResponse requestReturn(Authentication authentication, @PathVariable Long id) {
        return orderService.requestReturn(authentication.getName(), id);
    }
}