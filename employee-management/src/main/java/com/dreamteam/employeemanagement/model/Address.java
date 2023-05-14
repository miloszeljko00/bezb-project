package com.dreamteam.employeemanagement.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Embeddable
public class Address {
    @Column(name = "street")
    private String Street;
    @Column(name = "city")
    private String City;
    @Column(name = "country")
    private String Country;
}
