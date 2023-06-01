package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.auth.services.AuthenticationService;
import com.dreamteam.employeemanagement.dto.auth.request.*;
import com.dreamteam.employeemanagement.dto.auth.response.RefreshAccessTokenResponse;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;
    private final EmailService emailService;


    @GetMapping("/actions/request-reset-password/{userEmail}")
    public ResponseEntity<LoginResponse> requestResetPassword(@PathVariable String userEmail) {
        var account = accountRepository.findByEmail(userEmail).orElseThrow();

        MagicLoginToken token = MagicLoginToken.builder()
                .token(UUID.randomUUID())
                .expirationDate(getExpirationDate())
                .isUsed(false) // Set it to false initially
                .build();

        account.setMagicLoginToken(token);
        accountRepository.save(account);

        // Generate the HMAC for the token and registerUserInfoId
        String hmac = HmacUtil.generateHmac(token.getToken().toString() + userEmail, "veljin-tajni-kljuc");

        String activationLink = "http://localhost:4200/confirm-reset-password?token=" + hmac + "&userEmail=" + userEmail;
        emailService.sendEmail(userEmail, "Reset Password", "Dear user,\n\n We are sending you a link to confirm password reset request you made. If it wasn't you ignore this email.\n\n Here is the confirmation link: " + activationLink);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PostMapping("/actions/confirm-reset-password")
    public ResponseEntity<Object> confirmResetPassword(@RequestParam("token") String token, @RequestBody ResetPasswordRequest request) {
        var account = accountRepository.findByEmail(request.getEmail()).orElseThrow();

        MagicLoginToken magicLoginToken = account.getMagicLoginToken();

        // Check if the token is expired
        if (magicLoginToken.getExpirationDate().before(new Date())) {
            return ResponseEntity.badRequest().body("Token has expired.");
        }

        // Check if the token has been used before
        if (magicLoginToken.isUsed()) {
            return ResponseEntity.badRequest().body("Token has already been used.");
        }

        // Generate the expected HMAC for the token and registerUserInfoId
        String expectedHmac = HmacUtil.generateHmac(account.getMagicLoginToken().getToken() + request.getEmail(), "veljin-tajni-kljuc");
        String encodedToken;
        try{
            assert expectedHmac != null;
            encodedToken = URLDecoder.decode(expectedHmac, StandardCharsets.UTF_8);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // Verify if the provided HMAC matches the expected HMAC
        if (encodedToken.equals(token)) {
            LoginResponse loginResponse = null;
            try {
                loginResponse = authenticationService.magicResetPassword(account, request.getPassword());
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }

        return ResponseEntity.badRequest().body("Invalid activation link.");
    }

    @PostMapping("/actions/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        var email = loginRequest.getEmail();
        var password = loginRequest.getPassword();
        LoginResponse loginResponse = null;
        try {
            loginResponse = authenticationService.login(email, password);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }
    @PostMapping("/actions/change-password")
    public ResponseEntity<LoginResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        var email = changePasswordRequest.getEmail();
        var oldPassword = changePasswordRequest.getOldPassword();
        var newPassword = changePasswordRequest.getNewPassword();
        LoginResponse loginResponse = null;
        try {
            loginResponse = authenticationService.changePassword(email, oldPassword, newPassword);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

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

        String activationLink = "http://localhost:4200/login/magicLoginCallback?token=" + hmac + "&userEmail=" + userEmail;
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
    @PreAuthorize("hasRole('ENABLE-USER')")
    @GetMapping("/actions/enable-user/{userId}")
    public ResponseEntity enableUser(@PathVariable("userId") UUID userId) {
        var user = accountRepository.findById(userId).orElseThrow();
        user.setEnabled(true);
        accountRepository.save(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PreAuthorize("hasRole('DISABLE-USER')")
    @GetMapping("/actions/disable-user/{userId}")
    public ResponseEntity disableUser(@PathVariable("userId") UUID userId) {
        var user = accountRepository.findById(userId).orElseThrow();
        user.setEnabled(false);
        accountRepository.save(user);
        return new ResponseEntity<>(HttpStatus.OK);
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
                LoginResponse loginResponse = null;
                try {
                    loginResponse = authenticationService.magicLogin(account.get());
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
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
        String accessToken = null;
        try {
            accessToken = authenticationService.refreshAccessToken(refreshAccessTokenRequest);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(accessToken == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        var refreshAccessTokenResponse = new RefreshAccessTokenResponse(accessToken);
        return new ResponseEntity<>(refreshAccessTokenResponse, HttpStatus.OK);
    }
}
