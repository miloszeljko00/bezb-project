package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.auth.services.AuthenticationService;
import com.dreamteam.employeemanagement.dto.auth.request.ChangePasswordRequest;
import com.dreamteam.employeemanagement.dto.auth.request.LoginRequest;
import com.dreamteam.employeemanagement.dto.auth.request.LogoutRequest;
import com.dreamteam.employeemanagement.dto.auth.request.RefreshAccessTokenRequest;
import com.dreamteam.employeemanagement.dto.auth.response.RefreshAccessTokenResponse;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;
    private final EmailService emailService;

    @PostMapping("/actions/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        var email = loginRequest.getEmail();
        var password = loginRequest.getPassword();
        var loginResponse = authenticationService.login(email, password);

        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
    @PostMapping("/actions/change-password")
    public ResponseEntity<LoginResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        var email = changePasswordRequest.getEmail();
        var oldPassword = changePasswordRequest.getOldPassword();
        var newPassword = changePasswordRequest.getNewPassword();
        var loginResponse = authenticationService.changePassword(email, oldPassword, newPassword);

        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
    @PostMapping("/actions/magic-login")
    public ResponseEntity<String> magicLogin(@RequestBody String userEmail) {

        MagicLoginToken token = MagicLoginToken.builder()
                .token(UUID.randomUUID())
                .expirationDate(getExpirationDate())
                .isUsed(false) // Set it to false initially
                .build();
        var account = accountRepository.findByEmail(userEmail);
        account.get().setMagicLoginToken(token);
        accountRepository.save(account.get());

        // Generate the HMAC for the token and registerUserInfoId
        String hmac = HmacUtil.generateHmac(token.getToken().toString() + userEmail, "veljin-tajni-kljuc");

        String activationLink = "https://localhost:4200/login/magicLoginCallback?token=" + hmac + "&userEmail=" + userEmail;
        emailService.sendEmail(userEmail, "Magican login", "Poslali ste zahtev za magican login? : " + activationLink);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Date getExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        Date now = calendar.getTime();

        // Add 10 minutes
        calendar.add(Calendar.MINUTE, 10);
        Date futureDate = calendar.getTime();
        return futureDate;
    }

    @GetMapping("/actions/magic-login-activation")
    public ResponseEntity magicLogin(@RequestParam("token") String token, @RequestParam("userEmail") String userEmail) {
        // Retrieve the RegisterUserInfo object using the provided registerUserInfoId
        Optional<Account> account = accountRepository.findByEmail(userEmail);

        // Check if the RegisterUserInfo exists and the token matches
        if (account.isPresent()) {
            MagicLoginToken magicLoginToken = account.get().getMagicLoginToken();

            // Check if the token is expired
            if (magicLoginToken.getExpirationDate().before(new Date())) {
                return ResponseEntity.badRequest().body("Token has expired.");
            }

            // Check if the token has been used before
            if (magicLoginToken.isUsed()) {
                return ResponseEntity.badRequest().body("Token has already been used.");
            }

            // Generate the expected HMAC for the token and registerUserInfoId
            String expectedHmac = HmacUtil.generateHmac(account.get().getMagicLoginToken().getToken() + userEmail, "veljin-tajni-kljuc");

            // Verify if the provided HMAC matches the expected HMAC
            if (expectedHmac.equals(token)) {
                var loginResponse = authenticationService.magicLogin(account.get());
                return new ResponseEntity<>(loginResponse, HttpStatus.OK);
            }
        }

        return ResponseEntity.badRequest().body("Invalid activation link.");
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
