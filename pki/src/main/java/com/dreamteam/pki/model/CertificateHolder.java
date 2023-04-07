package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateHolderType;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Data;
import org.bouncycastle.asn1.x500.X500Name;

import java.util.List;

@Data
@Entity
@Table(name = "certificate_holders")
public class CertificateHolder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_holder_type")
    private CertificateHolderType type;

    @Column(name = "X500Name")
    private X500Name x500Name;

    @OneToMany(mappedBy = "subject")
    private List<Certificate> certificates;

    @OneToOne
    private Account account;
}
