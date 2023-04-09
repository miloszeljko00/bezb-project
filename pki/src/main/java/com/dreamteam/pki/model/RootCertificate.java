package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.security.PrivateKey;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class RootCertificate extends Certificate{

    @OneToMany
    private List<Certificate> issuedCertificates;

    public void addIssuedCertificate(Certificate certificate) {
        issuedCertificates.add(certificate);
    }

    public boolean issuedCertificate(Certificate certificate) {
        for( var issuedCertificate : issuedCertificates) {
            if(issuedCertificate.getSerialNumber().equals(certificate.getSerialNumber())) return true;

            if(issuedCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE && issuedCertificate instanceof IntermediateCertificate intermediateCertificate) {
                if(intermediateCertificate.issuedCertificate(certificate)) return true;
            }
        }
        return false;
    }

    public boolean canIssueUntilExp(Date exp) {
        return !super.getDateRange().getEndDate().before(exp);
    }
}
