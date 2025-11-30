package com.project.courseweb.services.implement;

import com.project.courseweb.dtos.https.brevo.*;
import com.project.courseweb.httpsClients.BrevoEmailClient;
import com.project.courseweb.services.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
    BrevoEmailClient brevoEmailClient;

    @Value("${notification.email.api-key}")
    @NonFinal
    String brevoApiKey;

    @Value("${notification.sender.email}")
    @NonFinal
    String senderEmail;

    @Value("${notification.sender.name}")
    @NonFinal
    String senderName;

    @Override
    public EmailResponse sendEmail(SendEmailRequest request) {
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .email(senderEmail)
                        .name(senderName)
                        .build())
                .subject(request.getSubject())
                .htmlContent(request.getHtmlContent())
                .to(List.of(request.getTo()))
                .build();
        return brevoEmailClient.sendEmail(brevoApiKey, emailRequest);
    }
}
