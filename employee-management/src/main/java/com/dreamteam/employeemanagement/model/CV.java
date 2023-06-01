package com.dreamteam.employeemanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cv")

public class CV {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "file_name")
    private String fileName;
    @Column(name = "file_name_on_file_system")
    private String fileNameOnFileSystem;
    @Column(name = "data")
    private byte[] data;
}
