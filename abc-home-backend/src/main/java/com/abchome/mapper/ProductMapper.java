package com.abchome.mapper;

import com.abchome.dto.ProductDetailDto;
import com.abchome.dto.ProductSummaryDto;
import com.abchome.entity.Product;
import com.abchome.entity.ProductImage;
import com.abchome.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class ProductMapper {

    public ProductSummaryDto toSummary(Product p) {
        String primaryImage = p.getImages().stream()
                .min(Comparator.comparingInt(ProductImage::getDisplayOrder))
                .map(ProductImage::getImageUrl)
                .orElse(null);

        return new ProductSummaryDto(
                p.getId(), p.getName(), p.getSlug(), p.getMrp(), p.getSellingPrice(),
                primaryImage, p.isFeatured(), p.isNewArrival()
        );
    }

    public ProductDetailDto toDetail(Product p) {
        List<ProductDetailDto.ImageDto> images = p.getImages().stream()
                .sorted(Comparator.comparingInt(ProductImage::getDisplayOrder))
                .map(i -> new ProductDetailDto.ImageDto(i.getImageUrl(), i.getAltText()))
                .toList();

        List<ProductDetailDto.VariantDto> variants = p.getVariants().stream()
                .map(v -> new ProductDetailDto.VariantDto(
                        v.getId(), v.getVariantName(), v.getVariantValue(), v.getAdditionalPrice(), v.getStock()
                ))
                .toList();

        return new ProductDetailDto(
                p.getId(), p.getSku(), p.getName(), p.getSlug(), p.getShortDescription(),
                p.getDescription(), p.getCategory().getName(), p.getCategory().getSlug(),
                p.getBrand(), p.getMrp(), p.getSellingPrice(), p.getStockQuantity(),
                images, variants
        );
    }
}