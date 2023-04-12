package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.CertificateExtension;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ICertificateExtensionRepository extends JpaRepository<CertificateExtension, UUID> {
}
