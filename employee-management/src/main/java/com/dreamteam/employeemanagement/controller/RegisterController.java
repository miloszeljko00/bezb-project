package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.dto.auth.request.LoginRequest;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.dto.register.RegisterUserInfoRequest;
import com.dreamteam.employeemanagement.model.Account;
import com.dreamteam.employeemanagement.model.Address;
import com.dreamteam.employeemanagement.model.RegisterUserInfo;
import com.dreamteam.employeemanagement.model.Role;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IRegisterUserInfoRepository;
import com.dreamteam.employeemanagement.repository.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegisterController {
    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;
    private final IRoleRepository roleRepository;

    @PostMapping
    public ResponseEntity<RegisterUserInfo> register(@RequestBody RegisterUserInfoRequest registerUserInfoRequest) {

        //Create Role
        var role = new Role();
        role.setName(registerUserInfoRequest.getDesignation());
        role = roleRepository.save(role);
        //Create account
        var account = new Account();
        account.setStatus(AccountStatus.PENDING);
        List<Role> roles = new ArrayList<Role>();
        roles.add(role);
        account.setRoles(roles);
        account.setEmail(registerUserInfoRequest.getEmail());
        var passwordEncoded = passwordEncoder.encode(registerUserInfoRequest.getPassword());
        account.setPassword(passwordEncoded);
        account = accountRepository.save(account);
        //Create Address
        var address = Address.builder()
                .City(registerUserInfoRequest.getCity())
                .Country(registerUserInfoRequest.getCountry())
                .Street(registerUserInfoRequest.getStreet())
                .build();
        //Create RegisterUserInfo
        var registerUserInfo = new RegisterUserInfo();
        registerUserInfo.setAccount(account);
        registerUserInfo.setFirstName(registerUserInfo.getFirstName());
        registerUserInfo.setLastName(registerUserInfo.getLastName());
        registerUserInfo.setPhoneNumber(registerUserInfo.getPhoneNumber());
        registerUserInfo.setAddress(address);
        registerUserInfo = registerUserInfoRepository.save(registerUserInfo);
        return new ResponseEntity<>(registerUserInfo, HttpStatus.OK);
    }
    @GetMapping("/get-all-unconfirmed")
    public ResponseEntity<List<RegisterUserInfo>> getAllUnconfirmedRegistrations() {
        return new ResponseEntity<>(registerUserInfoRepository.findByAccount_Status(AccountStatus.PENDING), HttpStatus.OK);
    }
    @PutMapping("/accept-registration/{id}")
    public ResponseEntity<RegisterUserInfo> acceptRegistration(@PathVariable("id") UUID id){
        var registrationRequest = registerUserInfoRepository.findById(id);
        var account = registrationRequest.get().getAccount();
        account.setStatus(AccountStatus.ACCEPTED);
        account = accountRepository.save(account);
        registrationRequest.get().setAccount(account);
        return new ResponseEntity<>(registerUserInfoRepository.save(registrationRequest.get()), HttpStatus.OK);
    }
    @PutMapping("/decline-registration/{id}")
    public ResponseEntity<RegisterUserInfo> denyRegistration(@PathVariable("id") UUID id){
        var registrationRequest = registerUserInfoRepository.findById(id);
        var account = registrationRequest.get().getAccount();
        account.setStatus(AccountStatus.DENIED);
        account = accountRepository.save(account);
        registrationRequest.get().setAccount(account);
        return new ResponseEntity<>(registerUserInfoRepository.save(registrationRequest.get()), HttpStatus.OK);
    }
}
