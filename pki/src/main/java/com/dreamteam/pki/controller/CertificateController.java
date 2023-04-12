package com.dreamteam.pki.controller;

import com.dreamteam.pki.auth.role_validators.AdminOrCertificateAuthorityRole;
import com.dreamteam.pki.auth.role_validators.AdminRole;
import com.dreamteam.pki.dto.ErrorCodes;
import com.dreamteam.pki.dto.ErrorMessage;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.security.KeyPair;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/certificates")
public class CertificateController {
    private final CertificateHolderService certificateHolderService;
    private final CertificateService certificateService;
    private final KeyPairGenerator keyPairGenerator;

    private final ModelMapper mapper;

    @GetMapping("/{serialNumber}")
    public ResponseEntity<Object> getCertificate(@PathVariable String serialNumber, Authentication authentication) {
        var user = certificateHolderService.findByEmail(authentication.getName());

        if(user == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var certificate = certificateService.findBySerialNumber(new BigInteger(serialNumber));

        if(certificate == null) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        var response = GetCertificateResponse.builder()
                .id(certificate.getSerialNumber().toString())
                .type(certificate.getType().toString())
                .issuer(X500NameMapper.fromX500Name(certificate.getIssuer().getX500Name(), certificate.getIssuer().getType()))
                .subject(X500NameMapper.fromX500Name(certificate.getSubject().getX500Name(), certificate.getSubject().getType()))
                .iat(certificate.getDateRange().getStartDate())
                .exp(certificate.getDateRange().getEndDate())
                .revoked(certificate.isRevoked())
                .issuedCertificates(new ArrayList<>())
                .build();

        if(user.getType() == CertificateHolderType.ADMIN) {

            if(certificate.getType() == CertificateType.ROOT_CERTIFICATE){
                response.setIssuedCertificates(((RootCertificate) certificate).getIssuedCertificates());
            }

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        if(user.getType() == CertificateHolderType.CERTIFICATE_AUTHORITY) {
            if(((CertificateAuthority) user).ownsCertificate(certificate)){
                if(certificate.getType() == CertificateType.ROOT_CERTIFICATE){
                    response.setIssuedCertificates(((RootCertificate) certificate).getIssuedCertificates());
                }else if(certificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE){
                    response.setIssuedCertificates(((IntermediateCertificate) certificate).getIssuedCertificates());
                }
                return new ResponseEntity<>(response, HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        if(user.getType() == CertificateHolderType.ENTITY) {
            if(user.getCertificates().contains(certificate)) return new ResponseEntity<>(response, HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping
    public ResponseEntity<Object> getAllCertificate(Authentication authentication) {
        var user = certificateHolderService.findByEmail(authentication.getName());

        if(user == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var response = new GetAllCertificateResponse(user.getCertificates());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @AdminRole
    @PostMapping("/actions/create-root-certificate")
    public ResponseEntity<Object> createRootCertificate(@RequestBody CreateRootCertificateRequest createRootCertificateRequest, Authentication authentication) {
        var user = certificateHolderService.findByEmail(authentication.getName());

        if(user == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var certificateType = CertificateType.ROOT_CERTIFICATE;
        var dateRange = DateRange.Create(new Date(), createRootCertificateRequest.getExp());
        if(dateRange == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        KeyPair keys = keyPairGenerator.generateKeyPair();

        var rootCertificate = RootCertificate.builder()
                .issuedCertificates(new ArrayList<>())
                .privateKey(keys.getPrivate())
                .type(certificateType)
                .issuer(user)
                .subject(user)
                .dateRange(dateRange)
                .revoked(false)
                .publicKey(keys.getPublic())
                .certificateExtensions(mapper.map(createRootCertificateRequest.getCertificateExtensions(), new TypeToken<List<CertificateExtension>>() {}.getType()))
            .build();

        rootCertificate = certificateService.createRootCertificate(rootCertificate);

        var response = CreateRootCertificateResponse.builder()
                .serialNumber(rootCertificate.getSerialNumber().toString())
                .type(rootCertificate.getType().toString())
                .issuer(X500NameMapper.fromX500Name(rootCertificate.getIssuer().getX500Name(), rootCertificate.getIssuer().getType()))
                .subject(X500NameMapper.fromX500Name(rootCertificate.getSubject().getX500Name(), rootCertificate.getSubject().getType()))
                .iat(rootCertificate.getDateRange().getStartDate())
                .exp(rootCertificate.getDateRange().getEndDate())
                .revoked(rootCertificate.isRevoked())
            .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @AdminOrCertificateAuthorityRole
    @PostMapping("/actions/create-intermediate-certificate")
    public ResponseEntity<Object> createIntermediateCertificate(@RequestBody CreateIntermediateCertificateRequest createIntermediateCertificateRequest, Authentication authentication) {
        var user = certificateHolderService.findByEmail(authentication.getName());

        if(user == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var parentCertificate = certificateService.findBySerialNumber(new BigInteger(createIntermediateCertificateRequest.getParentCertificateSerialNumber()));

        if(parentCertificate == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        if(parentCertificate.getType() == CertificateType.ENTITY_CERTIFICATE) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(parentCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE) {
            if(!((IntermediateCertificate) parentCertificate).canIssueUntilExp(createIntermediateCertificateRequest.getExp())) return new ResponseEntity<>(HttpStatus.CONFLICT);
            if(!certificateService.isValid((IntermediateCertificate) parentCertificate)) return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        if(parentCertificate.getType() == CertificateType.ROOT_CERTIFICATE) {
            if(!((RootCertificate) parentCertificate).canIssueUntilExp(createIntermediateCertificateRequest.getExp())) return new ResponseEntity<>(HttpStatus.CONFLICT);
            if(!certificateService.isValid((RootCertificate) parentCertificate)) return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        var issuer = parentCertificate.getSubject();
        var subject = certificateHolderService.findById(createIntermediateCertificateRequest.getSubjectId());

        if(subject.getType() == CertificateHolderType.ENTITY) return new ResponseEntity<>(new ErrorMessage("Entity can't own intermediate certificate", ErrorCodes.SUBJECT_CANT_OWN_DESIRED_CERTIFICATE_TYPE), HttpStatus.BAD_REQUEST);

        if(user.getType() == CertificateHolderType.CERTIFICATE_AUTHORITY && user instanceof CertificateAuthority certificateAuthority){
            if(!certificateAuthority.ownsCertificate(parentCertificate)) return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if(user.getType() == CertificateHolderType.ENTITY) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var certificateType = CertificateType.INTERMEDIATE_CERTIFICATE;
        var dateRange = DateRange.Create(new Date(), createIntermediateCertificateRequest.getExp());
        if(dateRange == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        KeyPair keys = keyPairGenerator.generateKeyPair();

        var intermediateCertificate = IntermediateCertificate.builder()
                .parentCertificate(parentCertificate)
                .issuedCertificates(new ArrayList<>())
                .privateKey(keys.getPrivate())
                .type(certificateType)
                .issuer(issuer)
                .subject(subject)
                .dateRange(dateRange)
                .revoked(false)
                .publicKey(keys.getPublic())
                .certificateExtensions(mapper.map(createIntermediateCertificateRequest.getCertificateExtensions(), new TypeToken<List<CertificateExtension>>() {}.getType()))
                .build();

        intermediateCertificate = certificateService.createIntermediateCertificate(intermediateCertificate);

        var response = CreateIntermediateCertificateResponse.builder()
                .serialNumber(intermediateCertificate.getSerialNumber().toString())
                .type(intermediateCertificate.getType().toString())
                .issuer(X500NameMapper.fromX500Name(intermediateCertificate.getIssuer().getX500Name(), intermediateCertificate.getIssuer().getType()))
                .subject(X500NameMapper.fromX500Name(intermediateCertificate.getSubject().getX500Name(), intermediateCertificate.getSubject().getType()))
                .iat(intermediateCertificate.getDateRange().getStartDate())
                .exp(intermediateCertificate.getDateRange().getEndDate())
                .parentCertificateSerialNumber(intermediateCertificate.getParentCertificate().getSerialNumber().toString())
                .revoked(intermediateCertificate.isRevoked())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @AdminOrCertificateAuthorityRole
    @PostMapping("/actions/create-entity-certificate")
    public ResponseEntity<Object> createEntityCertificate(@RequestBody CreateEntityCertificateRequest createEntityCertificateRequest, Authentication authentication) {
        var user = certificateHolderService.findByEmail(authentication.getName());

        if(user == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var parentCertificate = certificateService.findBySerialNumber(new BigInteger(createEntityCertificateRequest.getParentCertificateSerialNumber()));

        if(parentCertificate == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        if(parentCertificate.getType() == CertificateType.ENTITY_CERTIFICATE) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(parentCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE) {
            if(!((IntermediateCertificate) parentCertificate).canIssueUntilExp(createEntityCertificateRequest.getExp())) return new ResponseEntity<>(HttpStatus.CONFLICT);
            if(!certificateService.isValid((IntermediateCertificate) parentCertificate)) return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        if(parentCertificate.getType() == CertificateType.ROOT_CERTIFICATE) {
            if(!((RootCertificate) parentCertificate).canIssueUntilExp(createEntityCertificateRequest.getExp())) return new ResponseEntity<>(HttpStatus.CONFLICT);
            if(!certificateService.isValid((RootCertificate) parentCertificate)) return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        var issuer = parentCertificate.getSubject();
        var subject = certificateHolderService.findById(createEntityCertificateRequest.getSubjectId());

        if(user.getType() == CertificateHolderType.CERTIFICATE_AUTHORITY && user instanceof CertificateAuthority certificateAuthority){
            if(!certificateAuthority.ownsCertificate(parentCertificate)) return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if(user.getType() == CertificateHolderType.ENTITY) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        var certificateType = CertificateType.ENTITY_CERTIFICATE;
        var dateRange = DateRange.Create(new Date(), createEntityCertificateRequest.getExp());
        if(dateRange == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        KeyPair keys = keyPairGenerator.generateKeyPair();

        var entityCertificate = EntityCertificate.builder()
                .parentCertificate(parentCertificate)
                .privateKey(keys.getPrivate())
                .type(certificateType)
                .issuer(issuer)
                .subject(subject)
                .dateRange(dateRange)
                .revoked(false)
                .publicKey(keys.getPublic())
                .certificateExtensions(mapper.map(createEntityCertificateRequest.getCertificateExtensions(), new TypeToken<List<CertificateExtension>>() {}.getType()))
                .build();

        entityCertificate = certificateService.createEntityCertificate(entityCertificate);

        var response = CreateEntityCertificateResponse.builder()
                .serialNumber(entityCertificate.getSerialNumber().toString())
                .type(entityCertificate.getType().toString())
                .issuer(X500NameMapper.fromX500Name(entityCertificate.getIssuer().getX500Name(), entityCertificate.getIssuer().getType()))
                .subject(X500NameMapper.fromX500Name(entityCertificate.getSubject().getX500Name(), entityCertificate.getSubject().getType()))
                .iat(entityCertificate.getDateRange().getStartDate())
                .exp(entityCertificate.getDateRange().getEndDate())
                .parentCertificateSerialNumber(entityCertificate.getParentCertificate().getSerialNumber().toString())
                .revoked(entityCertificate.isRevoked())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("{certificateId}/actions/revoke")
    public ResponseEntity<Object> revokeCertificate(@PathVariable String certificateId) {
        // TODO: Na zahtev admina proglasiti sertifikat nevazecim
        //  ili na zahtev CA ukoliko je potpisan od strane njegovog sertifikata
        //  napomena: Ukoliko je sertifikat korenski ili sredisnji bitno je proglasiti nevalidnim
        //  sve sertifikate potpisane ovim sertifikatom!

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("{certificateId}/actions/download")
    public ResponseEntity<Object> downloadCertificate(@PathVariable String certificateId) {
        // TODO: Vratiti sertifikat sa trazenim Id-em kao .pem datoteku na zahtev vlasnika ili izdavaoca

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
}
