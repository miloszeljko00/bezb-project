package com.dreamteam.pki.dto.certificate_holder.request;

import com.dreamteam.pki.model.Account;
import com.dreamteam.pki.model.Certificate;
import com.dreamteam.pki.model.enums.CertificateHolderType;
import jakarta.persistence.*;
import lombok.Data;
import org.bouncycastle.asn1.x500.X500Name;

import java.util.List;

@Data
public class CreateCertificateAuthorityRequest {
    private String email;
    private String password;
    private String commonName;
    private String country;
    private String state;
    private String locality;
    private String organization;
    private String organizationalUnit;
}
