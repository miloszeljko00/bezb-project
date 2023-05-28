package com.dreamteam.employeemanagement.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProject {
    private double duration;
    private String managerId;
    private String name;
}
