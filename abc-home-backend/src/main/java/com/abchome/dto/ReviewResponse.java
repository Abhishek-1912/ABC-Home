package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String reviewerName;
    private int rating;
    private String title;
    private String comment;
    private LocalDateTime createdAt;
}