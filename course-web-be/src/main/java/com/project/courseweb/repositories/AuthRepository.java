package com.project.courseweb.repositories;

import com.project.courseweb.entities.authentication.Auth;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<Auth, Long> {
    boolean existsByEmailOrPhone(String email, String phone);

    Optional<Auth> findByEmail(String email);

    Optional<Auth> findById(Long id);
}
