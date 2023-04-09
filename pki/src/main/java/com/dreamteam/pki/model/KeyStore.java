package com.dreamteam.pki.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="key_stores")
public class KeyStore {
    @Id
    @Column(name = "subject_id")
    private String SubjectId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "password")
    private String password;
}
