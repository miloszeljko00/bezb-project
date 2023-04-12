package com.dreamteam.pki.dto.certificate.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckIfValidResponse {
    private boolean valid;
}
