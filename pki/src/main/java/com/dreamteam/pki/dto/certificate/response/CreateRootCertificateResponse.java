package com.dreamteam.pki.dto.certificate.response;

import com.dreamteam.pki.dto.certificate.CertificateExtensionDto;
import com.dreamteam.pki.dto.certificate_holder.UserInfo;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class CreateRootCertificateResponse {
    private String serialNumber;
    private String type;
    private UserInfo issuer;
    private UserInfo subject;
    private Date iat;
    private Date exp;
    private boolean revoked;
    private List<CertificateExtensionDto> extensions;
}
