package com.dreamteam.employeemanagement.auth.services;

import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.RefreshToken;
import com.dreamteam.employeemanagement.repository.IBlacklistedTokenRepository;
import com.dreamteam.employeemanagement.repository.IRefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;

@Service
@Slf4j
@RequiredArgsConstructor
//@AllArgsConstructor
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;


    private final  IBlacklistedTokenRepository blacklistedTokenRepository;

    private final IRefreshTokenRepository refreshTokenRepository;

    public boolean isTokenValid(String jwt, UserDetails userDetails) {
        final String username = extractUsername(jwt);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(jwt) && !isTokenBlacklisted(jwt);
    }

    public String generateAccessToken(Account account) {
        HashMap<String, Object> claims = new HashMap<>();
        List<String> roles = account.getRoleNames();

        claims.put("roles", roles);
        return generateAccessToken(claims, account);
    }
    public RefreshToken generateRefreshToken(Account account) {
        var refreshToken = new RefreshToken();
        refreshToken.setAccount(account);
        refreshToken.setIat(new Date(System.currentTimeMillis()));
        refreshToken.setExp(new Date(refreshToken.getIat().toInstant().plus(1, ChronoUnit.DAYS).toEpochMilli()));
        refreshToken.setValid(true);
        return refreshTokenRepository.save(refreshToken);
    }

    public String generateAccessToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        var sub = userDetails.getUsername();
        var roles = userDetails.getAuthorities();
        var iat = new Date(System.currentTimeMillis());
        var exp = new Date(iat.toInstant().plus(15, ChronoUnit.MINUTES).toEpochMilli());
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(sub)
                .claim("authorities", roles)
                .setIssuedAt(iat)
                .setExpiration(exp)
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String jwt) {
        return extractClaim(jwt, Claims::getSubject);
    }

    private boolean isTokenExpired(String jwt) {
        return extractExpiration(jwt).before(new Date());
    }

    private boolean isTokenBlacklisted(String jwt) { return blacklistedTokenRepository.findById(jwt).orElse(null) != null; }

    private Date extractExpiration(String jwt) {
        return extractClaim(jwt, Claims::getExpiration);
    }

    public <T> T extractClaim(String jwt, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(jwt);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String jwt) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
