package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class IntermediateCertificate extends Certificate{
    @ManyToOne
    private Certificate parentCertificate;

    @OneToMany
    private List<Certificate> issuedCertificates;

    @Column(name = "private_key")
    private String privateKey;
}
