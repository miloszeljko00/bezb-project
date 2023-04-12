package com.dreamteam.pki.dto.certificate;

import com.dreamteam.pki.model.enums.CertificateExtensionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificateExtensionDto {
    private CertificateExtensionType extensionType;
    private String extensionValue;
    private boolean critical;
}
