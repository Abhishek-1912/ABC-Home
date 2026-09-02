package com.abchome.mapper;

import com.abchome.dto.ProductDetailDto;
import com.abchome.dto.ProductSummaryDto;
import com.abchome.entity.Product;
import com.abchome.entity.ProductImage;
import com.abchome.entity.ProductVariant;
import com.abchome.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ReviewRepository reviewRepository;

    public ProductSummaryDto toSummary(Product p) {
        String primaryImage = p.getImages().stream()
                .min(Comparator.comparingInt(ProductImage::getDisplayOrder))
                .map(ProductImage::getImageUrl)
                .orElse(null);

        double avgRating = averageRating(p.getId());
        long reviewCount = reviewRepository.countByProductId(p.getId());

        return new ProductSummaryDto(
                p.getId(), p.getName(), p.getSlug(), p.getMrp(), p.getSellingPrice(),
                primaryImage, p.isFeatured(), p.isNewArrival(), avgRating, reviewCount
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

        double avgRating = averageRating(p.getId());
        long reviewCount = reviewRepository.countByProductId(p.getId());

        return new ProductDetailDto(
                p.getId(), p.getSku(), p.getName(), p.getSlug(), p.getShortDescription(),
                p.getDescription(), p.getCategory().getName(), p.getCategory().getSlug(),
                p.getBrand(), p.getMrp(), p.getSellingPrice(), p.getStockQuantity(),
                avgRating, reviewCount, images, variants
        );
    }

    private double averageRating(Long productId) {
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        return avg != null ? Math.round(avg * 10) / 10.0 : 0.0; // round to 1 decimal, 0 if no reviews
    }
}