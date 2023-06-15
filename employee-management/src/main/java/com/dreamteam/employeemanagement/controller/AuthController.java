package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.auth.services.AuthenticationService;
import com.dreamteam.employeemanagement.dto.auth.request.*;
import com.dreamteam.employeemanagement.dto.auth.response.RefreshAccessTokenResponse;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.security.gdpr.EncryptionKeyManager;
import com.dreamteam.employeemanagement.service.EmailService;
import com.dreamteam.employeemanagement.service.MyLittleLogger;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(MyLittleLogger.class);

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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) throws Exception {
        log.info("Login initialized by: " + loginRequest.getEmail() + ", from ip address: " + request.getRemoteAddr());
        try{
            var email = loginRequest.getEmail();
            var password = loginRequest.getPassword();
            LoginResponse loginResponse = null;
            try {
                loginResponse = authenticationService.login(email, password);
            } catch (Exception e) {
                log.warn("Login for: " + loginRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            log.info("Login for: " + loginRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }catch (Exception e){
            log.warn("Login for: " + loginRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
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
            LoginResponse loginResponse = null;
            try {
                loginResponse = authenticationService.changePassword(email, oldPassword, newPassword);
            } catch (Exception e) {
                log.warn("Login for: " + changePasswordRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            log.info("Password change for: " + changePasswordRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }catch (Exception e){
            log.warn("Login for: " + changePasswordRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
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
            log.warn("Magic login for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
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
    public ResponseEntity magicLogin(@RequestParam("token") String token, @RequestParam("userEmail") String userEmail, HttpServletRequest request) throws Exception {
        log.info("Magic login activation initialized by: " + userEmail + ", from ip address: " + request.getRemoteAddr());
        try{
            // Retrieve the RegisterUserInfo object using the provided registerUserInfoId
            Optional<Account> account = accountRepository.findByEmail(userEmail);

            // Check if the RegisterUserInfo exists and the token matches
            if (account.isPresent()) {
                MagicLoginToken magicLoginToken = account.get().getMagicLoginToken();

                // Check if the token is expired
                if (magicLoginToken.getExpirationDate().before(new Date())) {
                    log.warn("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
                    return ResponseEntity.badRequest().body("Token has expired.");
                }

                // Check if the token has been used before
                if (magicLoginToken.isUsed()) {
                    log.warn("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
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
                        log.warn("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
                        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                    }
                    log.warn("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " was successful.");
                    return new ResponseEntity<>(loginResponse, HttpStatus.OK);
                }
            }
            log.warn("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
            return ResponseEntity.badRequest().body("Invalid activation link.");
        }catch (Exception e){
            log.warn("Magic login activation for: " + userEmail + " from ip address: " + request.getRemoteAddr() + " has failed.");
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
            log.warn("Logout for: " + authentication.getName() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }

    @PostMapping("/actions/refresh-access-token")
    public ResponseEntity<RefreshAccessTokenResponse> refreshAccessToken(@RequestBody RefreshAccessTokenRequest refreshAccessTokenRequest, HttpServletRequest request) {
        log.info("Refresh access token initialized by: " + refreshAccessTokenRequest.getEmail() + ", from ip address: " + request.getRemoteAddr());
        try{
            String accessToken = null;
            try {
                accessToken = authenticationService.refreshAccessToken(refreshAccessTokenRequest);
            } catch (Exception e) {
                log.warn("Refresh access token for: " + refreshAccessTokenRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            if(accessToken == null) return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            var refreshAccessTokenResponse = new RefreshAccessTokenResponse(accessToken);
            log.info("Refresh access token for: " + refreshAccessTokenRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " was successful.");
            return new ResponseEntity<>(refreshAccessTokenResponse, HttpStatus.OK);
        }catch (Exception e){
            log.warn("Refresh access token for: " + refreshAccessTokenRequest.getEmail() + " from ip address: " + request.getRemoteAddr() + " has failed.");
            throw e;
        }
    }
}
