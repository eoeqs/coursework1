package org.fergoeqs.coursework.repositories;

import org.fergoeqs.coursework.models.AppUser;
import org.fergoeqs.coursework.models.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByEmail(String email);
    List<AppUser> findByRolesContaining(RoleType role);
}
