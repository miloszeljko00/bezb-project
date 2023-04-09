package com.dreamteam.pki.dto.certificate.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class CreateRootCertificateRequest {
    private Date exp;
}
