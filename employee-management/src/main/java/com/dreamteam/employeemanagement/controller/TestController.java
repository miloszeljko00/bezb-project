package com.dreamteam.employeemanagement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {


    @GetMapping
    public ResponseEntity<Object> test() {
        return new ResponseEntity<>("{\"result\": \"WORKS!\"}", HttpStatus.OK);
    }

}
