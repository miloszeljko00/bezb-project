package com.dreamteam.pki.controller;

import com.dreamteam.pki.auth.role_validators.AdminOrCertificateAuthorityRole;
import com.dreamteam.pki.auth.role_validators.AdminRole;
import com.dreamteam.pki.dto.ErrorCodes;
import com.dreamteam.pki.dto.ErrorMessage;
import com.dreamteam.pki.dto.certificate.CertificateExtensionDto;
import com.dreamteam.pki.dto.certificate.request.CreateEntityCertificateRequest;
import com.dreamteam.pki.dto.certificate.request.CreateIntermediateCertificateRequest;
import com.dreamteam.pki.dto.certificate.request.CreateRootCertificateRequest;
import com.dreamteam.pki.dto.certificate.response.*;
import com.dreamteam.pki.model.*;
import com.dreamteam.pki.model.enums.CertificateHolderType;
import com.dreamteam.pki.model.enums.CertificateType;
import com.dreamteam.pki.service.certificate.CertificateService;
import com.dreamteam.pki.service.customMapper.X500NameMapper;
import com.dreamteam.pki.service.generators.KeyPairGenerator;
import com.dreamteam.pki.service.certificateHolder.CertificateHolderService;
import com.dreamteam.pki.service.template.TemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/templates")
public class TemplateController {
    private final CertificateHolderService certificateHolderService;
    private final CertificateService certificateService;
    private final KeyPairGenerator keyPairGenerator;
    private final TemplateService templateService;

    private final ModelMapper mapper;


    private Certificate filterRevoked(Certificate certificate) {
        if(certificate.isRevoked()) return null;

        if(certificate.getType().equals(CertificateType.ROOT_CERTIFICATE)){
            if(!certificateService.isValid((RootCertificate) certificate)) return null;
        }else if(certificate.getType().equals(CertificateType.INTERMEDIATE_CERTIFICATE)){
            if(!certificateService.isValid((IntermediateCertificate) certificate)) return null;
        }else if(certificate.getType().equals(CertificateType.ENTITY_CERTIFICATE)){
            if(!certificateService.isValid((EntityCertificate) certificate)) return null;
        }

        if(certificate.getType().equals(CertificateType.ROOT_CERTIFICATE)) {
            var issuedCertificates = filterRevoked(((RootCertificate) certificate).getIssuedCertificates());
            ((RootCertificate) certificate).setIssuedCertificates(issuedCertificates);
        }
        if(certificate.getType().equals(CertificateType.INTERMEDIATE_CERTIFICATE)) {
            var issuedCertificates = filterRevoked(((IntermediateCertificate) certificate).getIssuedCertificates());
            ((IntermediateCertificate) certificate).setIssuedCertificates(issuedCertificates);
        }
        return certificate;
    }

    @GetMapping
    public ResponseEntity<Object> getAllTemplates(Authentication authentication) {
        return new ResponseEntity<>(templateService.getAll(), HttpStatus.OK);
    }

    private List<Certificate> filterRevoked(List<Certificate> certificates) {
        var result = new ArrayList<Certificate>();
        for(var certificate : certificates) {
            if(certificate.isRevoked()) continue;
            if(certificate.getType().equals(CertificateType.ROOT_CERTIFICATE)){
                if(!certificateService.isValid((RootCertificate) certificate)) continue;
            }else if(certificate.getType().equals(CertificateType.INTERMEDIATE_CERTIFICATE)){
                if(!certificateService.isValid((IntermediateCertificate) certificate)) continue;
            }else if(certificate.getType().equals(CertificateType.ENTITY_CERTIFICATE)){
                if(!certificateService.isValid((EntityCertificate) certificate)) continue;
            }
            result.add(certificate);

            if(certificate.getType().equals(CertificateType.ROOT_CERTIFICATE)) {
                var issuedCertificates = filterRevoked(((RootCertificate) certificate).getIssuedCertificates());
                ((RootCertificate) certificate).setIssuedCertificates(issuedCertificates);
            }
            if(certificate.getType().equals(CertificateType.INTERMEDIATE_CERTIFICATE)) {
                var issuedCertificates = filterRevoked(((IntermediateCertificate) certificate).getIssuedCertificates());
                ((IntermediateCertificate) certificate).setIssuedCertificates(issuedCertificates);
            }
        }
        return result;
    }

    @AdminRole
    @PostMapping
    public ResponseEntity<Object> createTemplate(@RequestBody Template template, Authentication authentication) {

        return new ResponseEntity<>(templateService.create(template), HttpStatus.CREATED);
    }


}
