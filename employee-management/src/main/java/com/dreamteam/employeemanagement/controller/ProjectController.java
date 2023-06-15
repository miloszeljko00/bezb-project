package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.CreateProject;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.*;
import com.dreamteam.employeemanagement.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
@Slf4j
public class ProjectController {

    private final ProfileService profileService;
    private final ICVRepository cvRepository;
    private final IUserSkillsRepository userSkillsRepository;
    private final IUserProjectRepository userProjectRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;
    private final IProjectRepository projectRepository;

    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;


    @PreAuthorize("hasRole('CREATE-PROJECT')")
    @PostMapping("/create")
    public Project createProject(@RequestBody CreateProject project, HttpServletRequest request, Authentication authentication) {
        log.info("createProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var manager = registerUserInfoRepository.findById(UUID.fromString(project.getManagerId())).orElseThrow();
            var p = new Project(UUID.randomUUID(), project.getName(), project.getDuration(), manager.getAccount());
            var response = projectRepository.save(p);
            log.info("createProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("createProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('DELETE-PROJECT')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> createProject(@PathVariable UUID id, HttpServletRequest request, Authentication authentication) {
        log.info("deleteProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var project = projectRepository.findById(id).orElseThrow();
            var userProjects = userProjectRepository.findAllByProject(project);
            userProjectRepository.deleteAll(userProjects);
            projectRepository.delete(project);
            log.info("deleteProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            log.warn("deleteProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }


    }


}
