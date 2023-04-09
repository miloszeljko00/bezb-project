package com.dreamteam.pki.service.certificateHolder;

import com.dreamteam.pki.model.Certificate;
import com.dreamteam.pki.model.CertificateHolder;
import com.dreamteam.pki.repository.IAccountRepository;
import com.dreamteam.pki.repository.ICertificateHolderRepository;
import com.dreamteam.pki.service.certificate.CertificateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
public class CertificateHolderService {

    @Autowired
    ICertificateHolderRepository certificateHolderRepository;
    @Autowired
    CertificateService certificateService;

    @Autowired
    IAccountRepository accountRepository;

    public CertificateHolder  createCertificateHolder(CertificateHolder holder) throws Exception {
        try{
            accountRepository.findByEmail(holder.getAccount().getEmail()).get();
        } catch (NoSuchElementException nsee) {
            return certificateHolderRepository.save(holder);
        }
        throw new Exception("Email vec postoji");
    }
    public List<CertificateHolder> getAllCertificateHolders(){
        return certificateHolderRepository.findAll();
    }
    public void deleteCertificateHolderEntity(String id) {
        certificateHolderRepository.deleteById(id);
    }
    public void deleteCertificateHolderCA(String id) {
        var certificateHolder = certificateHolderRepository.findById(id);
        try {
            for(Certificate certificate : certificateHolder.get().getCertificates()){
                certificate.setRevoked(true);
                certificateService.createCertificate(certificate);
            }
            certificateHolderRepository.deleteById(id);
        }catch (Exception e) {
            log.error(String.valueOf(e));
        }
    }
}
