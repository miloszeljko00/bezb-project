package com.dreamteam.employeemanagement.dto.profile;
import lombok.*;

@Getter@Setter@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateProjectDto {
    private String name;
    private Double duration;
    private String managerId;
}
