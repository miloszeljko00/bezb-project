package com.dreamteam.pki.dto.certificate.request;

import com.dreamteam.pki.dto.certificate.CertificateExtensionDto;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
public class CreateRootCertificateRequest {
    private Date exp;
    private List<CertificateExtensionDto> certificateExtensions;
}
