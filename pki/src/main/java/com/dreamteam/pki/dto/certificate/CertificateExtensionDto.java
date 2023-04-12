package com.dreamteam.pki.dto.certificate;

import lombok.Data;

@Data
public class CertificateExtensionDto {
    private String extensionName;
    private String extensionValue;
    private boolean critical;
}
