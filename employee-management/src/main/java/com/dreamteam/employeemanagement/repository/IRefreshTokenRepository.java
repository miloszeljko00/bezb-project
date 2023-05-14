package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.BlacklistedAccessToken;
import com.dreamteam.employeemanagement.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface IRefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
}
