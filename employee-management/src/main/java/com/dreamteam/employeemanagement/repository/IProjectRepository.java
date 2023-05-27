package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IProjectRepository  extends JpaRepository<Project, UUID> {
    List<Project> findByManager_Id(UUID managerId);
  //  List<Project> findAllByManagerId(String userId);
}
