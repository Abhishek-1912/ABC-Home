package com.abchome.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderActionRequest {
    private String reason; // optional, for cancel/return
}