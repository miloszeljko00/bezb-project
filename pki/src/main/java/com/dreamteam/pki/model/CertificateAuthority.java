package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;

import java.security.PrivateKey;

@Entity
@Data
public class CertificateAuthority extends CertificateHolder {
    public boolean ownsCertificate(Certificate certificate) {
        for(var ownedCertificate : super.getCertificates()) {
            if(ownedCertificate.getSerialNumber().equals(certificate.getSerialNumber())) return true;

            if(ownedCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE && ownedCertificate instanceof IntermediateCertificate intermediateCertificate){
                if(intermediateCertificate.issuedCertificate(certificate)) return true;
            }
        }
        return false;
    }
}
