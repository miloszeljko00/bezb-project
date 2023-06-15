package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.service.MyLittleLogger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private MyLittleLogger log;
    @GetMapping
    public ResponseEntity<Object> test() {
        log.error("Hello World!");
        return new ResponseEntity<>("{\"result\": \"WORKS!\"}", HttpStatus.OK);
    }

}
