package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class RootCertificate extends  Certificate{

    @OneToMany
    private List<Certificate> issuedCertificates;

    @Column(name = "public_key")
    private String publicKey;

    @Column(name = "private_key")
    private String privateKey;
}
