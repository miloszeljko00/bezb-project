package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="key_stores")
public class KeyStore {
    @Id
    @Column(name = "subject_id")
    private UUID SubjectId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "password")
    private String password;
}
