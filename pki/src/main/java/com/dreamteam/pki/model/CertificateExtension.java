package com.dreamteam.pki.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "certificate_extensions")
public class CertificateExtension {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "extension_name")
    private String extensionName;

    @Column(name = "extension_value")
    private String extensionValue;

    @Column(name = "is_critical")
    private boolean critical;

    @ManyToOne
    private Certificate certificate;
}
