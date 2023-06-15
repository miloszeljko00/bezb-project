package com.dreamteam.employeemanagement.repository;

import com.dreamteam.employeemanagement.model.Notification;
import com.dreamteam.employeemanagement.model.Permission;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByEmail(String email);
}
