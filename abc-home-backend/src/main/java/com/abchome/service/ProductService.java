package com.abchome.service;

import com.abchome.dto.ProductDetailDto;
import com.abchome.dto.ProductSummaryDto;
import com.abchome.entity.Product;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.mapper.ProductMapper;
import com.abchome.repository.ProductRepository;
import com.abchome.repository.spec.ProductSpecifications;
import lombok.RequiredArgsConstructor;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.abchome.dto.BulkUploadResult;

import com.abchome.entity.Category;
import com.abchome.repository.CategoryRepository;
import org.apache.poi.ss.usermodel.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;

    public Page<ProductSummaryDto> browse(
            String search, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice,
            String brand, Pageable pageable
    ) {
        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasStatus("ACTIVE"))
                .and(ProductSpecifications.search(search))
                .and(ProductSpecifications.inCategorySlug(categorySlug))
                .and(ProductSpecifications.priceBetween(minPrice, maxPrice))
                .and(ProductSpecifications.hasBrand(brand));

        return productRepository.findAll(spec, pageable).map(productMapper::toSummary);
    }

    public ProductDetailDto getBySlug(String slug) {
        Product product = productRepository.findBySlugAndStatus(slug, "ACTIVE")
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slug));
        return productMapper.toDetail(product);
    }


    public BulkUploadResult processBulkExcelUpload(MultipartFile file) {
    List<String> errors = new ArrayList<>();
    int successCount = 0;

    try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
        Sheet sheet = workbook.getSheetAt(0);

        for (int i = 1; i <= sheet.getLastRowNum(); i++) { // Skip header row
            Row row = sheet.getRow(i);
            if (row == null) continue;

            try {
                Product product = new Product();
                product.setSku(row.getCell(0).getStringCellValue());
                product.setName(row.getCell(1).getStringCellValue());
                product.setBrand(row.getCell(2).getStringCellValue());
long catId = (long) row.getCell(3).getNumericCellValue();
                    Category category = categoryRepository.findById(catId)
                            .orElseThrow(() -> new RuntimeException("Category ID " + catId + " not found"));
                    product.setCategory(category);                product.setMrp(BigDecimal.valueOf(row.getCell(4).getNumericCellValue()));
                product.setSellingPrice(BigDecimal.valueOf(row.getCell(5).getNumericCellValue()));
                product.setStockQuantity((int) row.getCell(6).getNumericCellValue());
                product.setStatus("ACTIVE");

                productRepository.save(product);
                successCount++;
            } catch (Exception e) {
                errors.add("Row " + (i + 1) + ": " + e.getMessage());
            }
        }
    } catch (IOException e) {
        throw new RuntimeException("Failed to parse Excel file", e);
    }

    return new BulkUploadResult(successCount, errors);
}
}