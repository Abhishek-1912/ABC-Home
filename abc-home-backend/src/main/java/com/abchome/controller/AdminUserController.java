package com.abchome.controller; // Change this to match your actual package name

import org.springframework.web.bind.annotation.*;

import com.abchome.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

import com.abchome.entity.User; // Update if your package name is different

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173") // Allows your React frontend to connect
public class AdminUserController {

@Autowired
private UserRepository userRepository;

@GetMapping
public ResponseEntity<?> getAllUsers() {
    // This will fetch real users from your database!
    List<User> users = userRepository.findAll();
    return ResponseEntity.ok(users);
}


    // Handles: fetchUserProfile(id)
    // Endpoint: GET http://localhost:8080/api/admin/users/{id}
    // @GetMapping("/{id}")
    // public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
    //     Map<String, Object> mockProfile = Map.of(
    //         "id", id, 
    //         "name", "Rahul Sharma", 
    //         "email", "rahul@example.com", 
    //         "role", "CUSTOMER",
    //         "orders", List.of() // Empty orders array for now
    //     );
    //     return ResponseEntity.ok(mockProfile);
    // }

    // // Handles: updateUserRole(id, newRole)
    // // Endpoint: PATCH http://localhost:8080/api/admin/users/{id}/role
    // @PatchMapping("/{id}/role")
    // public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
    //     String newRole = requestBody.get("role");
        
    //     // Return a success JSON response confirming the new role
    //     return ResponseEntity.ok(Map.of(
    //         "message", "Role updated successfully",
    //         "role", newRole
    //     ));
    // }
}