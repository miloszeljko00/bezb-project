package com.dreamteam.employeemanagement.model;

import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

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

    @Column(name="require_password_change")
    private boolean requirePasswordChange;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var grantedAuthorities = new ArrayList<GrantedAuthority>();
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
}

