package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.RegisterUserInfo;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IRegisterUserInfoRepository extends JpaRepository<RegisterUserInfo, UUID> {
    List<RegisterUserInfo> findByAccount_Status(AccountStatus status);
}
