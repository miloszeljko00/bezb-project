package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.model.Permission;
import com.dreamteam.employeemanagement.repository.IPermissionRepository;
import com.dreamteam.employeemanagement.repository.IRoleRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final IRoleRepository roleRepository;

    private final IPermissionRepository permissionRepository;


    @PreAuthorize("hasRole('GET-ROLES')")
    @GetMapping
    public ResponseEntity<Object> getAllRoles(Authentication authentication, HttpServletRequest request) {
        log.info("getAllRoles initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var response = roleRepository.findAll();
            log.info("getAllRoles for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            log.warn("getAllRoles for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADD-PERMISSION-TO-ROLE')")
    @PutMapping("{roleId}/actions/add-permission")
    public ResponseEntity<Object> addPermission(@RequestBody Permission permission, @PathVariable UUID roleId, Authentication authentication, HttpServletRequest request) {
        log.info("addPermission initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var role = roleRepository.findById(roleId).orElse(null);
            permission = permissionRepository.findById(permission.getId()).orElse(null);

            if(role == null) {
                log.warn("addPermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(permission == null) {
                log.warn("addPermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            var result = role.addPermission(permission);
            roleRepository.save(role);

            if(result) {
                log.info("addPermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
                return new ResponseEntity<>(HttpStatus.OK);
            }
            else {
                log.warn("addPermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        }catch (Exception e){
            log.warn("addPermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }

    }
    @PreAuthorize("hasRole('REMOVE-PERMISSION-FROM-ROLE')")
    @PutMapping("{roleId}/actions/remove-permission")
    public ResponseEntity<Object> removePermission(@RequestBody Permission permission, @PathVariable UUID roleId, Authentication authentication, HttpServletRequest request) {
        log.info("removePermission initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            var role = roleRepository.findById(roleId).orElse(null);
            permission = permissionRepository.findById(permission.getId()).orElse(null);

            if(role == null) {
                log.warn("removePermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(permission == null) {
                log.warn("removePermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            var result = role.removePermission(permission);
            roleRepository.save(role);

            if(result) {
                log.info("removePermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
                return new ResponseEntity<>(HttpStatus.OK);
            }
            else {
                log.warn("removePermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
        }catch (Exception e){
            log.warn("removePermission for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }

    }
}
