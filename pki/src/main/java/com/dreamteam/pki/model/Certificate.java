package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateType;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Data;

import java.math.BigInteger;

@Data
@Entity
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "certificate_seq")
    @SequenceGenerator(name = "certificate_seq", sequenceName = "certificate_seq", allocationSize = 1)
    @Column(name = "serialNumber", nullable = false)
    private BigInteger serialNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_type")
    private CertificateType type;

    @ManyToOne
    private CertificateHolder issuer;

    @ManyToOne
    private CertificateHolder subject;

    @Embedded
    private DateRange dateRange;

    @Column(name = "revoked")
    private boolean revoked;
}
