package com.project.courseweb.dtos.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnPayIPNResponse {
    @JsonProperty("vnp_ResponseCode")
    String rspCode;
    @JsonProperty("vnp_Message")
    String message;
}
