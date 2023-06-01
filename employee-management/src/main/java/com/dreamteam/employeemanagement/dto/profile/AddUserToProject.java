package com.dreamteam.employeemanagement.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddUserToProject {
    private String userId;
    private String description;
    private LocalDateTime from;
    private LocalDateTime to;
}
