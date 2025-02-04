package org.fergoeqs.coursework.security;

import org.springframework.transaction.annotation.Transactional;
import org.fergoeqs.coursework.repositories.UsersRepository;
import org.springframework.stereotype.Service;

@Transactional(readOnly = true)
@Service
public class UserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    private PasswordEncoder passwordEncoder() {
        return new StandardPasswordEncoder(); //?????????? ?? ?????????? ?????????? ?????? ??????
    }

    @Autowired
    public UserDetailService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new CustomUserDetails(user); //
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }
    public User findById(Long userId){ //???
        Optional<User> user = usersRepository.findById(userId);
        return user.orElse(null);
    }

    public User findByUsername(String username){ //???
        Optional<User> user = usersRepository.findByUsername(username);
        return user.orElse(null);
    }

    public List<User> findAll(){ //???
        return usersRepository.findAll();
    }
    @Transactional
    public void register(User user) {
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        user.setRole(AccessRole.USER); //??? ?????? ??????, ??? ?? ???????? ??????
//        user.setRole(user.getRole()); // ???????? ????? ????? ?????
        usersRepository.save(user);
        System.out.println("User saved with ID: " + user.getUsername());
    }

    public void setAdminRole(String username) {
        User user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        user.setRole(AccessRole.ADMIN);
        usersRepository.save(user);
    }

    public CustomUserDetails getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserDetails) authentication.getPrincipal();
    }

}
