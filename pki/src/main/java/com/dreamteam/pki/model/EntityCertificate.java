package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class EntityCertificate extends Certificate {
    @ManyToOne
    private Certificate parentCertificate;
}
