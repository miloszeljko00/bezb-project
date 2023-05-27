package com.dreamteam.employeemanagement.dto.profile;

import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;
import java.util.UUID;

public class CreateUserProject {
    private int engineerId;
    private int projectId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
}
