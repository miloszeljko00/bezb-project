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
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        log.info("Login initialized by: " + loginRequest.getEmail() + ", from ip address: " + request.getRemoteAddr());
        try{
            var email = loginRequest.getEmail();
            var password = loginRequest.getPassword();
            var loginResponse = authenticationService.login(email, password);

            log.info("Login for: " + loginRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }catch (Exception e){
            log.info("Login for: " + loginRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PostMapping("/actions/change-password")
    public ResponseEntity<LoginResponse> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest, HttpServletRequest request) {
        log.info("Password change initialized by: " + changePasswordRequest.getEmail() + ", from ip address: " + request.getRemoteAddr());
        try{

            var email = changePasswordRequest.getEmail();
            var oldPassword = changePasswordRequest.getOldPassword();
            var newPassword = changePasswordRequest.getNewPassword();
            var loginResponse = authenticationService.changePassword(email, oldPassword, newPassword);

            log.info("Password change for: " + changePasswordRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }catch (Exception e){
            log.info("Login for: " + changePasswordRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
    @PostMapping("/actions/magic-login")
    public ResponseEntity<String> magicLogin(@RequestBody String userEmail, HttpServletRequest request) {
        log.info("Magic login initialized by: " + userEmail + ", from ip address: " + request.getRemoteAddr());
        try{
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
            log.info("Magic login for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            log.info("Magic login for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
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
    public ResponseEntity magicLogin(@RequestParam("token") String token, @RequestParam("userEmail") String userEmail, HttpServletRequest request) {
        log.info("Magic login activation initialized by: " + userEmail + ", from ip address: " + request.getRemoteAddr());
        try{
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
            log.info("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return ResponseEntity.badRequest().body("Invalid activation link.");

        }catch (Exception e){
            log.info("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PostMapping("/actions/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest logoutRequest, HttpServletRequest request, Authentication authentication) {
        log.info("Logout initialized by: " + authentication.getName() + ", from ip address: " + request.getRemoteAddr());
        try{
            authenticationService.logout(logoutRequest);
            log.info("Logout for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            log.info("Logout for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PostMapping("/actions/refresh-access-token")
    public ResponseEntity<RefreshAccessTokenResponse> refreshAccessToken(@RequestBody RefreshAccessTokenRequest refreshAccessTokenRequest, HttpServletRequest request) {
        log.info("Refresh access token initialized by: " + refreshAccessTokenRequest.getEmail() + ", from ip address: " + request.getRemoteAddr());
        try{
            var accessToken = authenticationService.refreshAccessToken(refreshAccessTokenRequest);
            if(accessToken == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            var refreshAccessTokenResponse = new RefreshAccessTokenResponse(accessToken);
            log.info("Refresh access token for: " + refreshAccessTokenRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(refreshAccessTokenResponse, HttpStatus.OK);
        }catch (Exception e){
            log.info("Refresh access token for: " + refreshAccessTokenRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
}
