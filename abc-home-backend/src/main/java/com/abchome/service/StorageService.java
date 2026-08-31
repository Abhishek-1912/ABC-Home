package com.abchome.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-key}")
    private String serviceKey;

    @Value("${supabase.storage-bucket}")
    private String bucket;

    private final RestClient restClient = RestClient.create();

    public String uploadProductImage(MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String extension = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : "";
            String fileName = UUID.randomUUID() + extension;

            String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

            restClient.post()
                    .uri(uploadUrl)
                    .header("Authorization", "Bearer " + serviceKey)
                    .header("apikey", serviceKey)
                    .header("Content-Type", file.getContentType())
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file", e);
        }
    }
}