package com.abchome.service;

import com.abchome.dto.AddressRequest;
import com.abchome.dto.AddressResponse;
import com.abchome.entity.Address;
import com.abchome.entity.User;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.AddressRepository;
import com.abchome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> list(String userEmail) {
        User user = getUser(userEmail);
        // Only fetch addresses where is_active is true
        return addressRepository.findByUserIdAndIsActiveTrueOrderByDefaultAddressDesc(user.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AddressResponse create(String userEmail, AddressRequest req) {
        User user = getUser(userEmail);

        Address address = new Address();
        address.setUser(user);
        applyRequest(address, req);
        address.setActive(true); // Ensure new addresses are active

        addressRepository.save(address);
        return toDto(address);
    }

    @Transactional
    public void delete(String userEmail, Long addressId) {
        User user = getUser(userEmail);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        
        // Soft delete instead of hard delete
        address.setActive(false);
        addressRepository.save(address);
    }

    @Transactional
    public AddressResponse update(String userEmail, Long addressId, AddressRequest req) {
        User user = getUser(userEmail);
        
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        applyRequest(address, req);
        addressRepository.save(address);
        
        return toDto(address);
    }

    private void applyRequest(Address address, AddressRequest req) {
        address.setFullName(req.getFullName());
        address.setPhone(req.getPhone());
        address.setLine1(req.getLine1());
        address.setLine2(req.getLine2());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setPostalCode(req.getPostalCode());
        address.setCountry(req.getCountry());
        address.setDefaultAddress(req.isDefaultAddress());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AddressResponse toDto(Address a) {
        return new AddressResponse(
                a.getId(), a.getFullName(), a.getPhone(), a.getLine1(), a.getLine2(),
                a.getCity(), a.getState(), a.getPostalCode(), a.getCountry(), a.isDefaultAddress()
        );
    }
}