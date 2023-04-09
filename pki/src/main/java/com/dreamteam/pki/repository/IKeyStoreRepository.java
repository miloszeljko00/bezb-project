package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.KeyStore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IKeyStoreRepository extends JpaRepository<KeyStore, String> {

}
