package com.abchome.controller;

import com.abchome.dto.AddressRequest;
import com.abchome.dto.AddressResponse;
import com.abchome.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressResponse> list(Authentication authentication) {
        return addressService.list(authentication.getName());
    }

    @PostMapping
    public AddressResponse create(Authentication authentication, @Valid @RequestBody AddressRequest request) {
        return addressService.create(authentication.getName(), request);
    }


    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            Authentication authentication, 
            @PathVariable Long id, 
            @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.update(authentication.getName(), id, request));
    }
    

    @DeleteMapping("/{id}")
    public void delete(Authentication authentication, @PathVariable Long id) {
        addressService.delete(authentication.getName(), id);
    }
}