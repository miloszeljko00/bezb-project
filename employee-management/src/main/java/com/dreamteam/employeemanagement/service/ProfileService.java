package com.dreamteam.employeemanagement.service;

import com.dreamteam.employeemanagement.dto.profile.CreateProjectDto;
import com.dreamteam.employeemanagement.dto.profile.SearchDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProfileService {

    @Autowired
    private final IAccountRepository accountRepository;
    @Autowired
    private final IUserProjectRepository userProjectRepository;
    @Autowired
    private final IUserSkillsRepository userSkillsRepository;
    @Autowired
    private final IProjectRepository projectRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;


    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getByManager(String id) {

        return projectRepository.findByManager_Id(UUID.fromString(id));
    }

    public List<UserProject> getUsersByProject(String projectId) {
        var project = projectRepository.findById(UUID.fromString(projectId)).orElseThrow();
        return userProjectRepository.findAllByProject(project);
    }
    public List<UserProject> getProjectsByUser(UUID id) {
        var user = accountRepository.findById(id);
        return userProjectRepository.findAllByUser(user.get());

    }

    public Project createProject(CreateProjectDto dto) {
        var project = new Project();
        project.setName(dto.getName());
        project.setDuration(dto.getDuration());
        project.setManager(accountRepository.findById(UUID.fromString(dto.getManagerId())).get());
        return  projectRepository.save(project);
    }
    public UserSkills createUserSkill(UserSkills skill) {
        userSkillsRepository.save(skill);
        return skill;
    }
    public UserProject addUserToProject(UserProject userProject) {
        userProjectRepository.save(userProject);
        return userProject;
    }

    public UserProject deleteUserFromProject(UserProject user) {
        userProjectRepository.delete(user);
        return user;
    }
    public UserSkills deleteUserSkill(UserSkills user) {
        userSkillsRepository.delete(user);
        return user;
    }

    private void updateUserProject(UserProject oldUserProject, UserProject userProject) {
        oldUserProject.setStartDate(userProject.getStartDate());
        oldUserProject.setEndDate(userProject.getEndDate());
        oldUserProject.setDescription(userProject.getDescription());
    }

    public void updateProfile(RegisterUserInfo registerUserInfo) {
        registerUserInfoRepository.save(registerUserInfo);
    }

    public void updateSkill(UserSkills skill) {
        if (skill != null) {
            var oldSkill = userSkillsRepository.getById(UUID.fromString(skill.getId()));
            updateSkills(oldSkill, skill);
            userSkillsRepository.save(oldSkill);}
    }
    private void updateSkills(UserSkills oldSkill, UserSkills skill) {
        oldSkill.setRating(skill.getRating());
    }

    public List<UserProject> getUsersByManager(List<Project> projectsByManager) {

        List<UserProject> managersUserProjects = new ArrayList<>();
        for(Project project:projectsByManager){
          for( UserProject userProject:userProjectRepository.findAll())
          {
              if(userProject.getProject()==project){
                  managersUserProjects.add(userProject);
              }
          }
        }
       return managersUserProjects;
    }

    public List<Account> getAllUsers() {
        return accountRepository.findAll();
    }
    public Optional<Account> getUser(String id) {
        return null;//accountRepository.findById(id);
    }


    public List<RegisterUserInfo> Search(SearchDto searchDto) {

        List<RegisterUserInfo> searchResult = new ArrayList<>();
        if (!searchDto.getEmail().isEmpty() && !searchDto.getFirstName().isEmpty() && !searchDto.getLastName().isEmpty())
        {
            RegisterUserInfo user = registerUserInfoRepository.findByAccount_Email(searchDto.getEmail());
            if(Objects.equals(user.getFirstName(), searchDto.getFirstName())
                    && Objects.equals(user.getLastName(), searchDto.getLastName()))
            {

                List<LocalDateTime> startAndEndDate = PeriodOfEmployment(user.getAccount());
                if(!MatchedPeriods(startAndEndDate.get(0),
                        startAndEndDate.get(1),
                        searchDto.getFrom(),
                        searchDto.getTo()))
                {
                    return searchResult;
                }
                searchResult.add(registerUserInfoRepository.findByAccount_Email(searchDto.getEmail()));
                return searchResult;
            }
        }
        return searchResult;
    }
    public List<RegisterUserInfo> SearchByPeriod(SearchDto searchDto) {
        List<RegisterUserInfo> searchResult = new ArrayList<>();
        List<UserProject> allUserProjects = userProjectRepository.findAll();
        List<RegisterUserInfo> allWorkingUsers = new ArrayList<>();
        for (UserProject userProject : allUserProjects)
        {
            allWorkingUsers.add(registerUserInfoRepository.findByAccount_Email(userProject.getUser().getEmail()));
        }
        List<RegisterUserInfo> filtredDuplicates = new HashSet<>(allWorkingUsers).stream().toList();

        for (RegisterUserInfo user : filtredDuplicates) {
                List<LocalDateTime> startAndEndDate = PeriodOfEmployment(user.getAccount());
                if (MatchedPeriods(startAndEndDate.get(0),
                        startAndEndDate.get(1),
                        searchDto.getFrom(),
                        searchDto.getTo())) {
                    searchResult.add(user);
                }
            }
            return searchResult;
    }
    public List<RegisterUserInfo> SearchByFirstNameOrLastName(SearchDto searchDto) {
        List<RegisterUserInfo> searchResult = new ArrayList<>();

            if(!searchDto.getFirstName().isEmpty() && !searchDto.getLastName().isEmpty())
            {
                for(RegisterUserInfo user : matched(registerUserInfoRepository.findByFirstName(searchDto.getFirstName()),
                        registerUserInfoRepository.findByLastName(searchDto.getLastName())))
                {
                    List<LocalDateTime> startAndEndDate = PeriodOfEmployment(user.getAccount());
                    if (MatchedPeriods(startAndEndDate.get(0),
                            startAndEndDate.get(1),
                            searchDto.getFrom(),
                            searchDto.getTo()))
                    searchResult.add(user);
                }
                return searchResult;
            }
            else if(!searchDto.getFirstName().isEmpty() && searchDto.getLastName().isEmpty()){

                for(RegisterUserInfo user : registerUserInfoRepository.findByFirstName(searchDto.getFirstName()))
                {
                    List<LocalDateTime> startAndEndDate = PeriodOfEmployment(user.getAccount());
                    if (MatchedPeriods(startAndEndDate.get(0),
                            startAndEndDate.get(1),
                            searchDto.getFrom(),
                            searchDto.getTo()))
                    searchResult.add(user);
                }
                return searchResult;
            }
            else { //imamo samo ime ne i prezime
                for(RegisterUserInfo user : registerUserInfoRepository.findByLastName(searchDto.getLastName()))
                {
                    List<LocalDateTime> startAndEndDate = PeriodOfEmployment(user.getAccount());
                    if (MatchedPeriods(startAndEndDate.get(0),
                            startAndEndDate.get(1),
                            searchDto.getFrom(),
                            searchDto.getTo()))
                    searchResult.add(user);
                }
                return searchResult;
            }
    }
    public static boolean MatchedPeriods(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2, LocalDateTime end2) {
        if (start2.compareTo(start1) < 0 &&
                start1.compareTo(end2) > 0  ||
                start2.compareTo(end1) > 0) {
            return false;
        }
        return true;
    }

    private List<LocalDateTime> PeriodOfEmployment(Account account) {
        List<LocalDateTime> period = new ArrayList<>();
        LocalDateTime start =  LocalDateTime.of(2024, 2, 13, 15, 56);
        LocalDateTime end =  LocalDateTime.of(2011, 2, 13, 15, 56);
        period.add(start);
        period.add(end);

        List<UserProject> projects = userProjectRepository.findAllByUser(account);

        for (UserProject project : projects) {
            if (project.getStartDate().isBefore(period.get(0))) {
                period.set(0,project.getStartDate());
            }
            if (period.get(1).isBefore(project.getEndDate())) {
                period.set(1,project.getEndDate());
            }
        }
        return period;
    }

    public List<RegisterUserInfo> matched(List<RegisterUserInfo> list1, List<RegisterUserInfo> list2) {
        List<RegisterUserInfo> sameObjects = new ArrayList<>();

        for (RegisterUserInfo obj1 : list1) {
            for (RegisterUserInfo obj2 : list2) {
                if (obj1.equals(obj2)) {
                    sameObjects.add(obj1);
                    break;
                }
            }
        }
        return sameObjects;
    }

    public List<RegisterUserInfo> SearchByEmail(String email, LocalDateTime date1, LocalDateTime date2) {
        List<RegisterUserInfo> searchResult = new ArrayList<>();

            RegisterUserInfo user = registerUserInfoRepository.findByAccount_Email(email);
                List<LocalDateTime> startAndEndDate = PeriodOfEmployment(user.getAccount());
                if(!MatchedPeriods(startAndEndDate.get(0),
                        startAndEndDate.get(1),
                        date1,
                        date2))
                {
                    return searchResult;
                }
                searchResult.add(user);
                return searchResult;
    }
}
