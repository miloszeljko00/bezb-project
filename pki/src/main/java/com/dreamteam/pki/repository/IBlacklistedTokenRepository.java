package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBlacklistedTokenRepository extends JpaRepository<BlacklistedToken, String> {
}
