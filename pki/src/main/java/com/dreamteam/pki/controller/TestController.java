package com.dreamteam.pki.controller;

import com.dreamteam.pki.auth.role_validators.AdminRole;
import com.dreamteam.pki.auth.role_validators.EntityRole;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @EntityRole
    @GetMapping("/entity")
    public ResponseEntity<Object> testEntity() {
        return new ResponseEntity<>("ENTITY WORKING", HttpStatus.OK);
    }

    @AdminRole
    @GetMapping("/admin")
    public ResponseEntity<Object> testAdmin() {
        return new ResponseEntity<>("ADMIN WORKING", HttpStatus.OK);
    }

}
