package com.project.courseweb.services.implement;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.project.courseweb.entities.authentication.Auth;
import com.project.courseweb.enums.ErrorCode;
import com.project.courseweb.exceptions.AppException;
import com.project.courseweb.services.JwtService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtServiceImpl implements JwtService {
    @Value("${jwt.secret-key}")
    String secretKey;

    @Value("${jwt.access-token-expiration}")
    Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    Long refreshTokenExpiration;


    @Override
    public String generateAccessToken(Auth auth) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(auth.getId()))
                .claim("email", auth.getEmail())
                .claim("scope", this.buildScope(auth))
                .issuer("com.project.2TL")
                .issueTime(new Date())
                .jwtID(UUID.randomUUID().toString())
                .expirationTime(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .build();
        JWSObject jwsObject = new JWSObject(jwsHeader
                , new Payload(jwtClaimsSet.toJSONObject())
        );
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.GENERATED_TOKEN_FAILDD);
        }
        return jwsObject.serialize();
    }

    @Override
    public String generateRefreshToken(Auth auth) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(String.valueOf(auth.getId()))
                .claim("type", "refresh")
                .issuer("com.project.2TL")
                .issueTime(new Date())
                .jwtID(UUID.randomUUID().toString())
                .expirationTime(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .build();
        JWSObject jwsObject = new JWSObject(jwsHeader
                , new Payload(jwtClaimsSet.toJSONObject())
        );
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.GENERATED_TOKEN_FAILDD);
        }
        return jwsObject.serialize();
    }

    @Override
    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) return false;
        try{
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier jwsVerifier = new MACVerifier(secretKey);
            if(!signedJWT.verify(jwsVerifier)) return false;
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime.before(new Date())) return false;
            return true;
        }catch (ParseException|JOSEException exception){
            throw new AppException(ErrorCode.VERIFY_TOKEN_FAILED);
        }
    }

    @Override
    public String getIdFromToken(String token) {
        return "";
    }

    @Override
    public Date getExpirationDateFromToken(String token) {
        return null;
    }

    @Override
    public Date getIssuedAtDateFromToken(String token) {
        return null;
    }

    @Override
    public long getExpirationTimeFromToken(String token) {
        return 0;
    }

    private String buildScope(Auth auth) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(auth.getRoles()))
            auth.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions()
                            .forEach(permission -> stringJoiner.add(permission.getName()));
            });
        return stringJoiner.toString();
    }
}
