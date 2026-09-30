package com.example.backend.service;

import com.example.backend.dto.user.UserRequest;
import com.example.backend.dto.user.UserResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .role(role)
                .isActive(true)
                .isDeleted(false)
                .build();

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> !u.getIsDeleted())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getPaginatedUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<User> userPage;
        
        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.searchUsers(search, pageable);
        } else {
            userPage = userRepository.findAllActive(pageable);
        }

        List<UserResponse> users = userPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Map<String, Object> pages = new HashMap<>();
        pages.put("totalPages", userPage.getTotalPages());
        pages.put("currentPage", page);
        pages.put("prevPage", userPage.hasPrevious() ? page - 1 : null);
        pages.put("nextPage", userPage.hasNext() ? page + 1 : null);

        Map<String, Object> data = new HashMap<>();
        data.put("pages", pages);
        data.put("users", users);

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "Users fetched successfully");
        response.put("totalUsers", userPage.getTotalElements());
        response.put("data", data);

        return response;
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }
    
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(role);

        return mapToResponse(userRepository.save(user));
    }

    public void updateUserStatus(Long id, Boolean isActive) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsDeleted(true);
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roleName(user.getRole().getRoleName())
                .isActive(user.getIsActive())
                .isDeleted(user.getIsDeleted())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
