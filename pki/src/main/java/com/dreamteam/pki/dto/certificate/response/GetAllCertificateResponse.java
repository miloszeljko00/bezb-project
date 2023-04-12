package com.dreamteam.pki.dto.certificate.response;

import com.dreamteam.pki.model.Certificate;
import com.dreamteam.pki.model.IntermediateCertificate;
import com.dreamteam.pki.model.RootCertificate;
import com.dreamteam.pki.model.enums.CertificateType;
import com.dreamteam.pki.service.customMapper.X500NameMapper;
import lombok.*;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;

@Data
public class GetAllCertificateResponse {
    private List<GetCertificateResponse> certificates;
    private final ModelMapper mapper;

    public GetAllCertificateResponse() {
        certificates = new ArrayList<>();
    }

    public GetAllCertificateResponse(List<Certificate> certificates) {
        this.certificates = new ArrayList<>();

        for(var certificate : certificates) {
            var certificateDto = GetCertificateResponse.builder()
                    .id(certificate.getSerialNumber().toString())
                    .type(certificate.getType().toString())
                    .issuer(X500NameMapper.fromX500Name(certificate.getIssuer().getX500Name(), certificate.getIssuer().getType()))
                    .subject(X500NameMapper.fromX500Name(certificate.getSubject().getX500Name(), certificate.getSubject().getType()))
                    .iat(certificate.getDateRange().getStartDate())
                    .exp(certificate.getDateRange().getEndDate())
                    .revoked(certificate.isRevoked())
                    .issuedCertificates(new ArrayList<>())
                    .extensions()
                .build();
            if(certificate.getType() == CertificateType.ROOT_CERTIFICATE){
                certificateDto.setIssuedCertificates(((RootCertificate) certificate).getIssuedCertificates());
            }else if(certificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE){
                certificateDto.setIssuedCertificates(((IntermediateCertificate) certificate).getIssuedCertificates());
            }

            this.certificates.add(certificateDto);
        }

    }

}
