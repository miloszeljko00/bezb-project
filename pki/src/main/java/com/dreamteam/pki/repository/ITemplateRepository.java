package com.dreamteam.pki.repository;

import com.dreamteam.pki.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface ITemplateRepository extends JpaRepository<Template, UUID> {
}
