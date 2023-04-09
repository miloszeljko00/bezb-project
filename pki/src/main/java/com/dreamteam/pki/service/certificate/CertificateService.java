package com.dreamteam.pki.service.certificate;

import com.dreamteam.pki.model.*;
import com.dreamteam.pki.model.enums.CertificateType;
import com.dreamteam.pki.repository.ICertificateHolderRepository;
import com.dreamteam.pki.repository.ICertificateRepository;
import com.dreamteam.pki.repository.IKeyStoreRepository;
import com.dreamteam.pki.service.certificate.keystore.interfaces.IKeyStoreReader;
import com.dreamteam.pki.service.certificate.keystore.interfaces.IKeyStoreWriter;
import com.dreamteam.pki.service.generators.CertificateGenerator;
import com.dreamteam.pki.service.generators.PasswordGenerator;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigInteger;


@Service
@Slf4j
@RequiredArgsConstructor
public class CertificateService {
    private final ICertificateRepository certificateRepository;
    private final ICertificateHolderRepository certificateHolderRepository;
    private final CertificateGenerator certificateGenerator;
    private final PasswordGenerator passwordGenerator;

    private final IKeyStoreReader keyStoreReader;
    private final IKeyStoreWriter keyStoreWriter;
    private final IKeyStoreRepository keyStoreRepository;

    public RootCertificate createRootCertificate(RootCertificate certificate){
        certificate = certificateRepository.save(certificate);
        var subject = certificate.getSubject();
        subject.addCertificate(certificate);
        certificateHolderRepository.save(subject);

        var x509Certificate = certificateGenerator.generate(
                certificate.getPrivateKey(),
                certificate.getPublicKey(),
                certificate.getSubject().getX500Name(),
                certificate.getIssuer().getX500Name(),
                certificate.getDateRange().getStartDate(),
                certificate.getDateRange().getEndDate(),
                certificate.getSerialNumber());

        var keyStore = keyStoreRepository.findById(certificate.getSubject().getId().toString()).orElse(null);

        if(keyStore == null){
            keyStore = new KeyStore(certificate.getSubject().getId().toString(), "src/main/resources/static/" + certificate.getSubject().getId().toString() + ".jks", passwordGenerator.generate(20));
            keyStoreRepository.save(keyStore);
            keyStoreWriter.loadKeyStore(null, keyStore.getPassword());
        }else{
            keyStoreWriter.loadKeyStore(keyStore.getFileName(), keyStore.getPassword());
        }

        keyStoreWriter.writeCertificate(certificate.getSerialNumber().toString(), certificate.getPrivateKey(), keyStore.getPassword(), x509Certificate);
        keyStoreWriter.saveKeyStore(keyStore.getFileName(), keyStore.getPassword());

        return certificate;
    }

    public IntermediateCertificate createIntermediateCertificate(IntermediateCertificate certificate) {
        certificate = certificateRepository.save(certificate);
        var subject = certificate.getSubject();
        subject.addCertificate(certificate);
        certificateHolderRepository.save(subject);

        var parentCertificate = certificate.getParentCertificate();

        if(parentCertificate.getType() == CertificateType.ROOT_CERTIFICATE && parentCertificate instanceof RootCertificate rootCertificate){
            rootCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(rootCertificate);
        }else if(parentCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE && parentCertificate instanceof IntermediateCertificate intermediateCertificate){
            intermediateCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(intermediateCertificate);
        }else{
            return null;
        }

        var x509Certificate = certificateGenerator.generate(
                certificate.getParentCertificate().getPrivateKey(),
                certificate.getPublicKey(),
                certificate.getSubject().getX500Name(),
                certificate.getIssuer().getX500Name(),
                certificate.getDateRange().getStartDate(),
                certificate.getDateRange().getEndDate(),
                certificate.getSerialNumber());

        var keyStore = keyStoreRepository.findById(certificate.getSubject().getId().toString()).orElse(null);

        if(keyStore == null){
            keyStore = new KeyStore(certificate.getSubject().getId().toString(), "src/main/resources/static/" + certificate.getSubject().getId().toString() + ".jks", passwordGenerator.generate(20));
            keyStoreRepository.save(keyStore);
            keyStoreWriter.loadKeyStore(null, keyStore.getPassword());
        }else{
            keyStoreWriter.loadKeyStore(keyStore.getFileName(), keyStore.getPassword());
        }

        keyStoreWriter.writeCertificate(certificate.getSerialNumber().toString(), certificate.getPrivateKey(), keyStore.getPassword(), x509Certificate);
        keyStoreWriter.saveKeyStore(keyStore.getFileName(), keyStore.getPassword());

        return certificate;
    }

    public EntityCertificate createEntityCertificate(EntityCertificate certificate) {
        certificate = certificateRepository.save(certificate);
        var subject = certificate.getSubject();
        subject.addCertificate(certificate);
        certificateHolderRepository.save(subject);

        var parentCertificate = certificate.getParentCertificate();

        if(parentCertificate.getType() == CertificateType.ROOT_CERTIFICATE && parentCertificate instanceof RootCertificate rootCertificate){
            rootCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(rootCertificate);
        }else if(parentCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE && parentCertificate instanceof IntermediateCertificate intermediateCertificate){
            intermediateCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(intermediateCertificate);
        }else{
            return null;
        }

        var x509Certificate = certificateGenerator.generate(
                certificate.getParentCertificate().getPrivateKey(),
                certificate.getPublicKey(),
                certificate.getSubject().getX500Name(),
                certificate.getIssuer().getX500Name(),
                certificate.getDateRange().getStartDate(),
                certificate.getDateRange().getEndDate(),
                certificate.getSerialNumber());

        var keyStore = keyStoreRepository.findById(certificate.getSubject().getId().toString()).orElse(null);

        if(keyStore == null){
            keyStore = new KeyStore(certificate.getSubject().getId().toString(), "src/main/resources/static/" + certificate.getSubject().getId().toString() + ".jks", passwordGenerator.generate(20));
            keyStoreRepository.save(keyStore);
            keyStoreWriter.loadKeyStore(null, keyStore.getPassword());
        }else{
            keyStoreWriter.loadKeyStore(keyStore.getFileName(), keyStore.getPassword());
        }

        keyStoreWriter.writeCertificate(certificate.getSerialNumber().toString(), certificate.getPrivateKey(), keyStore.getPassword(), x509Certificate);
        keyStoreWriter.saveKeyStore(keyStore.getFileName(), keyStore.getPassword());

        return certificate;
    }

    public Certificate findBySerialNumber(BigInteger serialNumber) {
        return certificateRepository.findById(serialNumber).orElse(null);
    }


    public boolean isValid(RootCertificate rootCertificate) {
        if(rootCertificate.isRevoked()) return false;

        return rootCertificate.getDateRange().isValid() && !rootCertificate.getDateRange().isExpired();
    }
    public boolean isValid(IntermediateCertificate intermediateCertificate) {
        if(intermediateCertificate.isRevoked()) return false;

        if(!intermediateCertificate.getDateRange().isValid() || intermediateCertificate.getDateRange().isExpired()) return false;

        if(intermediateCertificate.getParentCertificate().getType() == CertificateType.ROOT_CERTIFICATE && intermediateCertificate.getParentCertificate() instanceof RootCertificate rc){
            if(!isValid(rc)) return false;
        }
        if(intermediateCertificate.getParentCertificate().getType() == CertificateType.INTERMEDIATE_CERTIFICATE && intermediateCertificate.getParentCertificate() instanceof IntermediateCertificate ic){
            return isValid(ic);
        }
        return true;
    }
    public boolean isValid(EntityCertificate entityCertificate) {
        if(entityCertificate.isRevoked()) return false;

        if(!entityCertificate.getDateRange().isValid() || entityCertificate.getDateRange().isExpired()) return false;

        if(entityCertificate.getParentCertificate().getType() == CertificateType.ROOT_CERTIFICATE && entityCertificate.getParentCertificate() instanceof RootCertificate rc){
            if(!isValid(rc)) return false;
        }
        if(entityCertificate.getParentCertificate().getType() == CertificateType.INTERMEDIATE_CERTIFICATE && entityCertificate.getParentCertificate() instanceof IntermediateCertificate ic){
            return isValid(ic);
        }
        return true;
    }
}
