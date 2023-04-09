package com.dreamteam.pki.service.certificateHolder;

import com.dreamteam.pki.model.CertificateHolder;
import com.dreamteam.pki.repository.ICertificateHolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CertificateHolderService {

    @Autowired
    ICertificateHolderRepository certificateHolderRepository;

    public CertificateHolder saveCertificateHolder(CertificateHolder holder){
        return certificateHolderRepository.save(holder);
    }

    public CertificateHolder findByEmail(String email){
        return certificateHolderRepository.findByAccount_Email(email).orElse(null);
    }
    public CertificateHolder findById(String id){
        return certificateHolderRepository.findById(UUID.fromString(id)).orElse(null);
    }

}
