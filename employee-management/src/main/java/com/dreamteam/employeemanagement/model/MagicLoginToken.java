package com.dreamteam.employeemanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Embeddable
public class MagicLoginToken {
    @Column(name = "token")
    private UUID token;
    @Column(name = "expiration_date")
    private Date expirationDate;
    @Column(name = "is_used")
    private boolean isUsed;
}
