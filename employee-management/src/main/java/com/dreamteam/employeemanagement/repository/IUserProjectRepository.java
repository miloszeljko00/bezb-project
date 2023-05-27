package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import com.dreamteam.employeemanagement.model.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IUserProjectRepository  extends JpaRepository<UserProject, UUID> {
    List<UserProject> findAllByUser(Account user);
    List<UserProject> findAllByProject(Project project);
}
