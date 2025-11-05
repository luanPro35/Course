package com.project.courseweb.repositories.https;

import com.project.courseweb.dtos.request.ExchangeTokenRequest;
import com.project.courseweb.dtos.response.ExchangeTokenResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

import java.awt.*;

@Repository
public interface GoogleOauth2Client {
    @PostExchange(value = "https://oauth2.googleapis.com", contentType = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    Mono<ExchangeTokenResponse> exchangeToken(@RequestParam ExchangeTokenRequest request);
}
