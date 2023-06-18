package com.dreamteam.employeemanagement.controller;
import com.dreamteam.employeemanagement.dto.profile.*;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.ICVRepository;
import com.dreamteam.employeemanagement.repository.IRegisterUserInfoRepository;
import com.dreamteam.employeemanagement.repository.IUserProjectRepository;
import com.dreamteam.employeemanagement.repository.IUserSkillsRepository;
import com.dreamteam.employeemanagement.security.gdpr.Test;
import com.dreamteam.employeemanagement.service.CVService;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.*;
import com.dreamteam.employeemanagement.service.ProfileService;
import jakarta.persistence.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.time.LocalDateTime;

import static com.dreamteam.employeemanagement.controller.RegisterController.decryptString;
import static com.dreamteam.employeemanagement.controller.RegisterController.takesFirstPartOfEmail;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {


    private final ProfileService profileService;
    private final IUserSkillsRepository userSkillsRepository;
    private final IUserProjectRepository userProjectRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;
    private final CVService cvService;

    private final ICVRepository cvRepository;
    private final IProjectRepository projectRepository;
    private final IAccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('GET-PROJECTS')")
    @GetMapping("/project/all")
    public List<Project> getAllProject(HttpServletRequest request, Authentication authentication) {

        log.info("getAllProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.getAllProjects();
            log.info("getAllProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getAllProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @GetMapping("/user/{id}")
    public Account getUser(@PathVariable("id")  String id, HttpServletRequest request, Authentication authentication) {
        log.info("getUser initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.getUser(id).orElseThrow();
            log.info("getUser for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getUser for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('GET-PROJECTS')")
    @GetMapping("/manager/{id}")
    public List<Project> getAllByManager(@PathVariable("id") String id, HttpServletRequest request, Authentication authentication) {
        log.info("getAllProjectsByManager initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.getByManager(id);
            log.info("getAllProjectsByManager for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getAllProjectsByManager for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('GET-USER-PROJECTS')")
    @GetMapping("/user-project/manager/{id}")
    public List<UserProject> getUsersByManager(@PathVariable("id") String managerId, HttpServletRequest request, Authentication authentication) {
        log.info("getAllUsersByManager initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            List<Project> projectsByManager = profileService.getByManager(managerId);
            var response = profileService.getUsersByManager(projectsByManager);
            log.info("getAllUsersByManager for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getAllUsersByManager for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }

    }


    @PreAuthorize("hasRole('GET-EMPLOYEES')")
    @GetMapping("/users/all")
    public List<RegisterUserInfo> getAllUsers(HttpServletRequest request, Authentication authentication) throws Exception {
        log.info("getAllUsers initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = registerUserInfoRepository.findAll();
            for(RegisterUserInfo rui: response){
                try{
                    String aliasPrefix = takesFirstPartOfEmail(rui.getAccount().getEmail());
                    rui.setFirstName(decryptString(rui.getFirstName(), aliasPrefix.concat("name")));
                    rui.setPhoneNumber(decryptString(rui.getPhoneNumber(), aliasPrefix.concat("phone")));
                    rui.getAddress().setCountry(decryptString(rui.getAddress().getCountry(), aliasPrefix.concat("country")));
                    rui.getAddress().setCity(decryptString(rui.getAddress().getCity(), aliasPrefix.concat("city")));
                    rui.getAddress().setStreet(decryptString(rui.getAddress().getStreet(), aliasPrefix.concat("street")));
                    rui.setLastName(decryptString(rui.getLastName(), aliasPrefix.concat("prezime")));
                }catch (Exception e){
                    log.warn("getAllUsers from ip address: " + request.getRemoteAddr() + " has failed.");
                    throw e;
                }
            }
            log.info("getAllUsers for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getAllUsers for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('GET-EMPLOYEES')")
    @GetMapping("/users/pm")
    public List<RegisterUserInfo> getAllProjectManagers(HttpServletRequest request, Authentication authentication) {
        log.info("getAllProjectManagers initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var users = registerUserInfoRepository.findAll();

            ArrayList<RegisterUserInfo> response = new ArrayList<>();
            for (var user : users){
                if(user.getAccount().getRoles().stream().findFirst().get().getName().equals("Project Manager")){
                    response.add(user);
                }
            }
            log.info("getAllProjectManagers for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getAllProjectManagers for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }

    }

  
    @PreAuthorize("hasRole('GET-EMPLOYEES')")
    @GetMapping("/user-project/{id}")
    public List<UserProject> getUsersByProject(@PathVariable("id") String projectId, HttpServletRequest request, Authentication authentication) {
        log.info("getUsersByProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.getUsersByProject(projectId);
            log.info("getUsersByProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("getUsersByProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('REMOVE-EMPLOYEE-FROM-PROJECT')")
    @DeleteMapping("/user-project/{projectId}/delete/{userId}")
    public ResponseEntity<Object> deleteUserFromProject(@PathVariable("projectId") String projectId, @PathVariable("userId") String userId, HttpServletRequest request, Authentication authentication) {
        log.info("deleteUserFromProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var userProjects = profileService.getUsersByProject(projectId);

            for(var user: userProjects){
                if(user.getUser().getId().equals(UUID.fromString(userId))){
                    userProjectRepository.delete(user);
                    log.info("deleteUserFromProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
                    return new ResponseEntity<>(HttpStatus.OK);
                }
            }
            log.warn("deleteUserFromProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            log.warn("deleteUserFromProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    //@PreAuthorize("hasRole('GET-USER-SKILLS')")
    @GetMapping("/user-skills/{id}")
    public ResponseEntity<List<UserSkills>> getUserSkills(@PathVariable("id") String id, HttpServletRequest request, Authentication authentication) {
        log.info("getUserSkills initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = this.userSkillsRepository.findByUserId(UUID.fromString(id));
            log.info("getUserSkills for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("getUserSkills for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    //@PreAuthorize("hasRole('GET-EMPLOYEES')")
    @GetMapping("/project-user/{id}")
    public ResponseEntity<List<UserProject>> getProjectsByUser(@PathVariable("id") String accountId, HttpServletRequest request, Authentication authentication) {
        log.info("getProjectsByUser initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.getProjectsByUser(UUID.fromString(accountId));
                    log.info("getProjectsByUser for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("getProjectsByUser for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('GET-EMPLOYEES')")
    @PutMapping("/user-project")
    public UserProject delete(@RequestBody UserProject user, HttpServletRequest request, Authentication authentication) {
        log.info("DeleteUserProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.deleteUserFromProject(user);
            log.info("DeleteUserProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("DeleteUserProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('GET-SKILLS')")
    @PutMapping("/skill")
    public UserSkills deleteSkill(@RequestBody UserSkills user, HttpServletRequest request, Authentication authentication) {
        log.info("deleteUserSkill initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.deleteUserSkill(user);
            log.info("deleteUserSkill for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("deleteUserSkill for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('CREATE-PROJECT')")
    @PostMapping("/create-project")
    public Project createProject(@RequestBody CreateProjectDto dto, HttpServletRequest request, Authentication authentication) {
        log.info("createProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.createProject(dto);
            log.info("createProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("createProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('CREATE-SKILL')")
    @PostMapping("/create-userSkill")
    public UserSkills createUserSkill(@RequestBody UserSkills skill, HttpServletRequest request, Authentication authentication) {
        log.info("createUserSkill initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.createUserSkill(skill);
            log.info("createUserSkill for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("createUserSkill for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }


    @PreAuthorize("hasRole('ADD-EMPLOYEE-TO-PROJECT')")
    @PostMapping("/user-project/{projectId}/add")
    public UserProject addUserToProject(@PathVariable UUID projectId, @RequestBody AddUserToProject user, HttpServletRequest request, Authentication authentication) {
        log.info("addUserToProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var project = projectRepository.findById(projectId).orElseThrow();
            var account = accountRepository.findById(UUID.fromString(user.getUserId())).orElseThrow();
            var up = new UserProject();
            up.setProject(project);
            up.setUser(account);
            up.setStartDate(user.getFrom());
            up.setEndDate(user.getTo());
            up.setDescription(user.getDescription());

            var response = userProjectRepository.save(up);
            log.info("addUserToProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("addUserToProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }


    }

    @PreAuthorize("hasRole('ADD-EMPLOYEE-TO-PROJECT')")
    @PostMapping("/create-userProject")
    public UserProject addUserToProject(@RequestBody UserProject user, HttpServletRequest request, Authentication authentication) {
        log.info("addUserToProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = profileService.addUserToProject(user);
            log.info("addUserToProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return response;
        }catch (Exception e){
            log.warn("addUserToProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }


    @PreAuthorize("hasRole('UPDATE-USER-PROJECT')")
    @PutMapping("/update-userProject/{userProjectId}/{newDescription}")
    public ResponseEntity<UserProject> updateUserProject(@PathVariable String userProjectId, @PathVariable String newDescription, HttpServletRequest request, Authentication authentication) {
        log.info("updateUserProject initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = userProjectRepository.save((userProjectRepository.findById(UUID.fromString(userProjectId)).map(up-> {up.setDescription(newDescription); return up;}).get()));
            log.info("updateUserProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("updateUserProject for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('UPDATE-REGISTER-USER-INFO')")
    @PutMapping("/update-profile")
    public ResponseEntity<RegisterUserInfo> updateProfile(@RequestBody RegisterUserInfoDto registerUserInfoDto, HttpServletRequest request, Authentication authentication) {
        log.info("updateProfile initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var registerUserInfo = registerUserInfoRepository.findById(UUID.fromString(registerUserInfoDto.getId()));
            registerUserInfo.get().setAddress(registerUserInfoDto.getAddress());
            registerUserInfo.get().setPhoneNumber(registerUserInfoDto.getPhoneNumber());
            registerUserInfo.get().setFirstName(registerUserInfoDto.getFirstName());
            registerUserInfo.get().setLastName(registerUserInfoDto.getLastName());
            var response = registerUserInfoRepository.save(registerUserInfo.get());
            log.info("updateProfile for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("updateProfile for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }


    }

    @PutMapping("/update-skill/{userProjectId}/{changedProperty}/{flag}")
    public ResponseEntity<UserSkills> updateSkill(@PathVariable String userProjectId, @PathVariable String changedProperty, @PathVariable String flag) {

        if(flag.equals("jedan")){
            return new ResponseEntity<>(userSkillsRepository.save((userSkillsRepository.findById(UUID.fromString(userProjectId)).map(us-> {us.setName(changedProperty); return us;}).get())), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(userSkillsRepository.save((userSkillsRepository.findById(UUID.fromString(userProjectId)).map(us-> {us.setRating(Double.valueOf(changedProperty)); return us;}).get())), HttpStatus.OK);
        }
    }

    @PostMapping(value = "/upload-cv/{userEmail}")
    public ResponseEntity<RegisterUserInfo> updateProfile(@RequestBody RegisterUserInfo registerUserInfo) {
        var userProfile = registerUserInfoRepository.findById(registerUserInfo.getId()).orElseThrow();
        var pass = registerUserInfo.getAccount().getPassword();
        var encodedPass = passwordEncoder.encode(pass);
        //if(!userProfile.getAccount().getPassword().equals(encodedPass)) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        userProfile.setAddress(registerUserInfo.getAddress());
        userProfile.setFirstName(registerUserInfo.getFirstName());
        userProfile.setLastName(registerUserInfo.getLastName());
        userProfile.setPhoneNumber(registerUserInfo.getPhoneNumber());
        userProfile.setRevisionDate(new Date());
        return new ResponseEntity<>(registerUserInfoRepository.save(userProfile), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('UPDATE-SKILL')")
    @PutMapping("/update-skill")
    public ResponseEntity<UserSkills> updateSkill(@RequestBody UserSkills skill, HttpServletRequest request, Authentication authentication) {
        log.info("updateSkill initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = userSkillsRepository.save(skill);
            log.info("updateSkill for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("updateSkill for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    //@PreAuthorize("hasRole('UPLOAD-CV')")
    @PostMapping(value = "/upload-cv/{userEmail}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadCV(@PathVariable("userEmail") String userEmail, @RequestParam("file") MultipartFile file, HttpServletRequest request, Authentication authentication) {
        log.info("uploadCV initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            // Check if the file is not empty
            if (!file.isEmpty()) {
                try {
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());

                    var cvFileNameOnFileSystem = cvService.saveCV(file);
                    CV cv = new CV();
                    cv.setFileName(fileName);
                    cv.setFileNameOnFileSystem(cvFileNameOnFileSystem);
                    cv.setUserEmail(userEmail);
                    cv.setData(file.getBytes());
                    cvRepository.save(cv);
                    log.info("uploadCV for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
                    return new ResponseEntity<>("{\"message\": \"CV saved successfully!\"}", HttpStatus.OK);
                } catch (Exception e) {
                    e.printStackTrace();
                    log.warn("uploadCV for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                    return new ResponseEntity<>("Something went wrong while uploading CV...", HttpStatus.BAD_REQUEST);
                }
            }
            log.warn("uploadCV for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            return new ResponseEntity<>("Empty file uploaded...", HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            log.warn("uploadCV for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PreAuthorize("hasRole('READ-CVs')")
    @GetMapping("/get-all-cvs")
    public ResponseEntity<List<CV>> getAllCvs() {
        return new ResponseEntity<>(cvRepository.findAll(), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('READ-CVs')")
    @GetMapping("/get-all-cvs-for-manager-projects/{managerEmail}")
    public ResponseEntity<List<CV>> getAllCvsForManagerProjects(@PathVariable("managerEmail") String managerEmail) {
        var managerAccount = accountRepository.findByEmail(managerEmail);
        var managerIdUuid = managerAccount.get().getId();
        return new ResponseEntity<>(cvService.getAllForManager(managerIdUuid), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('READ-CVs')")
    @GetMapping("/get-cv-by-filename/{fileName}")
    public ResponseEntity<Test> getCvByFileName(@PathVariable("fileName") String fileName, UsernamePasswordAuthenticationToken jwt) {
        var cvBytes = cvService.readCV(fileName, jwt);
        String base64CV = Base64.getEncoder().encodeToString(cvBytes);
        Test test = new Test();
        test.setBase64CvData(base64CV);
        return new ResponseEntity<>(test, HttpStatus.OK);
    }
   @PreAuthorize("hasRole('SEARCH')")
    @GetMapping("/users/search/{email}/{firstname}/{lastname}/{from}/{to}")
    public  ResponseEntity<List<RegisterUserInfo>> Search(
            @PathVariable("email") String email,
            @PathVariable("firstname") String firstname,
            @PathVariable("lastname") String lastname,
            @PathVariable("from") String from,
            @PathVariable("to") String to
    ) {
       LocalDateTime date1 = LocalDateTime.parse(from);
       LocalDateTime date2 = LocalDateTime.parse(to);
        SearchDto searchDto = new SearchDto(email, firstname, lastname, date1, date2);
        return new ResponseEntity<>(profileService.Search(searchDto), HttpStatus.OK);}

    @PreAuthorize("hasRole('SEARCH')")
    @GetMapping("/users/search/{firstname}/{lastname}/{from}/{to}")
    public  ResponseEntity<List<RegisterUserInfo>> SearchEmployeeWithoutEmail(
            @PathVariable("firstname") String firstname,
            @PathVariable("lastname") String lastname,
            @PathVariable("from") String from,
            @PathVariable("to") String to
    ) {
        LocalDateTime date1 = LocalDateTime.parse(from);
        LocalDateTime date2 = LocalDateTime.parse(to);
        if(firstname.equals("empty")){
            firstname="";
        }
        if(lastname.equals("empty")){
            lastname="";
        }
        SearchDto searchDto = new SearchDto("", firstname, lastname, date1, date2);
        return new ResponseEntity<>(profileService.SearchByFirstNameOrLastName(searchDto), HttpStatus.OK);}

    @PreAuthorize("hasRole('SEARCH')")
    @GetMapping("/users/search/{from}/{to}")
    public  ResponseEntity<List<RegisterUserInfo>> SearchEmployeeByPeriod(
            @PathVariable("from") String from,
            @PathVariable("to") String to
    ) {
        LocalDateTime date1 = LocalDateTime.parse(from);
        LocalDateTime date2 = LocalDateTime.parse(to);
        SearchDto searchDto = new SearchDto("", "", "", date1, date2);
        return new ResponseEntity<>(profileService.SearchByPeriod(searchDto), HttpStatus.OK);}
    @PreAuthorize("hasRole('SEARCH')")
    @GetMapping("/users/search/{email}/{from}/{to}")
    public  ResponseEntity<List<RegisterUserInfo>> SearchEmployeeByEmail(
            @PathVariable("email") String email,
            @PathVariable("from") String from,
            @PathVariable("to") String to
    ) throws Exception {
        LocalDateTime date1 = LocalDateTime.parse(from);
        LocalDateTime date2 = LocalDateTime.parse(to);
        var response = profileService.SearchByEmail(email, date1, date2);
        for(RegisterUserInfo rui: response) {
            String aliasPrefix = takesFirstPartOfEmail(rui.getAccount().getEmail());
            rui.setFirstName(decryptString(rui.getFirstName(), aliasPrefix.concat("name")));
            rui.setPhoneNumber(decryptString(rui.getPhoneNumber(), aliasPrefix.concat("phone")));
            rui.getAddress().setCountry(decryptString(rui.getAddress().getCountry(), aliasPrefix.concat("country")));
            rui.getAddress().setCity(decryptString(rui.getAddress().getCity(), aliasPrefix.concat("city")));
            rui.getAddress().setStreet(decryptString(rui.getAddress().getStreet(), aliasPrefix.concat("street")));
            rui.setLastName(decryptString(rui.getLastName(), aliasPrefix.concat("prezime")));
        }
        return new ResponseEntity<>(response, HttpStatus.OK);}
    @PreAuthorize("hasRole('SEARCH')")
    @GetMapping("/users/{email}/{firstname}/{lastname}/{from}/{to}")
    public  ResponseEntity<List<RegisterUserInfo>> SearchByMailAndOneParameter(
            @PathVariable("email") String email,
            @PathVariable("firstname") String firstname,
            @PathVariable("lastname") String lastname,
            @PathVariable("from") String from,
            @PathVariable("to") String to
    ) {
        if (firstname.equals("empty")) {
            firstname = "";
        }
        if (lastname.equals("empty")) {
            lastname = "";}
            LocalDateTime date1 = LocalDateTime.parse(from);
            LocalDateTime date2 = LocalDateTime.parse(to);
            SearchDto searchDto = new SearchDto(email, firstname, lastname, date1, date2);
            return new ResponseEntity<>(profileService.SearchByEmailAndName(searchDto), HttpStatus.OK);
    }
}
