package com.dreamteam.pki.dto.certificate.request;

import com.dreamteam.pki.dto.certificate.CertificateExtensionDto;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class CreateEntityCertificateRequest {
    private Date exp;
    private String parentCertificateSerialNumber;
    private String subjectId;
    private String issuerId;
    private List<CertificateExtensionDto> certificateExtensions;
}
