package com.dreamteam.pki.controller;

import com.dreamteam.pki.dto.certificate_holder.request.CreateCertificateAuthorityRequest;
import com.dreamteam.pki.dto.certificate_holder.request.CreateEntityRequest;
import com.dreamteam.pki.dto.certificate_holder.response.CreateCertificateAuthorityResponse;
import com.dreamteam.pki.dto.certificate_holder.response.CreateEntityResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificate-holders")
public class CertificateHolderController {

    @PostMapping("/actions/create-entity")
    public ResponseEntity<CreateEntityResponse> createEntity(@RequestBody CreateEntityRequest createEntityRequest) {
        // TODO: Implementirati kreiranje krajnjeg entiteta kome se izdaju sertifikati

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/actions/create-certificate-authority")
    public ResponseEntity<CreateCertificateAuthorityResponse> createCertificateAuthority(@RequestBody CreateCertificateAuthorityRequest createCertificateAuthorityRequest) {
        // TODO: Implementirati kreiranje sertifikacionog autoriteta kome se izdaju sertifikati
        //  pomocu kojih on moze dalje da izdaje sertifikate

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @DeleteMapping("{entityId}")
    public ResponseEntity<Void> deleteEntity(@PathVariable String entityId) {
        // TODO: Implementirati brisanje krajnjeg entiteta kome se izdaju sertifikati

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("{certificateAuthorityId}")
    public ResponseEntity<Void> deleteCertificateAuthority(@PathVariable String certificateAuthorityId) {
        // TODO: Implementirati brisanje sertifikacionog autoriteta kome se izdaju sertifikati
        //  pomocu kojih on moze dalje da izdaje sertifikate

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
