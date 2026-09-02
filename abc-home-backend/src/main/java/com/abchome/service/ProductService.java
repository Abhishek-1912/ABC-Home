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
import com.abchome.entity.ProductImage;
import com.abchome.repository.CategoryRepository;
import org.apache.poi.ss.usermodel.*;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

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

    // Self-injection using @Lazy solves the Spring self-invocation proxy issue
    @Autowired
    @Lazy
    private ProductService self;

    private final DataFormatter dataFormatter = new DataFormatter();

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

        String supabaseBaseUrl = "https://your-supabase-project-id.supabase.co/storage/v1/object/public/product-images/";

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                try {
                    // Call through 'self' so Spring's transactional proxy intercepts it
                    self.processSingleRow(row, supabaseBaseUrl);
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

    private String getCellVal(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        return (cell != null) ? dataFormatter.formatCellValue(cell).trim() : "";
    }

    // This method runs in its OWN independent transaction via the proxy.
    // If a row fails, only that row rolls back without breaking the batch.
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = false)
public void processSingleRow(Row row, String supabaseBaseUrl) {
    String sku = getCellVal(row, 0);
    String name = getCellVal(row, 1);
    String shortDesc = getCellVal(row, 2);
    String catIdStr = getCellVal(row, 3);
    String brand = getCellVal(row, 4);
    String mrpStr = getCellVal(row, 5);
    String priceStr = getCellVal(row, 6);
    String stockStr = getCellVal(row, 7);

    if (sku.isEmpty()) return;

    long catId = catIdStr.isEmpty() ? 0L : Long.parseLong(catIdStr.replaceAll("[^0-9]", ""));
    BigDecimal mrp = mrpStr.isEmpty() ? BigDecimal.ZERO : new BigDecimal(mrpStr.replaceAll("[^0-9.]", ""));
    BigDecimal sellingPrice = priceStr.isEmpty() ? BigDecimal.ZERO : new BigDecimal(priceStr.replaceAll("[^0-9.]", ""));
    int stockQuantity = stockStr.isEmpty() ? 0 : Integer.parseInt(stockStr.replaceAll("[^0-9]", ""));

    Category category = categoryRepository.findById(catId)
            .orElseThrow(() -> new RuntimeException("Category ID " + catId + " not found"));

    // Automatically generate a URL-friendly slug from the product name (e.g., "Modern LED Desk Lamp" -> "modern-led-desk-lamp")
    String slug = name.toLowerCase().replaceAll("[^a-z0-9\\s]", "").trim().replaceAll("\\s+", "-");

    Product product = new Product();
    product.setSku(sku);
    product.setName(name);
    product.setSlug(slug); // <-- Set the slug here to satisfy the database constraint!
    product.setShortDescription(shortDesc);
    product.setBrand(brand);
    product.setCategory(category);
    product.setMrp(mrp);
    product.setSellingPrice(sellingPrice);
    product.setStockQuantity(stockQuantity);
    product.setStatus("ACTIVE");

    // Generate Supabase Image URLs
    List<ProductImage> images = new ArrayList<>();
    for (int imgIndex = 1; imgIndex <= 2; imgIndex++) {
        String imageUrl = supabaseBaseUrl + sku + "-" + imgIndex + ".jpg";
        ProductImage img = new ProductImage();
        img.setImageUrl(imageUrl);
        img.setDisplayOrder(imgIndex - 1);
        img.setProduct(product);
        images.add(img);
    }
    product.setImages(images);

    productRepository.save(product);
}
}