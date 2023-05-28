package com.dreamteam.employeemanagement.service;

import com.dreamteam.employeemanagement.dto.profile.CreateProjectDto;
import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

}
