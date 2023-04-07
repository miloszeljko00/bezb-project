package com.dreamteam.pki.controller;

import com.dreamteam.pki.dto.certificate.request.IssueEntityCertificateRequest;
import com.dreamteam.pki.dto.certificate.request.IssueIntermediateCertificateRequest;
import com.dreamteam.pki.dto.certificate.request.IssueRootCertificateRequest;
import com.dreamteam.pki.dto.certificate.response.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @PostMapping("/actions/issue-root-certificate")
    public ResponseEntity<IssueRootCertificateResponse> issueRootCertificate(@RequestBody IssueRootCertificateRequest issueRootCertificateRequest) {
        // TODO: Na zahtev admina kreirati novi korenski sertifikat

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @PostMapping("/actions/issue-intermediate-certificate")
    public ResponseEntity<IssueIntermediateCertificateResponse> issueIntermediateCertificate(@RequestBody IssueIntermediateCertificateRequest issueIntermediateCertificateRequest) {
        // TODO: Na zahtev admina ili CA kreirati novi intermediate sertifikat

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @PostMapping("/actions/issue-entity-certificate")
    public ResponseEntity<IssueEntityCertificateResponse> issueEntityCertificate(@RequestBody IssueEntityCertificateRequest issueEntityCertificateRequest) {
        // TODO: Na zahtev admina ili CA kreirati novi entity sertifikat

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @PutMapping("{certificateId}/actions/revoke")
    public ResponseEntity<RevokeCertificateResponse> revokeCertificate(@PathVariable String certificateId) {
        // TODO: Na zahtev admina proglasiti sertifikat nevazecim
        //  ili na zahtev CA ukoliko je potpisan od strane njegovog sertifikata
        //  napomena: Ukoliko je sertifikat korenski ili sredisnji bitno je proglasiti nevalidnim
        //  sve sertifikate potpisane ovim sertifikatom!

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping
    public ResponseEntity<GetAllCertificateResponse> getAllCertificate() {
        // TODO: Vratiti listu svih sertifikata koji pripadaju ulogovanom korisniku,
        //  odnosno sve sertifikate ukoliko admin pristupa endpoint-u

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<GetCertificateResponse> getCertificate(@PathVariable String certificateId) {
        // TODO: Vratiti sertifikat ukoliko sertifikat sa trazenim Id-em postoji
        //  i pripada ulogovanom korisniku koji ga je zatrazio

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("{certificateId}/actions/download")
    public ResponseEntity<DownloadCertificateResponse> downloadCertificate(@PathVariable String certificateId) {
        // TODO: Vratiti sertifikat sa trazenim Id-em kao .pem datoteku na zahtev vlasnika ili izdavaoca

        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
}
