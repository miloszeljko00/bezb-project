package com.dreamteam.employeemanagement.service;

import com.dreamteam.employeemanagement.dto.profile.UpdateProfileDto;
import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import com.dreamteam.employeemanagement.model.UserProject;
import com.dreamteam.employeemanagement.model.UserSkills;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IProjectRepository;
import com.dreamteam.employeemanagement.repository.IUserProjectRepository;
import com.dreamteam.employeemanagement.repository.IUserSkillsRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final IAccountRepository accountRepository;
    private final IUserProjectRepository userProjectRepository;
    private final IUserSkillsRepository userSkillsRepository;
    private final IProjectRepository projectRepository;


    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
  //  public List<Project> getAllByManager(String userId) {
  //      return projectRepository.findAllByManagerId(userId);
  //  }
    public List<Project> getByManager(Account manager) {return projectRepository.GetByManager(manager);
    }

    public List<UserProject> getUsersByProject(String projectId) {
        var project = projectRepository.getById(UUID.fromString(projectId));
        return userProjectRepository.getUsersByProject(project);
    }
    public List<UserProject> getProjectsByUser(String userId) {
        var user = accountRepository.getById(userId);
        return userProjectRepository.getProjectsByUser(user);
    }
    public List<UserProject> getEmployeesByManager(List<Project> projectsByManager) {
        List<UserProject> allUserProjects = userProjectRepository.findAll();
       //zavrsi
        return allUserProjects;
    }

    public Project createProject(Project project) {
        projectRepository.save(project);
        return project;
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

    public void updateUserProject(UserProject userProject) {
        if (userProject != null) {
        var oldUserProject = userProjectRepository.getById(userProject.getId());
        updateUserProject(oldUserProject, userProject);
        userProjectRepository.save(oldUserProject);}
    }
    private void updateUserProject(UserProject oldUserProject, UserProject userProject) {
        oldUserProject.setStartDate(userProject.getStartDate());
        oldUserProject.setEndDate(userProject.getEndDate());
        oldUserProject.setDescription(userProject.getDescription());
    }
    public void updateProfile(UpdateProfileDto userUpdate) {
        var user = accountRepository.getById(String.valueOf(userUpdate.getId()));
        if (user != null) {
            updateUser(user, userUpdate);
            accountRepository.save(user);}
    }
    private void updateUser(Account oldUser, UpdateProfileDto user) {

        oldUser.setEmail(user.getEmail());
        oldUser.setPassword(user.getPassword());
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

}
