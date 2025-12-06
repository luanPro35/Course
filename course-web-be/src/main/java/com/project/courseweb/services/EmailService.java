package com.project.courseweb.services;

import com.project.courseweb.dtos.https.brevo.EmailResponse;
import com.project.courseweb.dtos.https.brevo.SendEmailRequest;
import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    EmailResponse sendEmail(SendEmailRequest request);
}
