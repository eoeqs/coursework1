package org.fergoeqs.coursework.services;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.exception.UnauthorizedAccessException;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.enums.RoleType;
import org.fergoeqs.coursework.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser registerUser(String username, String password) {
        Optional<AppUser> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }

        AppUser user = new AppUser(username, passwordEncoder.encode(password));
        user.getRoles().add(RoleType.USER);
        return userRepository.save(user);
    }

    public Optional<AppUser> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<AppUser> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<AppUser> authenticate(String username, String password) {
        Optional<AppUser> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            AppUser user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public AppUser getAuthenticatedUser() throws BadRequestException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
            String username = userDetails.getUsername();
            return findByUsername(username)
                    .orElseThrow(() -> new BadRequestException("User not found"));
        }
        throw new UnauthorizedAccessException("User not authenticated");
    }


    public List<AppUser> findAllUsers() {
        return userRepository.findAll();
    }

    public boolean isVet(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("VET"));
    }

    public boolean isAdmin(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    }

//TODO: назначение ролей + на регистрацию клиента отдельную ручку контроллера чтоб роль сразу ставилась OWNER, аналогично для питомца
}