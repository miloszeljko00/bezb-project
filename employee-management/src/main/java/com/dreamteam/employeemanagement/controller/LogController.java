package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.dto.auth.request.LoginRequest;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.service.LogParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final IAccountRepository accountRepository;

    private final LogParser logParser;

    @GetMapping
    public ResponseEntity<List<LogParser.LogEntry>> getLogs(Authentication authentication) {
        var email = authentication.getName();

        var account = accountRepository.findByEmail(email).orElseThrow();
        var lastAccessed = account.getLastTimeLogsAccessed();

        if(lastAccessed == null) lastAccessed = new Date(0);
        var logs = new ArrayList<LogParser.LogEntry>();
        try {
            logs = logParser.parseLogEntries();
        } catch (ParseException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Date finalLastAccessed = lastAccessed;
        logs.forEach(log -> {
            if(log.getTimestamp().before(finalLastAccessed)){
                log.setSeen(true);
            }
        });
        Collections.reverse(logs);
        account.setLastTimeLogsAccessed(new Date());
        accountRepository.save(account);
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }
}
