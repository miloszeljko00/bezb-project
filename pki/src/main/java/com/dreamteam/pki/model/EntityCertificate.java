package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class EntityCertificate extends Certificate {
    @ManyToOne
    private Certificate parentCertificate;
}
