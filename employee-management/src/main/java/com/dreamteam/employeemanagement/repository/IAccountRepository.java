package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);
}
