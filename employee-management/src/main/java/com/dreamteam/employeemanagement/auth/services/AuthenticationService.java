package com.dreamteam.employeemanagement.auth.services;

import com.dreamteam.employeemanagement.model.BlacklistedToken;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IBlacklistedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IAccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;
    private final IBlacklistedTokenRepository blacklistedTokenRepository;

    private final JwtService jwtService;

    public String login(String email, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        var account = accountRepository.findByEmail(email).orElseThrow();
        return jwtService.generateToken(account);
    }

    public void logout(String token) {
        blacklistedTokenRepository.save(new BlacklistedToken(token));
    }
}
