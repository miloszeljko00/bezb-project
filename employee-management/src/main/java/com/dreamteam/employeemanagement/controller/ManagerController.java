package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.CreateProjectDto;
import com.dreamteam.employeemanagement.dto.profile.CreateUserProjectDto;
import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import com.dreamteam.employeemanagement.model.UserProject;
import com.dreamteam.employeemanagement.repository.IUserProjectRepository;
import com.dreamteam.employeemanagement.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {
    private final ManagerService managerService;
    private final IUserProjectRepository userProjectRepository;

    @GetMapping("/user/all")
    public List<Account> getUsers() {return managerService.getAllUsers();
    }
    @PreAuthorize("hasRole('GET-PROJECTS')")
    @GetMapping("{id}")
    public List<Project> getAllByManager(@PathVariable("id") String id) {
        return managerService.getByManager(id);
    }
    @PreAuthorize("hasRole('GET-USER-PROJECTS')")
    @GetMapping("/user-project/{id}")
    public List<UserProject> getUsersByProject(@PathVariable("id") String projectId) {
        return managerService.getUsersByProject(projectId);
    }
    @PreAuthorize("hasRole('ADD-EMPLOYEE-TO-PROJECT')")
    @PostMapping("/create-user-project")
    public UserProject addUserToProject(@RequestBody CreateUserProjectDto user) {return managerService.addUserToProject(user);
    }
    @PreAuthorize("hasRole('CREATE-PROJECT')")
    @PostMapping("/create-project")
    public Project createProject(@RequestBody CreateProjectDto dto) {return managerService.createProject(dto);
    }
    @PreAuthorize("hasRole('REMOVE-EMPLOYEE-FROM-PROJECT')")
    @DeleteMapping("/user-project/{id}")
    public void delete(@PathVariable("id") String id) {  managerService.deleteUserFromProject(id); }

    @PreAuthorize("hasRole('GET-USER-PROJECTS')")
    @GetMapping("/user-manager/{id}")
    public List<UserProject> getUsersByManager(@PathVariable("id") String managerId) {
        List<Project> projectsByManager = getAllByManager(managerId);
        return managerService.getUsersByManager(projectsByManager);
    }

    @PreAuthorize("hasRole('UPDATE-USER-PROJECT')")
    @PutMapping("/update/{userProjectId}/{startDate}/{endDate}")
    public ResponseEntity<UserProject> updateUserProject(@PathVariable String userProjectId, @PathVariable LocalDateTime startDate, @PathVariable LocalDateTime endDate) {
        userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setStartDate(startDate);return up;}).get()));
        return new ResponseEntity<>(userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setEndDate(endDate);
          return up;}).get())), HttpStatus.OK);
    }
}
