package com.dreamteam.pki.dto.certificate.response;

import com.dreamteam.pki.dto.certificate_holder.UserInfo;
import com.dreamteam.pki.model.Certificate;
import com.dreamteam.pki.model.IntermediateCertificate;
import com.dreamteam.pki.model.RootCertificate;
import com.dreamteam.pki.model.enums.CertificateType;
import com.dreamteam.pki.service.customMapper.X500NameMapper;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class GetCertificateResponse {
    private String serialNumber;
    private String type;
    private UserInfo issuer;
    private UserInfo subject;
    private Date iat;
    private Date exp;
    private boolean revoked;
    private List<GetCertificateResponse> issuedCertificates;


    public void setIssuedCertificates(List<Certificate> certificates) {
        issuedCertificates = new ArrayList<>();
        for(var certificate : certificates) {
            var certificateDto = GetCertificateResponse.builder()
                    .serialNumber(certificate.getSerialNumber().toString())
                    .type(certificate.getType().toString())
                    .issuer(X500NameMapper.fromX500Name(certificate.getIssuer().getX500Name(), certificate.getIssuer().getType()))
                    .subject(X500NameMapper.fromX500Name(certificate.getSubject().getX500Name(), certificate.getSubject().getType()))
                    .iat(certificate.getDateRange().getStartDate())
                    .exp(certificate.getDateRange().getEndDate())
                    .revoked(certificate.isRevoked())
                    .issuedCertificates(new ArrayList<>())
                    .build();

            if(certificate.getType() == CertificateType.ROOT_CERTIFICATE) {
                certificateDto.setIssuedCertificates(((RootCertificate) certificate).getIssuedCertificates());
            }else if(certificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE) {
                certificateDto.setIssuedCertificates(((IntermediateCertificate) certificate).getIssuedCertificates());
            }
            issuedCertificates.add(certificateDto);
        }
    }
}
