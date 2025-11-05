package com.project.courseweb.configurations;

import com.project.courseweb.repositories.https.GoogleOauth2Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfiguration {
    @Bean
    GoogleOauth2Client googleOauth2Client(WebClient.Builder webClientBuilder) {
        WebClient webClient = webClientBuilder
                .build();
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builderFor(WebClientAdapter.create(webClient))
                .build();
        return httpServiceProxyFactory.createClient(GoogleOauth2Client.class);
    }
}
