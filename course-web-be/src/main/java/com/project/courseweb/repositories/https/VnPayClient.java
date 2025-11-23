package com.project.courseweb.repositories.https;

import com.project.courseweb.dtos.response.VnPayQueryDrResponse;
import com.project.courseweb.dtos.response.VnPayRefundResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

import java.util.Map;

@Repository
public interface VnPayClient {
    @PostExchange(value = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
            contentType = MediaType.APPLICATION_JSON_VALUE)
    Mono<VnPayRefundResponse> callRefund(@RequestBody Map<String, String> params);

    @PostExchange(
            value = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
            contentType = MediaType.APPLICATION_JSON_VALUE
    )
    Mono<VnPayQueryDrResponse> callQueryDr(@RequestBody Map<String, String> params);
}
