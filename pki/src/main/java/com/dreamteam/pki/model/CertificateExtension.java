package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateExtensionType;
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

    @Enumerated(value = EnumType.STRING)
    @Column(name = "extension_name")
    private CertificateExtensionType extensionType;

    @Column(name = "extension_value")
    private String extensionValue;

    @Column(name = "is_critical")
    private boolean critical;

}
