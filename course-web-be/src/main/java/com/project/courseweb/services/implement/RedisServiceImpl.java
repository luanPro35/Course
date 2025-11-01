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
@FieldDefaults (level = AccessLevel.PRIVATE, makeFinal = true)
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
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
