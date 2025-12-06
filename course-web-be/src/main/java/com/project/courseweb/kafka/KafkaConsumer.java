package com.project.courseweb.kafka;

import com.project.courseweb.dtos.https.brevo.SendEmailRequest;
import com.project.courseweb.services.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KafkaConsumer {
    EmailService emailService;

    @KafkaListener(topics = "email-notifications", groupId = "course-web-group")
    public void handleEmailNotification(SendEmailRequest request) {
        log.info("Received email request from Kafka for recipient: {}", request.getTo().getEmail());
        try {
            emailService.sendEmail(request);
            log.info("Successfully processed email request for {}", request.getTo().getEmail());
        } catch (Exception e) {
            log.error("Failed to send email for request: {}. Error: {}", request, e.getMessage());
            throw new RuntimeException("Email sending failed, will be retried by Kafka", e);
        }
    }
}
