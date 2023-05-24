package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.repository.IPermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final IPermissionRepository permissionRepository;

    @GetMapping
    public ResponseEntity<Object> getAll() {
        return new ResponseEntity<>(permissionRepository.findAll(), HttpStatus.OK);
    }
}
