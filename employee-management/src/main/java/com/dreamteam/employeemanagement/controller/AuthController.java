package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.auth.services.AuthenticationService;
import com.dreamteam.employeemanagement.dto.auth.request.LoginRequest;
import com.dreamteam.employeemanagement.dto.auth.request.LogoutRequest;
import com.dreamteam.employeemanagement.dto.auth.request.RefreshAccessTokenRequest;
import com.dreamteam.employeemanagement.dto.auth.response.RefreshAccessTokenResponse;
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
        var loginResponse = authenticationService.login(email, password);

        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @PostMapping("/actions/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest logoutRequest) {
       authenticationService.logout(logoutRequest);
       return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/actions/refresh-access-token")
    public ResponseEntity<RefreshAccessTokenResponse> refreshAccessToken(@RequestBody RefreshAccessTokenRequest refreshAccessTokenRequest) {
        var accessToken = authenticationService.refreshAccessToken(refreshAccessTokenRequest);
        if(accessToken == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        var refreshAccessTokenResponse = new RefreshAccessTokenResponse(accessToken);
        return new ResponseEntity<>(refreshAccessTokenResponse, HttpStatus.OK);
    }
}
