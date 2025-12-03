package com.project.courseweb.services;

import com.project.courseweb.dtos.https.brevo.Recipient;
import com.project.courseweb.dtos.https.brevo.SendEmailRequest;
import com.project.notification.PaymentSuccessEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    KafkaTemplate<String, Object> kafkaTemplate;

    public void sendPaymentSuccessEmail(PaymentSuccessEvent event) {
        String subject = "Xác nhận thanh toán thành công cho khóa học: " + event.getCourseName();
        String htmlContent = """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <title>Thanh toán thành công</title>
                </head>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
                    <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px;">
                        <tr>
                            <td style="padding: 40px; text-align: center;">
                                <h1 style="color: #28a745;">Thanh toán thành công!</h1>
                                <p style="font-size: 16px; color: #555555;">Xin chào <strong>%s</strong>,</p>
                                <p style="font-size: 16px; color: #555555;">Cảm ơn bạn đã đăng ký khóa học "<strong>%s</strong>".</p>
                                <p style="font-size: 14px; color: #888888;">Mã đơn hàng của bạn là: <strong>%s</strong></p>
                                <p style="margin-top: 30px;">
                                    <a href="http://localhost:3000/courses/free/%s" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px;">Vào học ngay</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(event.getFullName(), event.getCourseName(), event.getOrderRef(), event.getCourseId());
        this.kafkaTemplate.send("email-notifications", SendEmailRequest.builder()
                .to(Recipient.builder()
                        .email(event.getEmail())
                        .name(event.getFullName())
                        .build())
                .subject(subject)
                .htmlContent(htmlContent)
                .build());
    }

    public void sendWelcomeEmail(String email, String fullName) {
        String subject = "Chào mừng " + fullName + " đến với Web-!";
        String htmlContent = """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Chào mừng bạn đến với Kobi</title>
                </head>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
                    <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px; text-align: center;">
                                <h1 style="color: #333333;">Chào mừng bạn đến với Kobi!</h1>
                                <p style="font-size: 16px; color: #555555; line-height: 1.5;">Xin chào <strong>%s</strong>,</p>
                                <p style="font-size: 16px; color: #555555; line-height: 1.5;">Cảm ơn bạn đã đăng ký tài khoản tại Kobi. Chúng tôi rất vui khi có bạn là một phần của cộng đồng.</p>
                                <p style="margin-top: 30px;"><a href="http://localhost:3000" style="background-color: #007bff; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Bắt đầu khám phá các khóa học</a></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f9f9f9; text-align: center; padding: 20px;">
                                <p style="font-size: 12px; color: #888888;">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email <a href="mailto:support@kobi.com">support@kobi.com</a>.</p>
                                <p style="font-size: 12px; color: #888888;">© 2025 Kobi. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(fullName);
        this.kafkaTemplate.send("email-notifications", SendEmailRequest.builder()
                .to(Recipient.builder()
                        .email(email)
                        .name(fullName)
                        .build())
                .subject(subject)
                .htmlContent(htmlContent)
                .build());
    }
}
