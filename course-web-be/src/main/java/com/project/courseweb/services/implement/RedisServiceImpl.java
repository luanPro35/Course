package com.project.courseweb.services.implement;

import com.project.courseweb.services.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RedisServiceImpl implements RedisService {
    RedisTemplate<String, Object> redisTemplate;

    @Override
    public void blackListAccessToken(String token, Long expireTime) {
        String key = "access_token:" + token;
        redisTemplate.opsForValue().set(key, "logout", expireTime, TimeUnit.MILLISECONDS);
    }

    @Override
    public boolean isBlackListed(String token) {
        String key = "access_token:" + token;
        return redisTemplate.hasKey(key);
    }

    @Override
    public void saveOtp(String key, String otp, int minutes) {
        this.redisTemplate.opsForValue()
                .set(key, otp, minutes, TimeUnit.MINUTES);
    }

    @Override
    public String getOtp(String key) {
        return (String) this.redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteOtp(String key) {
        this.redisTemplate.delete(key);
    }
}
