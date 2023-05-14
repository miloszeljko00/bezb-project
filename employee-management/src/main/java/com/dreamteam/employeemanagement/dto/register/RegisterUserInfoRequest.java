package com.dreamteam.employeemanagement.dto.register;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class RegisterUserInfoRequest {
    @NotNull
    @Email
    private String email;

    @NotNull
    @Size(min = 8)
    private String password;

    @NotNull
    private String confirmPassword;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private String street;

    @NotNull
    private String city;

    @NotNull
    private String country;

    @NotNull
    private String phone;

    @NotNull
    private String designation;
}
