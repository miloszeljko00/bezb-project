package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface ICertificateRepository extends JpaRepository<Certificate, BigInteger> {
}
