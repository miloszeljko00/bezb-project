package com.dreamteam.employeemanagement.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {


    @GetMapping
    public ResponseEntity<Object> test() {
        log.info("Hello World!");
        return new ResponseEntity<>("{\"result\": \"WORKS!\"}", HttpStatus.OK);
    }

}
