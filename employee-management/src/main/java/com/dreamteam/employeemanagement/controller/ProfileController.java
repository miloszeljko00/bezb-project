package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/project/all")
    public List<Project> getAllProject() {
        return profileService.getAllProjects();
    }

   /* @GetMapping("/project/{id}")
    public List<Project> getAllByManager(@PathVariable("id") String userId) {
        return profileService.getAllByManager(userId);
    }*/
    @GetMapping("/user-project/{id}")
    public List<UserProject> getUsersByProject(@PathVariable("id") String projectId) {
        return profileService.getUsersByProject(projectId);
    }
    @GetMapping("/project-user/{id}")
    public List<UserProject> getProjectsByUser(@PathVariable("id") String userId) {
        return profileService.getProjectsByUser(userId);
    }
  /*  @GetMapping("/employees-manager/{id}")
    public List<UserProject> getEmployeesByManager(@PathVariable("id") String userId) {
        List<Project> projectsByManager =  getAllByManager(userId);
        return profileService.getEmployeesByManager(projectsByManager);
    }*/

    @PutMapping("/user-project")
    public UserProject delete(@RequestBody UserProject user) { return profileService.deleteUserFromProject(user); }

    @PutMapping("/skill")
    public UserSkills deleteSkill(@RequestBody UserSkills user) { return profileService.deleteUserSkill(user); }

    @PostMapping("/create-project")
    public Project createProject(@RequestBody Project project) {
        return profileService.createProject(project);
    }
    @PostMapping("/create-userSkill")
    public UserSkills createUserSkill(@RequestBody UserSkills skill) {
        return profileService.createUserSkill(skill);
    }
    @PostMapping("/create-userProject")
    public UserProject addUserToProject(@RequestBody UserProject user) {
        return profileService.addUserToProject(user);
    }


    @PutMapping("/update-userProject")
    public void updateUserProject(@RequestBody UserProject userProject) {
        profileService.updateUserProject(userProject);
    }
    @PutMapping("/update-profile")
    public void updateProfile(@RequestBody UpdateProfileDto user) {
        profileService.updateProfile(user);
    }
    @PutMapping("/update-skill")
    public void updateSkill(@RequestBody UserSkills skill) {
        profileService.updateSkill(skill);
    }

}
