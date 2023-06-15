package com.dreamteam.employeemanagement.model;

import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "accounts")
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Role> roles;

    @Column(name = "status")
    private AccountStatus status;
    @Embedded
    private MagicLoginToken magicLoginToken;

    @Column(name = "first_login")
    private boolean firstLogin;


    @Column(name = "last_time_logs_accessed")
    private Date lastTimeLogsAccessed;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var grantedAuthorities = new ArrayList<SimpleGrantedAuthority>();
        for(var role: roles) {
            for(var permission: role.getPermissions()){
                grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + permission.getName()));
            }
        }
        return grantedAuthorities;
    }
    public List<String> getRoleNames(){
        var result = new ArrayList<String>();
        for(var role : roles) {
            result.add(role.getName());
        }
        return result;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean hasRole(String roleName){
        for(var role : roles){
            if(role.getName().equals(roleName)) return true;
        }
        return false;
    }
}

