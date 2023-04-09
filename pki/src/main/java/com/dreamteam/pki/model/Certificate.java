package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateType;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigInteger;
import java.security.PrivateKey;
import java.security.PublicKey;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@SuperBuilder
@Table(name = "certificates")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
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

    @Column(name = "public_key")
    private PublicKey publicKey;

    @Column(name = "private_key")
    private PrivateKey privateKey;
}
