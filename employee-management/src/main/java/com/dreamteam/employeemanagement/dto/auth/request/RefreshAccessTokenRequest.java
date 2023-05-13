package com.dreamteam.employeemanagement.dto.auth.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshAccessTokenRequest {
    private String email;
    private String refreshToken;
}
