package com.dreamteam.employeemanagement.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "register_user_info")
public class RegisterUserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @OneToOne
    private Account account;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Embedded
    private Address address;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "revision_date")
    private Date revisionDate;
    @Embedded
    private RegistrationToken registrationToken;
}
