package com.project.courseweb.repositories;

import com.project.courseweb.entities.authentication.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByAuthId(Long id);

    void deleteByAuthId(Long id);

    @Transactional
    @Modifying
    @Query("""
            delete from RefreshToken r where
            	r.expiryTime < :now
            	or r.revoked = true
            """)
    int deleteExpiredOrUsedOrRevokedTokens(@Param("now") Date now);
}
