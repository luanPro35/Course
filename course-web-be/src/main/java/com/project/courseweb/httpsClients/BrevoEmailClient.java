package com.project.courseweb.httpsClients;

import com.project.courseweb.dtos.https.brevo.EmailRequest;
import com.project.courseweb.dtos.https.brevo.EmailResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.service.annotation.PostExchange;

@Repository
public interface BrevoEmailClient {
    @PostExchange(value = "/v3/smtp/email", contentType = MediaType.APPLICATION_JSON_VALUE)
    EmailResponse sendEmail(@RequestHeader("api-key") String apiKey,
                            @RequestBody EmailRequest emailRequest
    );
}
