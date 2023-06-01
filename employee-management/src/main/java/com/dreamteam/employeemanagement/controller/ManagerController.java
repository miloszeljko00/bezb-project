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
    @GetMapping("{id}")
    public List<Project> getAllByManager(@PathVariable("id") String id) {
        return managerService.getByManager(id);
    }

    @GetMapping("/user-project/{id}")
    public List<UserProject> getUsersByProject(@PathVariable("id") String projectId) {
        return managerService.getUsersByProject(projectId);
    }
    @PostMapping("/create-user-project")
    public UserProject addUserToProject(@RequestBody CreateUserProjectDto user) {return managerService.addUserToProject(user);
    }
    @PostMapping("/create-project")
    public Project createProject(@RequestBody CreateProjectDto dto) {return managerService.createProject(dto);
    }
    @DeleteMapping("/user-project/{id}")
    public void delete(@PathVariable("id") String id) {  managerService.deleteUserFromProject(id); }

    @GetMapping("/user-manager/{id}")
    public List<UserProject> getUsersByManager(@PathVariable("id") String managerId) {
        List<Project> projectsByManager = getAllByManager(managerId);
        return managerService.getUsersByManager(projectsByManager);
    }

    @PutMapping("/update/{userProjectId}/{startDate}/{endDate}")
    public ResponseEntity<UserProject> updateUserProject(@PathVariable String userProjectId, @PathVariable LocalDateTime startDate, @PathVariable LocalDateTime endDate) {
        userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setStartDate(startDate);return up;}).get()));
        return new ResponseEntity<>(userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setEndDate(endDate);
          return up;}).get())), HttpStatus.OK);
    }
}
