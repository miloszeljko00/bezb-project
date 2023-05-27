package com.dreamteam.employeemanagement.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "skills")
public class UserSkills {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private Double rating;
    @ManyToOne
    @JoinColumn(name = "userId")
    private Account user;

    public String getId() {
        return id.toString();
    }
}
