package com.dreamteam.pki.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @OneToOne
    private Account account;
}
