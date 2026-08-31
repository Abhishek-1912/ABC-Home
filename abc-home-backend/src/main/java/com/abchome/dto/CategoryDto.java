package com.abchome.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private String slug;
    private List<CategoryDto> children;
}