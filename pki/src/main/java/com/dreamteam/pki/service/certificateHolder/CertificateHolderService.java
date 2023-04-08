package com.dreamteam.pki.service.certificateHolder;

import com.dreamteam.pki.model.CertificateHolder;
import com.dreamteam.pki.repository.ICertificateHolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificateHolderService {

    @Autowired
    ICertificateHolderRepository certificateHolderRepository;

    public CertificateHolder  saveCertificateHolder(CertificateHolder holder){
        return certificateHolderRepository.save(holder);
    }
    public List<CertificateHolder> getAllCertificateHolders(){
        return certificateHolderRepository.findAll();
    }
    public void deleteCertificateHolder(CertificateHolder certificateHolder) {
        certificateHolderRepository.delete(certificateHolder);
    }
}
