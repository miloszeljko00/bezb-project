package com.dreamteam.pki.dto.certificate;

import com.dreamteam.pki.model.enums.CertificateExtensionType;
import lombok.Data;

@Data
public class CertificateExtensionDto {
    private CertificateExtensionType extensionType;
    private String extensionValue;
    private boolean critical;
}
