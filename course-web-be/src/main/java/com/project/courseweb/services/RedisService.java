package com.project.courseweb.services;

import org.springframework.stereotype.Service;

@Service
public interface RedisService {
    void blackListAccessToken(String token, Long expireTime);

    boolean isBlackListed(String token);

    void saveOtp(String key, String otp, int minutes);

    String getOtp(String key);

    void deleteOtp(String key);
}
