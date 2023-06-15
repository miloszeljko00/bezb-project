package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.model.Notification;
import com.dreamteam.employeemanagement.model.Permission;
import com.dreamteam.employeemanagement.repository.INotificationRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final INotificationRepository notificationRepository;

    @GetMapping("/{userEmail}")
    public List<Notification> getAllByUserEmail(@PathVariable String userEmail) {
        return notificationRepository.findAllByEmail(userEmail);
    }

    @PutMapping("/mark-seen/{id}")
    public ResponseEntity<Object> markSeen(@PathVariable UUID id) {
        var notification = notificationRepository.findById(id).orElse(null);
        if(notification == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        notification.setSeen(true);
        notificationRepository.save(notification);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
