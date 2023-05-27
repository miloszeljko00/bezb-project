package com.dreamteam.employeemanagement.dto.profile;

import com.dreamteam.employeemanagement.model.UserProject;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

public class UserProjectDto {
    private UUID id;
    private String name;
    private String managerName;
    private LocalDateTime start;
    private LocalDateTime endDate;
    private String workDescription;

    public UserProjectDto(UserProject userProject){
        this.id = userProject.getId();
        this.name = userProject.getProject().getName();
     //   this.managerName = userProject.getProject().getManager().getName() + " " + userProject.getProject().getManager().getLastName();
        this.start = userProject.getStartDate();
        this.endDate = userProject.getEndDate();
        this.workDescription = userProject.getDescription();
    }
}
