package com.dreamteam.employeemanagement.auth.services;

import com.dreamteam.employeemanagement.dto.auth.request.LogoutRequest;
import com.dreamteam.employeemanagement.dto.auth.request.RefreshAccessTokenRequest;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.BlacklistedAccessToken;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IBlacklistedTokenRepository;
import com.dreamteam.employeemanagement.repository.IRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IAccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;
    private final IBlacklistedTokenRepository blacklistedTokenRepository;
    private final IRefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public LoginResponse login(String email, String password) throws Exception {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        var account = accountRepository.findByEmail(email).orElseThrow();
        if(!account.isEnabled()) throw new Exception("User account is disabled.");
        if(account.isFirstLogin()) return new LoginResponse("password_change_required", null);
        var refreshToken = jwtService.generateRefreshToken(account);
        var accessToken = jwtService.generateAccessToken(account);

        return new LoginResponse(accessToken, refreshToken.getToken().toString());
    }
    public LoginResponse magicLogin(Account account) throws Exception {
        if(!account.isEnabled()) throw new Exception("User account is disabled.");
        var refreshToken = jwtService.generateRefreshToken(account);
        var accessToken = jwtService.generateAccessToken(account);

        return new LoginResponse(accessToken, refreshToken.getToken().toString());
    }

    public String refreshAccessToken(RefreshAccessTokenRequest refreshAccessTokenRequest) throws Exception {

        var token = refreshTokenRepository.findById(UUID.fromString(refreshAccessTokenRequest.getRefreshToken())).orElse(null);

        if(token != null && token.validate()){
            var account = token.getAccount();
            if(!account.isEnabled()) throw new Exception("User account is disabled.");
            return jwtService.generateAccessToken(account);
        }
        return null;
    }

    public void logout(LogoutRequest logoutRequest) {
        if(logoutRequest.getAccessToken() != null)
            blacklistedTokenRepository.save(new BlacklistedAccessToken(logoutRequest.getAccessToken()));
        if(logoutRequest.getRefreshToken() != null){
            var refreshToken = refreshTokenRepository.findById(UUID.fromString(logoutRequest.getRefreshToken())).orElse(null);
            if(refreshToken != null){
                refreshToken.setValid(false);
                refreshTokenRepository.save(refreshToken);
            }
        }
    }

    public LoginResponse changePassword(String email, String oldPassword, String newPassword) throws Exception {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, oldPassword));

        var account = accountRepository.findByEmail(email).orElseThrow();
        if(!account.isEnabled()) throw new Exception("User account is disabled.");
        account.setFirstLogin(false);
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        var refreshToken = jwtService.generateRefreshToken(account);
        var accessToken = jwtService.generateAccessToken(account);

        return new LoginResponse(accessToken, refreshToken.getToken().toString());
    }

    public LoginResponse magicResetPassword(Account account, String newPassword) throws Exception {
        if(!account.isEnabled()) throw new Exception("User account is disabled.");
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        var refreshToken = jwtService.generateRefreshToken(account);
        var accessToken = jwtService.generateAccessToken(account);

        return new LoginResponse(accessToken, refreshToken.getToken().toString());
    }
}
