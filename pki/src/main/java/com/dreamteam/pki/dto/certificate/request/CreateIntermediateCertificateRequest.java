package com.dreamteam.pki.dto.certificate.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
public class CreateIntermediateCertificateRequest {
    private Date exp;
    private String parentCertificateSerialNumber;
    private String subjectId;
}
