package com.dreamteam.pki.dto.certificate.response;

import com.dreamteam.pki.dto.certificate_holder.UserInfo;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CreateEntityCertificateResponse {
    private String serialNumber;
    private String type;
    private UserInfo issuer;
    private UserInfo subject;
    private Date iat;
    private Date exp;
    private String parentCertificateSerialNumber;
}
