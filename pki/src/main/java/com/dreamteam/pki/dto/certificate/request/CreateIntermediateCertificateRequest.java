package com.dreamteam.pki.dto.certificate.request;

import com.dreamteam.pki.dto.certificate.CertificateExtensionDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
public class CreateIntermediateCertificateRequest {
    private Date exp;
    private String parentCertificateSerialNumber;
    private String subjectId;
    private List<CertificateExtensionDto> certificateExtensions;
}
