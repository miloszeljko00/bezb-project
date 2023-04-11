package com.dreamteam.pki.dto.certificate_holder.response;

import com.dreamteam.pki.model.enums.CertificateHolderType;
import lombok.Data;

@Data
public class GetCertificateHolder {
    private String id;
    private String email;
    private CertificateHolderType type;
    private String commonName;
    private String country;
    private String state;
    private String locality;
    private String organization;
    private String organizationalUnit;
}
