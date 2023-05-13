package com.dreamteam.employeemanagement.auth.services;

import com.dreamteam.employeemanagement.dto.auth.request.LogoutRequest;
import com.dreamteam.employeemanagement.dto.auth.request.RefreshAccessTokenRequest;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.model.BlacklistedAccessToken;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IBlacklistedTokenRepository;
import com.dreamteam.employeemanagement.repository.IRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IAccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;
    private final IBlacklistedTokenRepository blacklistedTokenRepository;
    private final IRefreshTokenRepository refreshTokenRepository;

    private final JwtService jwtService;

    public LoginResponse login(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        var account = accountRepository.findByEmail(email).orElseThrow();
        var refreshToken = jwtService.generateRefreshToken(account);
        var accessToken = jwtService.generateAccessToken(account);

        return new LoginResponse(accessToken, refreshToken.getToken().toString());
    }

    public String refreshAccessToken(RefreshAccessTokenRequest refreshAccessTokenRequest) {

        var token = refreshTokenRepository.findById(UUID.fromString(refreshAccessTokenRequest.getRefreshToken())).orElse(null);

        if(token != null && token.validate()){
            var account = token.getAccount();
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
}
