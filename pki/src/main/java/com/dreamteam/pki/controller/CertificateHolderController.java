package com.dreamteam.pki.controller;

import com.dreamteam.pki.dto.certificate_holder.request.CreateCertificateAuthorityRequest;
import com.dreamteam.pki.dto.certificate_holder.request.CreateEntityRequest;
import com.dreamteam.pki.dto.certificate_holder.response.CreateCertificateAuthorityResponse;
import com.dreamteam.pki.dto.certificate_holder.response.CreateEntityResponse;
import com.dreamteam.pki.dto.certificate_holder.response.GetCertificateHolder;
import com.dreamteam.pki.model.CertificateHolder;
import com.dreamteam.pki.service.certificateHolder.CertificateHolderService;
import com.dreamteam.pki.service.customMapper.CustomMapperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/certificate-holders")
public class CertificateHolderController {

    @Autowired
    CertificateHolderService certificateHolderService;
    @Autowired
    CustomMapperService customMapperService;

    @GetMapping("/actions/get-all-certificate-holders")
    public ResponseEntity<List<GetCertificateHolder>> getAllCertificateHolders() {
        //TODO: proveriti zasto se ovaj end point pogodi dva puta kada se inicijalizuje accounts page na frontu
        //TODO: FILTRIRATI SVE OBRISANE
        List<CertificateHolder> certificateHolders = certificateHolderService.getAllCertificateHolders();
        List<GetCertificateHolder> getCertificateHolders = new ArrayList<>();
        for (CertificateHolder certificateHolder : certificateHolders) {
            GetCertificateHolder getCertificateHolder = customMapperService.convertToGetCertificateHolder(certificateHolder);
            getCertificateHolders.add(getCertificateHolder);
        }
        return new ResponseEntity<>(getCertificateHolders, HttpStatus.OK);
    }

    @PostMapping("/actions/create-entity")
    public ResponseEntity<CreateEntityResponse> saveEntity(@RequestBody CreateEntityRequest createEntityRequest) {
        //TODO: IMPLEMENTIRATI PROVERU DA LI ACCOUNT SA DATIM EMAILOM VEC POSTOJI
        var certificateHolder = customMapperService.convertCreateEntityRequestToCertificateHolder(createEntityRequest);
        certificateHolder = certificateHolderService.saveCertificateHolder(certificateHolder);
        return new ResponseEntity<>(customMapperService.convertCertificateHolderToCreateEntityResponse(certificateHolder), HttpStatus.OK);
    }

    @PostMapping("/actions/create-certificate-authority")
    public ResponseEntity<CreateCertificateAuthorityResponse> saveCertificateAuthority(@RequestBody CreateCertificateAuthorityRequest createCertificateAuthorityRequest) {
        var certificateHolder = customMapperService.convertCreateCertificateAuthorityRequestToCertificateHolder(createCertificateAuthorityRequest);
        certificateHolder = certificateHolderService.saveCertificateHolder(certificateHolder);
        return new ResponseEntity<>(customMapperService.convertCertificateHolderToCreateCertificateAuthorityResponse(certificateHolder), HttpStatus.OK);
    }

    @DeleteMapping("{entityId}")
    public ResponseEntity<Void> deleteEntity(@PathVariable String entityId) {
        // TODO: Implementirati brisanje krajnjeg entiteta kome se izdaju sertifikati

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("{certificateAuthorityId}")
    public ResponseEntity<Void> deleteCertificateAuthority(@PathVariable String certificateAuthorityId) {
        // TODO: Implementirati brisanje sertifikacionog autoriteta kome se izdaju sertifikati
        //  pomocu kojih on moze dalje da izdaje sertifikate, proci kroz sve Certificate u listi i postaviti revoked na true

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
