package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.BlacklistedAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBlacklistedTokenRepository extends JpaRepository<BlacklistedAccessToken, String> {
}
