package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.model.Permission;
import com.dreamteam.employeemanagement.repository.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final IRoleRepository roleRepository;

    @GetMapping
    public ResponseEntity<Object> getAllRoles() {
        return new ResponseEntity<>(roleRepository.findAll(), HttpStatus.OK);
    }
    @PutMapping("{roleId}/actions/add-permission")
    public ResponseEntity<Object> addPermission(@RequestBody Permission permission, @PathVariable UUID roleId) {

        var role = roleRepository.findById(roleId).orElse(null);

        if(role == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var result = role.addPermission(permission);

        if(result) return new ResponseEntity<>(HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.CONFLICT);
    }
    @PutMapping("{roleId}/actions/remove-permission")
    public ResponseEntity<Object> removePermission(@RequestBody Permission permission, @PathVariable UUID roleId) {

        var role = roleRepository.findById(roleId).orElse(null);

        if(role == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var result = role.removePermission(permission);

        if(result) return new ResponseEntity<>(HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.CONFLICT);
    }
}
