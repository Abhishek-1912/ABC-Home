package com.abchome.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceOrderRequest {

    @NotNull
    private Long addressId;

    private String paymentMethod = "COD"; // COD for now; RAZORPAY/CASHFREE later

     private String couponCode;
}