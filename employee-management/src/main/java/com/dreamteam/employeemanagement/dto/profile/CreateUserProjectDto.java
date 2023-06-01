package com.dreamteam.employeemanagement.dto.profile;

import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateUserProjectDto {
    private String engineerId;
    private String projectId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
}
