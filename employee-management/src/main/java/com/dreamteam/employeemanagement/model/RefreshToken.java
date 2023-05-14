package com.dreamteam.employeemanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID token;
    @Column(name = "iat")
    private Date iat;
    @Column(name = "exp")
    private Date exp;
    @ManyToOne
    private Account account;
    @Column(name = "valid")
    private boolean valid;

    public boolean validate(){
        return isValid() && exp.after(new Date());
    }
}
