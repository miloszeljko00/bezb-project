package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.CreateProjectDto;
import com.dreamteam.employeemanagement.dto.profile.CreateUserProjectDto;
import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import com.dreamteam.employeemanagement.model.UserProject;
import com.dreamteam.employeemanagement.repository.IUserProjectRepository;
import com.dreamteam.employeemanagement.service.ManagerService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Slf4j
public class ManagerController {
    private final ManagerService managerService;
    private final IUserProjectRepository userProjectRepository;

    @GetMapping("/user/all")
    public List<Account> getUsers() {return managerService.getAllUsers();
    }
    @PreAuthorize("hasRole('GET-PROJECTS')")
    @GetMapping("{id}")
    public List<Project> getAllByManager(@PathVariable("id") String id, HttpServletRequest request, Authentication authentication) {
        log.info("Get all projects initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = managerService.getByManager(id);
            log.info("Get all projects for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("Get all projects for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('GET-USER-PROJECTS')")
    @GetMapping("/user-project/{id}")
    public List<UserProject> getUsersByProject(@PathVariable("id") String projectId, HttpServletRequest request, Authentication authentication) {
        log.info("Get users by project initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = managerService.getUsersByProject(projectId);
            log.info("Get users by project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("Get users by project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('ADD-EMPLOYEE-TO-PROJECT')")
    @PostMapping("/create-user-project")
    public UserProject addUserToProject(@RequestBody CreateUserProjectDto user, HttpServletRequest request, Authentication authentication) {
        log.info("Add user to project initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = managerService.addUserToProject(user);
            log.info("Add user to project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("Add user to project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('CREATE-PROJECT')")
    @PostMapping("/create-project")
    public Project createProject(@RequestBody CreateProjectDto dto, HttpServletRequest request, Authentication authentication) {
        log.info("Create Project initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = managerService.createProject(dto);
            log.info("Create Project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("Create Project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('REMOVE-EMPLOYEE-FROM-PROJECT')")
    @DeleteMapping("/user-project/{id}")
    public void delete(@PathVariable("id") String id, HttpServletRequest request, Authentication authentication) {
        log.info("Remove user from project initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            managerService.deleteUserFromProject(id);
            log.info("Remove user from project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
        }catch (Exception e){
            log.warn("Remove user from project for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('GET-USER-PROJECTS')")
    @GetMapping("/user-manager/{id}")
    public List<UserProject> getUsersByManager(@PathVariable("id") String managerId, HttpServletRequest request, Authentication authentication) {
        log.info("Get Users by manager initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            List<Project> projectsByManager = managerService.getByManager(managerId);
            var response = managerService.getUsersByManager(projectsByManager);
            log.info("Get Users by manager for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("Get Users by manager for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('UPDATE-USER-PROJECT')")
    @PutMapping("/update/{userProjectId}/{startDate}/{endDate}")
    public ResponseEntity<UserProject> updateUserProject(@PathVariable String userProjectId, @PathVariable LocalDateTime startDate, @PathVariable LocalDateTime endDate, HttpServletRequest request, Authentication authentication) {
        log.info("Update UserProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setStartDate(startDate);return up;}).get()));
            var response = userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setEndDate(endDate);
                return up;}).get()));
            log.info("Update UserProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("Update UserProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }



    }
}
