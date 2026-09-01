package com.abchome.repository;

import com.abchome.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
List<Address> findByUserIdOrderByDefaultAddressDesc(Long userId);
    Optional<Address> findByIdAndUserId(Long id, Long userId); // ownership check
}