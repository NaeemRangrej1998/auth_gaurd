package com.example.backend.config;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!roleRepository.existsByRoleName("SuperAdmin")) {
            Role superAdminRole = Role.builder()
                    .roleName("SuperAdmin")
                    .description("System administrator")
                    .isActive(true)
                    .isDeleted(false)
                    .build();
            roleRepository.save(superAdminRole);
        }

        if (!userRepository.existsByUsername("admin")) {
            Role role = roleRepository.findByRoleName("SuperAdmin").get();
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Super")
                    .lastName("Admin")
                    .email("admin@example.com")
                    .role(role)
                    .isActive(true)
                    .isDeleted(false)
                    .build();
            userRepository.save(admin);
        }
    }
}
