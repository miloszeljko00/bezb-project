package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICertificateRepository extends JpaRepository<Certificate, String> {
}
