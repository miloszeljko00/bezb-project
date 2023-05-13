package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.auth.services.AuthenticationService;
import com.dreamteam.employeemanagement.dto.auth.request.LoginRequest;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;

    @PostMapping("/actions/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        var email = loginRequest.getEmail();
        var password = loginRequest.getPassword();
        var jwt = authenticationService.login(email, password);

        var response = new LoginResponse(jwt);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/actions/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorizationHeader) {
       var jwt = authorizationHeader.substring(7);
       authenticationService.logout(jwt);
       return new ResponseEntity<>(HttpStatus.OK);
    }
}
