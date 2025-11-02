package com.project.courseweb.configurations;

import com.project.courseweb.services.RedisService;
import jakarta.annotation.PostConstruct;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Component
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CustomJwtDecoder implements JwtDecoder {
    @Value("${jwt.secret-key}")
    String secretKey;
    /// ////
    private final RedisService redisService;

    private NimbusJwtDecoder nimbusJwtDecoder;

    public CustomJwtDecoder(RedisService redisService) {
        this.redisService = redisService;
    }

    @PostConstruct
    public void init() {
        SecretKey key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA512");
        this.nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        // 1. Perform custom validation first (e.g., check revocation list)
        if (redisService.isBlackListed(token)) {
            throw new JwtException("Token has been revoked");
        }
        try {
            // 2. If not revoked, delegate to the standard decoder for signature and expiration validation
            return nimbusJwtDecoder.decode(token);
        } catch (JwtException e) {
            // Re-throw specific JWT exceptions
            throw e;
        } catch (Exception e) { // Catch other potential unexpected errors
            throw new JwtException("Invalid token", e);
        }
    }
}
