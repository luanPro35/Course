package com.project.courseweb.repositories.https;

import com.project.courseweb.dtos.request.ExchangeTokenRequest;
import com.project.courseweb.dtos.response.ExchangeTokenResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import reactor.core.publisher.Mono;

@FeignClient(name = "google-oauth2", url = "https://oauth2.googleapis.com")
public interface GoogleOauth2Client {
    @PostMapping(value = "/token", produces =  MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    Mono<ExchangeTokenResponse> exchangeToken(@QueryMap ExchangeTokenRequest request);
}
