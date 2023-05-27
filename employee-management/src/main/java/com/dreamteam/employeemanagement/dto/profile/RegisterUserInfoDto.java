package com.dreamteam.employeemanagement.dto.profile;

import com.dreamteam.employeemanagement.model.Address;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class RegisterUserInfoDto {
    @NotNull
    private String id;

    @NotNull
    private String firstName;
    @NotNull
    private String lastName;

    @NotNull
    private Address address;

    @NotNull
    private String phoneNumber;
}
