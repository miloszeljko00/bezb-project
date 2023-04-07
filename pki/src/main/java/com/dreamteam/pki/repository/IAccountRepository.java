package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);
}
