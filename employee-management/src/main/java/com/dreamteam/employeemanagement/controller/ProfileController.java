package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.RegisterUserInfoDto;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.ICVRepository;
import com.dreamteam.employeemanagement.repository.IRegisterUserInfoRepository;
import com.dreamteam.employeemanagement.repository.IUserProjectRepository;
import com.dreamteam.employeemanagement.repository.IUserSkillsRepository;
import com.dreamteam.employeemanagement.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/create-userProject")
    public UserProject addUserToProject(@RequestBody UserProject user) {
        return profileService.addUserToProject(user);
    }


    @PutMapping("/update-userProject/{userProjectId}/{newDescription}")
    public ResponseEntity<UserProject> updateUserProject(@PathVariable String userProjectId, @PathVariable String newDescription) {
        return new ResponseEntity<>(userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setDescription(newDescription); return up;}).get())), HttpStatus.OK);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<RegisterUserInfo> updateProfile(@RequestBody RegisterUserInfoDto registerUserInfoDto) {
        var registerUserInfo = registerUserInfoRepository.findById(UUID.fromString(registerUserInfoDto.getId()));
        registerUserInfo.get().setAddress(registerUserInfoDto.getAddress());
        registerUserInfo.get().setPhoneNumber(registerUserInfoDto.getPhoneNumber());
        registerUserInfo.get().setFirstName(registerUserInfoDto.getFirstName());
        registerUserInfo.get().setLastName(registerUserInfoDto.getLastName());
        return new ResponseEntity<>(registerUserInfoRepository.save(registerUserInfo.get()), HttpStatus.OK);
    }

    @PutMapping("/update-skill/{userProjectId}/{changedProperty}/{flag}")
    public ResponseEntity<UserSkills> updateSkill(@PathVariable String userProjectId, @PathVariable String changedProperty, @PathVariable String flag) {
        if(flag.equals("jedan")){
            return new ResponseEntity<>(userSkillsRepository.save((userSkillsRepository.findById(UUID.fromString(userProjectId)).map(us-> {us.setName(changedProperty); return us;}).get())), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(userSkillsRepository.save((userSkillsRepository.findById(UUID.fromString(userProjectId)).map(us-> {us.setRating(Double.valueOf(changedProperty)); return us;}).get())), HttpStatus.OK);
        }
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
