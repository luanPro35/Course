package com.project.courseweb.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum SuccessCode {
    AUTHENTICATED_GOOGLE_SUCCESS(200, "Đăng nhập thành công với Google", HttpStatus.OK),
    CREATED_USER_SUCCESS(201, "Tạo thành công người dùng", HttpStatus.CREATED),
    AUTHENTICATED_SUCCESS(200, "Đăng nhập thành công", HttpStatus.OK),
    REFRESH_TOKEN_SUCCESS(200, "Refresh token thành công", HttpStatus.OK),
    LOGOUT_SUCCESS(200, "Đăng xuất thành công", HttpStatus.OK),
    INTROSPECT_TOKEN_SUCCESS(200, "Introspect token thành công", HttpStatus.OK),
    UPDATE_PROFILE_SUCCESS(200, "Cập nhật thành công", HttpStatus.OK),
    UPDATE_AVATAR_SUCCESS(200, "Cập nhật avatar thành công", HttpStatus.OK),
    GET_PROFILE_SUCCESS(200, "Lấy thông tin thành công", HttpStatus.OK),
    CREATE_POST_SUCCESS(201, "Tạo bài viết thành công", HttpStatus.CREATED),
    UPLOAD_POST_THUMBNAIL_SUCCESS(200, "Cập nhật ảnh bài viết thành công", HttpStatus.OK), GET_POSTS_BY_STATUS_SUCCESS(200, "Lấy danh sách bài viết theo trạng thái thành công", HttpStatus.OK), GET_POST_SUCCESS(200, "Lấy bài viết thành công", HttpStatus.OK), UPDATED_POST_SUCCESS(200, "Cập nhật bài viết thành công", HttpStatus.OK), DELETE_POST_SUCCESS(200, "Xóa bài viết thành công", HttpStatus.OK),
    CREATE_COURSE_SUCCESS(201, "Tạo khóa học thành công", HttpStatus.CREATED),
    GET_COURSE_SUCCESS(200, "Lấy khóa học thành công", HttpStatus.OK),
    DELETE_COURSE_SUCCESS(200, "Xóa khóa học thành công", HttpStatus.OK),
    UPDATE_COURSE_SUCCESS(200, "Cập nhật khóa học thành công", HttpStatus.OK),
    UPDATE_STATUS_COURSE_SUCCESS(200, "Cập nhật trạng thái khóa học thành công", HttpStatus.OK),
    GET_COURSES_SUCCESS(200, "Lấy danh sách khóa học thành công", HttpStatus.OK),
    ENROLL_COURSE_SUCCESS(200, "Đăng ký khóa học thành công", HttpStatus.OK),
    CREATE_PAYMENT(201, "Tạo thanh toán thành công", HttpStatus.CREATED),
    VN_PAY_IPN_SUCCESS(200, "Xử lý thanh toán thành công", HttpStatus.OK),
    PAYMENT_SUCCESS(200, "Thanh toán thành công", HttpStatus.OK),
    REFUND_SUCCESS(200, "Hoàn tiền thành công", HttpStatus.OK),
    CHECK_TRANSACTION_STATUS_SUCCESS(200, "Kiểm tra trạng thái giao dịch thành công", HttpStatus.OK),
    GET_ORDERS_SUCCESS(200, "Lấy danh sách đơn hàng thành công", HttpStatus.OK),
    UPLOAD_FILE_SUCCESS(200, "Cập nhật ảnh thành công", HttpStatus.OK),
    GET_LIST_COURSE_ENROLLMENT_SUCCESS(200, "Lấy danh sách khóa học ghi danh thành công", HttpStatus.OK),
    GET_USERS_SUCCESS(200, "Lấy danh sách người dùng thành công", HttpStatus.OK),
    DELETE_USER_SUCCESS(200, "Xóa người dùng thành công", HttpStatus.OK);

    final int status;
    final String message;
    final HttpStatus httpStatus;

    SuccessCode(int status, String message, HttpStatus httpStatus) {
        this.status = status;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
