package org.fergoeqs.coursework.security;

import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.enums.RoleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.fergoeqs.coursework.repositories.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Transactional(readOnly = true)
@Service
public class UserDetailService implements UserDetailsService {

    private final UsersRepository usersRepository;

    private PasswordEncoder passwordEncoder() {
        return new StandardPasswordEncoder(); //TODO: Саша нормальную кодировку пароля потом сделай
    }

    @Autowired
    public UserDetailService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { //вместо юзернейма может быть и логин
        AppUser user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new CustomUserDetails(user); //
    }

    private Collection<? extends GrantedAuthority> getAuthorities(AppUser user) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }
    public AppUser findById(Long userId){
        Optional<AppUser> user = usersRepository.findById(userId);
        return user.orElse(null);
    }

    public AppUser findByEmail(String email){
        Optional<AppUser> user = usersRepository.findByEmail(email);
        return user.orElse(null);
    }

    public AppUser findByUsername(String username){
        Optional<AppUser> user = usersRepository.findByUsername(username);
        return user.orElse(null);
    }

    public List<AppUser> findAll(){ //???
        return usersRepository.findAll();
    }


    @Transactional
    public void register(AppUser user) {
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        user.setRole(RoleType.USER);
        usersRepository.save(user); //TODO: добавить остальные поля здесь или в контроллере
    }

    @Transactional
    public void updateUser(Long id, AppUser updatedUser) {//может ли админ менять персональные данные или нет
        Optional<AppUser> existingAppUser = usersRepository.findById(id); //TODO: переделать потом с контроллером нормально
        usersRepository.save(updatedUser); //TODO: добавить изменение пароля отдельно
    }

    @Transactional
    public void setRole(String username, RoleType role) {
        AppUser user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        user.setRole(role);
        usersRepository.save(user);
    }

    public CustomUserDetails getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) authentication.getPrincipal();
    }

}
