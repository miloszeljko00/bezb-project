package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.UserSkills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IUserSkillsRepository  extends JpaRepository<UserSkills, UUID> {
}
