package com.abchome.controller;

import com.abchome.dto.ProductAdminSummaryDto;
import com.abchome.dto.ProductCreateRequest;
import com.abchome.dto.ProductDetailDto;
import com.abchome.service.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public List<ProductAdminSummaryDto> listAll() {
        return adminProductService.listAll();
    }

    @PostMapping
    public ResponseEntity<ProductDetailDto> create(@Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(adminProductService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailDto> update(@PathVariable Long id, @Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(adminProductService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminProductService.delete(id);
        return ResponseEntity.noContent().build();
    }
}