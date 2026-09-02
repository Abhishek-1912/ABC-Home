package com.abchome.service;

import com.abchome.dto.ReviewRequest;
import com.abchome.dto.ReviewResponse;
import com.abchome.entity.Product;
import com.abchome.entity.Review;
import com.abchome.entity.User;
import com.abchome.exception.ResourceNotFoundException;
import com.abchome.repository.ProductRepository;
import com.abchome.repository.ReviewRepository;
import com.abchome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewResponse> listForProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ReviewResponse create(String userEmail, Long productId, ReviewRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new IllegalArgumentException("You've already reviewed this product");
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(req.getRating());
        review.setTitle(req.getTitle());
        review.setComment(req.getComment());

        reviewRepository.save(review);
        return toDto(review);
    }

    @Transactional
    public void delete(String userEmail, Long reviewId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse toDto(Review r) {
        return new ReviewResponse(
                r.getId(), r.getUser().getFullName(), r.getRating(), r.getTitle(), r.getComment(), r.getCreatedAt()
        );
    }
}