package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ICVRepository extends JpaRepository<CV, UUID> {
}
