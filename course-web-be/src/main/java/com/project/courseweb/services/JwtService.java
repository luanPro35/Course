package com.project.courseweb.services;

import com.project.courseweb.entities.authentication.Auth;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public interface JwtService {
    String generateAccessToken(Auth auth);

    String generateRefreshToken(Auth auth);

    boolean validateToken(String token);

    String getIdFromToken(String token);

    Date getExpirationDateFromToken(String token);

    Date getIssuedAtDateFromToken(String token);

    long getExpirationTimeFromToken(String token);
}
