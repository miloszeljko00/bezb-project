package com.dreamteam.pki.service.certificate;

import com.dreamteam.pki.model.Certificate;
import com.dreamteam.pki.repository.ICertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CertificateService {
    @Autowired
    ICertificateRepository certificateRepository;

    public void deleteCertificate(Certificate certificate) {
        certificateRepository.delete(certificate);
    }
    public Certificate createCertificate(Certificate certificate){
        return certificateRepository.save(certificate);
    }
}
