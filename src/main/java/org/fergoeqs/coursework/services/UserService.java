package org.fergoeqs.coursework.services;

import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.exception.UnauthorizedAccessException;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.Pet;
import org.fergoeqs.coursework.models.enums.RoleType;
import org.fergoeqs.coursework.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, StorageService storageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.storageService = storageService;
    }

    public AppUser registerUser(String username, String password) {
        Optional<AppUser> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }

        AppUser user = new AppUser(username, passwordEncoder.encode(password));
        user.getRoles().add(RoleType.ROLE_USER);
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

    public void updateUserAvatar(AppUser user, MultipartFile avatar) throws IOException {
        String contentType = avatar.getContentType();
        if (contentType == null || (!contentType.equals("image/png") && !contentType.equals("image/jpeg"))) {
            throw new IllegalArgumentException("Invalid file type. Only PNG and JPEG are allowed.");
        }
        String objectName = "avatar/" + user.getId();
        storageService.uploadFile("users", objectName, avatar.getInputStream(), contentType);
        user.setPhotoUrl(storageService.generatePublicUrl("users", objectName));
        userRepository.save(user);
    }


    public List<AppUser> findAllUsers() {
        return userRepository.findAll();
    }

    public boolean isVet(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_VET"));
    }

    public boolean isAdmin(AppUser user) {
        return user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }

//TODO: назначение ролей + на регистрацию клиента отдельную ручку контроллера чтоб роль сразу ставилась OWNER, аналогично для питомца
}