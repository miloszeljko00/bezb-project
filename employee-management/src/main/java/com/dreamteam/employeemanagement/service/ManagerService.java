package com.dreamteam.employeemanagement.service;
import com.dreamteam.employeemanagement.dto.profile.CreateProjectDto;
import com.dreamteam.employeemanagement.dto.profile.CreateUserProjectDto;
import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import com.dreamteam.employeemanagement.model.UserProject;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IProjectRepository;
import com.dreamteam.employeemanagement.repository.IUserProjectRepository;
import com.dreamteam.employeemanagement.repository.IUserSkillsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ManagerService {
    @Autowired
    private final IAccountRepository accountRepository;
    @Autowired
    private final IUserProjectRepository userProjectRepository;
    @Autowired
    private final IUserSkillsRepository userSkillsRepository;
    @Autowired
    private final IProjectRepository projectRepository;
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getByManager(String id) {

        return projectRepository.findByManager_Id(UUID.fromString(id));
    }

    public List<UserProject> getUsersByProject(String projectId) {
        List<UserProject> projects = userProjectRepository.findByProject(projectRepository.findById(UUID.fromString(projectId)).get());
        return projects;
    }
    public Project createProject(CreateProjectDto dto) {
        var project = new Project();
        project.setName(dto.getName());
        project.setDuration(dto.getDuration());
        project.setManager(accountRepository.findById(UUID.fromString(dto.getManagerId())).get());
        return  projectRepository.save(project);
    }

    public void deleteUserFromProject(String id) {
        var userProject = userProjectRepository.findById(UUID.fromString(id));
        userProjectRepository.delete(userProject.get());

    }
    public List<Account> getAllUsers() {
        return accountRepository.findAll();
    }

    public Optional<Account> getUser(String id) {
        return null;//accountRepository.findById(id);
    }
    public UserProject addUserToProject(CreateUserProjectDto dto) {
        var userProject = new UserProject();
        userProject.setDescription(dto.getDescription());
        userProject.setStartDate(dto.getStartDate());
        userProject.setEndDate(dto.getEndDate());
        userProject.setProject(projectRepository.findById(UUID.fromString(dto.getProjectId())).get());
        userProject.setUser(accountRepository.findById(UUID.fromString(dto.getEngineerId())).get());
        return  userProjectRepository.save(userProject);
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

    public ResponseEntity<UserProject> updateUserProject(UserProject userProject) {
        var user = userProjectRepository.findById(userProject.getId()).orElseThrow();
             user.setEndDate(userProject.getEndDate());
            user.setStartDate(userProject.getStartDate());
            return new ResponseEntity<>(userProjectRepository.save(user), HttpStatus.OK);
    }

}
