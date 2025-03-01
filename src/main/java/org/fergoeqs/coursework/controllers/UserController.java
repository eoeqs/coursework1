package org.fergoeqs.coursework.controllers;

import jakarta.validation.ValidationException;
import org.apache.coyote.BadRequestException;
import org.fergoeqs.coursework.dto.*;
import org.fergoeqs.coursework.exception.InternalServerErrorException;
import org.fergoeqs.coursework.exception.UnauthorizedAccessException;
import org.fergoeqs.coursework.jwt.JwtService;
import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.enums.RoleType;
import org.fergoeqs.coursework.services.AuthenticationService;
import org.fergoeqs.coursework.services.UserService;
import org.fergoeqs.coursework.utils.Mappers.AppUserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final AppUserMapper appUserMapper;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);


    public UserController(UserService userService, JwtService jwtService, AuthenticationService authenticationService,
                          AppUserMapper appUserMapper) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.appUserMapper = appUserMapper;
    }

    @GetMapping("/all-owners")
    public ResponseEntity<?> getAllOwners() {
        try {
            return ResponseEntity.ok(appUserMapper.toDTOs(userService.findByRole(RoleType.ROLE_OWNER)));
        } catch (Exception e) {
            logger.error("Error getting owners: {}", e.getMessage());
            throw new InternalServerErrorException("Error getting owners");
        }
    }

    @GetMapping("/all-vets")
    public ResponseEntity<?> getAllVets() {
        try {
            return ResponseEntity.ok(appUserMapper.toDTOs(userService.findByRole(RoleType.ROLE_VET)));
        } catch (Exception e) {
            logger.error("Error getting vets: {}", e.getMessage());
            throw new InternalServerErrorException("Error getting owners");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody RegisterUserDTO user) {

        if (user.password() == null || user.password().isBlank()) {
            throw new ValidationException("Password cannot be blank");
        }
        if (user.phoneNumber() == null || user.phoneNumber().isBlank()) {
            throw new ValidationException("Phone number cannot be blank");
        }
        if (user.email() == null || user.email().isBlank()) {
            throw new ValidationException("Email cannot be blank");
        }

        try {
            AppUser createdUser = authenticationService.signup(user);
            String jwtToken = jwtService.generateToken(createdUser);
            AuthenticationSucceedDto succeedDto = new AuthenticationSucceedDto(jwtToken, jwtService.getExpirationTime());
            return ResponseEntity.ok(succeedDto);
        } catch (Exception e) {
            logger.error("Error during user registration: {}", e.getMessage());
            throw new InternalServerErrorException("Registration failed");
        }
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationSucceedDto> authenticate(@RequestBody LoginUserDTO loginUserDto) {
        try {
            AppUser authenticatedUser = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUser);
            AuthenticationSucceedDto authenticationSucceedDto = new AuthenticationSucceedDto(jwtToken, jwtService.getExpirationTime());
            return ResponseEntity.ok(authenticationSucceedDto);
        } catch (Exception e) {
            logger.error("Authentication failed: {}", e.getMessage());
            throw new UnauthorizedAccessException("Authentication failed");
        }
    }

    @PutMapping("/update-avatar")
    public ResponseEntity<?> updateUserAvatar(@RequestParam("avatar") MultipartFile avatar) {
        try {
            AppUser user = userService.getAuthenticatedUser();
            userService.updateUserAvatar(user, avatar);
            return ResponseEntity.ok("Avatar updated");
        } catch (Exception e) {
            logger.error("Error updating avatar: {}", e.getMessage());
            throw new InternalServerErrorException("Error updating avatar");
        }
    }

    @PutMapping("/update-user/")
    public ResponseEntity<?> updateUser(@RequestBody AppUserDTO userDTO) {
        try {
            AppUser updatedUser = userService.updateUser(userService.getAuthenticatedUser(), userDTO);
            return ResponseEntity.ok(appUserMapper.toDTO(updatedUser));
        } catch (Exception e) {
            logger.error("Error updating personal info: {}", e.getMessage());
            throw new InternalServerErrorException("Error updating user");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update-user-admin/{id}")
    public ResponseEntity<?> updateUserForAdmin(@PathVariable Long id, @RequestBody AppUserDTO userDTO) {
        try {
            AppUser updatedUser = userService.updateUserForAdmin(id, userDTO);
            return ResponseEntity.ok(appUserMapper.toDTO(updatedUser));
        } catch (Exception e) {
            logger.error("Error updating user: {}", e.getMessage());
            throw new InternalServerErrorException("Error updating user");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/update-roles/{id}")
    public ResponseEntity<?> updateRoles(@PathVariable Long id, @RequestBody RoleType userDTO) {
        try {
            AppUser updatedUser = userService.updateUserRoles(id, userDTO);
            return ResponseEntity.ok(appUserMapper.toDTO(updatedUser));
        } catch (Exception e) {
            logger.error("Error updating roles: {}", e.getMessage());
            throw new InternalServerErrorException("Error updating roles");
        }
    }

    @GetMapping("/{id}")
    public Optional<AppUser> getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/get-users")
    public ResponseEntity<?> getAllUsers() throws BadRequestException {
        AppUser user = userService.getAuthenticatedUser();
        logger.info("Getting users for user: {}", user.getUsername());

        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/current-user-info")
    public ResponseEntity<UserInfoDTO> getCurrentUserInfo() throws BadRequestException {
        AppUser user = userService.getAuthenticatedUser();
        logger.info("Fetching ID and role for authenticated user: {}", user.getUsername());

        String role = user.getPrimaryRole().stream()
                .findFirst()
                .map(Enum::name)
                .orElse("USER");

        UserInfoDTO userInfo = new UserInfoDTO(user.getId(), role);
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/user-info/{id}")
    public ResponseEntity<?> getUserDtoById(@PathVariable Long id) throws BadRequestException {
        try {
            AppUser user = userService.findById(id).orElseThrow(() -> new BadRequestException("User not found"));
            return ResponseEntity.ok(appUserMapper.toDTO(user));
        } catch (Exception e) {
            logger.error("Error during user fetching: {}", e.getMessage());
            throw e;
        }
    }


}