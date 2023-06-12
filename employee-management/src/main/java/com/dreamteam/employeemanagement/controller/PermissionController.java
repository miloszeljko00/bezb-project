package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.repository.IPermissionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Slf4j
public class PermissionController {

    private final IPermissionRepository permissionRepository;


    @PreAuthorize("hasRole('GET-PERMISSIONS')")
    @GetMapping
    public ResponseEntity<Object> getAll(HttpServletRequest request, Authentication authentication) {
        log.info("Get all permissions initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = permissionRepository.findAll();
            log.info("Get all permissions for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.info("Get all permissions for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
}
