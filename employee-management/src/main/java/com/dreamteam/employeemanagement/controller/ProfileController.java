package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.AddUserToProject;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.*;
import com.dreamteam.employeemanagement.service.ProfileService;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final ICVRepository cvRepository;
    private final IUserSkillsRepository userSkillsRepository;
    private final IUserProjectRepository userProjectRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;
    private final IProjectRepository projectRepository;
    private final IAccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    @GetMapping("/project/all")
    public List<Project> getAllProject() {
        return profileService.getAllProjects();
    }

    @GetMapping("/users/all")
    public List<RegisterUserInfo> getAllUsers() {
        return registerUserInfoRepository.findAll();
    }
    @GetMapping("/users/pm")
    public List<RegisterUserInfo> getAllProjectManagers() {

        var users = registerUserInfoRepository.findAll();

        ArrayList<RegisterUserInfo> response = new ArrayList<>();
        for (var user : users){
            if(user.getAccount().getRoles().stream().findFirst().get().getName().equals("Project Manager")){
                response.add(user);
            }
        }
        return response;
    }

    /* @GetMapping("/project/{id}")
     public List<Project> getAllByManager(@PathVariable("id") String userId) {
         return profileService.getAllByManager(userId);
     }*/
    @GetMapping("/user-project/{id}")
    public List<UserProject> getUsersByProject(@PathVariable("id") String projectId) {
        var userProjects = profileService.getUsersByProject(projectId);
        return userProjects;
    }
    @DeleteMapping("/user-project/{projectId}/delete/{userId}")
    public ResponseEntity<Object> deleteUserFromProject(@PathVariable("projectId") String projectId, @PathVariable("userId") String userId) {
        var userProjects = profileService.getUsersByProject(projectId);

        for(var user: userProjects){
            if(user.getId().equals(UUID.fromString(userId))){
                userProjectRepository.delete(user);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/user-skills/{id}")
    public ResponseEntity<List<UserSkills>> getUserSkills(@PathVariable("id") String id) {
        return new ResponseEntity<>(this.userSkillsRepository.findByUserId(UUID.fromString(id)), HttpStatus.OK);
    }
    @GetMapping("/project-user/{id}")
    public ResponseEntity<List<UserProject>> getProjectsByUser(@PathVariable("id") String accountId) {
        return new ResponseEntity<>(profileService.getProjectsByUser(UUID.fromString(accountId)), HttpStatus.OK);
    }
    @PutMapping("/user-project")
    public UserProject delete(@RequestBody UserProject user) {
        return profileService.deleteUserFromProject(user);
    }

    @PutMapping("/skill")
    public UserSkills deleteSkill(@RequestBody UserSkills user) {
        return profileService.deleteUserSkill(user);
    }

    @PostMapping("/create-project")
    public Project createProject(@RequestBody Project project) {
        return profileService.createProject(project);
    }

    @PostMapping("/create-userSkill")
    public UserSkills createUserSkill(@RequestBody UserSkills skill) {
        return profileService.createUserSkill(skill);
    }
    @PostMapping("/user-project/{projectId}/add")
    public UserProject addUserToProject(@PathVariable UUID projectId, @RequestBody AddUserToProject user) {
        var project = projectRepository.findById(projectId).orElseThrow();
        var account = accountRepository.findById(UUID.fromString(user.getUserId())).orElseThrow();
        var up = new UserProject();
        up.setProject(project);
        up.setUser(account);
        up.setStartDate(user.getFrom());
        up.setEndDate(user.getTo());
        up.setDescription(user.getDescription());

        return userProjectRepository.save(up);
    }

    @PostMapping("/create-userProject")
    public UserProject addUserToProject(@RequestBody UserProject user) {
        return profileService.addUserToProject(user);
    }


    @PutMapping("/update-userProject/{userProjectId}/{newDescription}")
    public ResponseEntity<UserProject> updateUserProject(@PathVariable String userProjectId, @PathVariable String newDescription) {
        return new ResponseEntity<>(userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setDescription(newDescription); return up;}).get())), HttpStatus.OK);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<RegisterUserInfo> updateProfile(@RequestBody RegisterUserInfo registerUserInfo) {
        var userProfile = registerUserInfoRepository.findById(registerUserInfo.getId()).orElseThrow();
        var pass = registerUserInfo.getAccount().getPassword();
        var encodedPass = passwordEncoder.encode(pass);
        if(!userProfile.getAccount().getPassword().equals(encodedPass)) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        userProfile.setAddress(registerUserInfo.getAddress());
        userProfile.setFirstName(registerUserInfo.getFirstName());
        userProfile.setLastName(registerUserInfo.getLastName());
        userProfile.setPhoneNumber(registerUserInfo.getPhoneNumber());
        userProfile.setRevisionDate(new Date());
        return new ResponseEntity<>(registerUserInfoRepository.save(userProfile), HttpStatus.OK);
    }

    @PutMapping("/update-skill")
    public ResponseEntity<UserSkills> updateSkill(@RequestBody UserSkills skill) {
        return new ResponseEntity<>(userSkillsRepository.save(skill), HttpStatus.OK);
    }

    @PostMapping(value = "/upload-cv/{userEmail}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadCV(@PathVariable("userEmail") String userEmail, @RequestParam("file") MultipartFile file) {
        // Check if the file is not empty
        if (!file.isEmpty()) {
            try {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());

                CV cv = new CV();
                cv.setFileName(fileName);
                cv.setUserEmail(userEmail);
                cv.setData(file.getBytes());
                cvRepository.save(cv);

                return new ResponseEntity<>("CV saved successfully!", HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("Something went wrong while uploading CV...", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>("Empty file uploaded...", HttpStatus.BAD_REQUEST);
    }
}
