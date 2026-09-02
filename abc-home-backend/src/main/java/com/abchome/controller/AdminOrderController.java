package com.abchome.controller;

import com.abchome.dto.AdminOrderSummaryDto;
import com.abchome.dto.OrderResponse;
import com.abchome.dto.OrderStatusUpdateRequest;
import com.abchome.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<AdminOrderSummaryDto> listAll() {
        return orderService.listAllForAdmin();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderDetails(@PathVariable Long id) {
        return orderService.getOrderByIdForAdmin(id);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return orderService.updateStatus(id, request.getStatus());
    }
}