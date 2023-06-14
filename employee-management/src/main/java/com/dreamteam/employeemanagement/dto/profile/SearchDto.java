package com.dreamteam.employeemanagement.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchDto {
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime from;
    private LocalDateTime to;
}
