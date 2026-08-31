package com.abchome.repository.spec;

import com.abchome.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductSpecifications {

    public static Specification<Product> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Product> search(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction();
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("shortDescription")), pattern),
                    cb.like(cb.lower(root.get("brand")), pattern)
            );
        };
    }

    public static Specification<Product> inCategorySlug(String categorySlug) {
        return (root, query, cb) -> {
            if (categorySlug == null || categorySlug.isBlank()) return cb.conjunction();
            return cb.equal(root.get("category").get("slug"), categorySlug);
        };
    }

    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min != null && max != null) return cb.between(root.get("sellingPrice"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("sellingPrice"), min);
            return cb.lessThanOrEqualTo(root.get("sellingPrice"), max);
        };
    }

    public static Specification<Product> hasBrand(String brand) {
        return (root, query, cb) -> {
            if (brand == null || brand.isBlank()) return cb.conjunction();
            return cb.equal(root.get("brand"), brand);
        };
    }
}