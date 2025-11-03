package com.project.courseweb.configurations;

import com.project.courseweb.services.JwtService;
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

    private final JwtService jwtService;

    private NimbusJwtDecoder nimbusJwtDecoder;

    public CustomJwtDecoder(JwtService jwtService) {
        this.jwtService = jwtService;
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
        if (!this.jwtService.validateToken(token)) {
            throw new JwtException("Token has been revoked");
        }
        try {
            return nimbusJwtDecoder.decode(token);
        } catch (JwtException e) {
            throw e;
        } catch (Exception e) {
            throw new JwtException("Invalid token", e);
        }
    }
}
