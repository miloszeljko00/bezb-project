package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.CreateProject;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.*;
import com.dreamteam.employeemanagement.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProfileService profileService;
    private final ICVRepository cvRepository;
    private final IUserSkillsRepository userSkillsRepository;
    private final IUserProjectRepository userProjectRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;
    private final IProjectRepository projectRepository;

    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;


    @PostMapping("/create")
    public Project createProject(@RequestBody CreateProject project) {
        var manager = registerUserInfoRepository.findById(UUID.fromString(project.getManagerId())).orElseThrow();
        var p = new Project(UUID.randomUUID(), project.getName(), project.getDuration(), manager.getAccount());

        return projectRepository.save(p);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> createProject(@PathVariable UUID id) {
       projectRepository.deleteById(id);
       return new ResponseEntity<>(HttpStatus.OK);
    }


}
