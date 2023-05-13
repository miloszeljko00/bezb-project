package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBlacklistedTokenRepository extends JpaRepository<BlacklistedToken, String> {
}
