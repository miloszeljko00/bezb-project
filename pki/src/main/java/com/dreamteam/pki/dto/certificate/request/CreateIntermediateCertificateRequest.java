package com.dreamteam.pki.dto.certificate.request;

import lombok.Data;

import java.util.Date;

@Data
public class CreateIntermediateCertificateRequest {
    private Date exp;
    private String parentCertificateSerialNumber;
    private String subjectId;
}
