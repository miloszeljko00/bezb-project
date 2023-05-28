package com.dreamteam.employeemanagement.controller;

import com.dreamteam.employeemanagement.dto.auth.request.LoginRequest;
import com.dreamteam.employeemanagement.dto.auth.response.LoginResponse;
import com.dreamteam.employeemanagement.dto.register.RegisterUserInfoRequest;
import com.dreamteam.employeemanagement.model.*;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.IRegisterUserInfoRepository;
import com.dreamteam.employeemanagement.repository.IRoleRepository;
import com.dreamteam.employeemanagement.service.EmailService;
import com.dreamteam.employeemanagement.service.RegisterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/register")
@RequiredArgsConstructor
public class RegisterController {
    private final PasswordEncoder passwordEncoder;
    private final IAccountRepository accountRepository;
    private final IRegisterUserInfoRepository registerUserInfoRepository;
    private final IRoleRepository roleRepository;
    private final EmailService emailService;
    private final RegisterService registerService;

    @PostMapping
    public ResponseEntity register(@RequestBody RegisterUserInfoRequest registerUserInfoRequest) {

        if(registerService.checkIfAccountWithThisEmailWasRecentlyDeclined(registerUserInfoRequest.getEmail())){
            return ResponseEntity.badRequest().body("Registration request with this email was declined recently.");
        }
        //Create Role
        var role = new Role();
        role.setName(registerUserInfoRequest.getDesignation());
        role.setPermissions(new ArrayList<>());
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
        registerUserInfo.setFirstName(registerUserInfoRequest.getFirstName());
        registerUserInfo.setLastName(registerUserInfoRequest.getLastName());
        registerUserInfo.setPhoneNumber(registerUserInfoRequest.getPhone());
        registerUserInfo.setAddress(address);
        registerUserInfo = registerUserInfoRepository.save(registerUserInfo);
        return new ResponseEntity<>(registerUserInfo, HttpStatus.OK);
    }
    @GetMapping("/get-all-unconfirmed")
    public ResponseEntity<List<RegisterUserInfo>> getAllUnconfirmedRegistrations() {
        return new ResponseEntity<>(registerUserInfoRepository.findByAccount_Status(AccountStatus.PENDING), HttpStatus.OK);
    }
    @GetMapping("/get-by-id/{userEmail}")
    public ResponseEntity<RegisterUserInfo> getById(@PathVariable("userEmail") String userEmail) {
        return new ResponseEntity<>(registerUserInfoRepository.findByAccount_Email(userEmail), HttpStatus.OK);
    }
    @GetMapping("/confirm-registration")
    public ResponseEntity<String> confirmRegistration(@RequestParam("token") String token, @RequestParam("registerUserInfoId") String registerUserInfoId) {
        // Retrieve the RegisterUserInfo object using the provided registerUserInfoId
        Optional<RegisterUserInfo> userInfoOptional = registerUserInfoRepository.findById(UUID.fromString(registerUserInfoId));

        // Check if the RegisterUserInfo exists and the token matches
        if (userInfoOptional.isPresent()) {
            RegisterUserInfo userInfo = userInfoOptional.get();
            RegistrationToken registrationToken = userInfo.getRegistrationToken();

            // Check if the token is expired
            if (registrationToken.getExpirationDate().before(new Date())) {
                return ResponseEntity.badRequest().body("Token has expired.");
            }

            // Check if the token has been used before
            if (registrationToken.isUsed()) {
                return ResponseEntity.badRequest().body("Token has already been used.");
            }

            // Generate the expected HMAC for the token and registerUserInfoId
            String expectedHmac = HmacUtil.generateHmac(userInfo.getRegistrationToken().getToken() + registerUserInfoId, "veljin-tajni-kljuc");
            String encodedToken;
            try{
                assert expectedHmac != null;
                encodedToken = URLDecoder.decode(expectedHmac, StandardCharsets.UTF_8);
            }catch(Exception e){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            // Verify if the provided HMAC matches the expected HMAC
            if (encodedToken.equals(token)) {
                // Activate the user account
                var account = userInfo.getAccount();
                account.setStatus(AccountStatus.ACCEPTED);
                account = accountRepository.save(account);
                userInfo.setAccount(account);
                registrationToken.setUsed(true);
                userInfo.setRegistrationToken(registrationToken);
                userInfo.setRevisionDate(new Date());
                registerUserInfoRepository.save(userInfo);

                return ResponseEntity.ok("User activated successfully.");
            }
        }

        return ResponseEntity.badRequest().body("Invalid activation link.");
    }

    @PreAuthorize("hasRole('REGISTER-ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity registerAdmin(@RequestBody RegisterUserInfoRequest registerUserInfoRequest) {

        var role = roleRepository.findByName("Administrator");
        var roles = new ArrayList<Role>();
        roles.add(role);
        //Create account
        var account = new Account();
        account.setStatus(AccountStatus.ACCEPTED);
        account.setRoles(roles);
        account.setEmail(registerUserInfoRequest.getEmail());
        account.setFirstLogin(true);
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
        registerUserInfo.setFirstName(registerUserInfoRequest.getFirstName());
        registerUserInfo.setLastName(registerUserInfoRequest.getLastName());
        registerUserInfo.setPhoneNumber(registerUserInfoRequest.getPhone());
        registerUserInfo.setAddress(address);
        registerUserInfo = registerUserInfoRepository.save(registerUserInfo);
        return new ResponseEntity<>(registerUserInfo, HttpStatus.OK);
    }
    @PutMapping("/accept-registration")
    public ResponseEntity<RegisterUserInfo> acceptRegistration(@RequestBody String idString) {
        UUID id = UUID.fromString(idString);
        var registrationRequest = registerUserInfoRepository.findById(id);

        RegistrationToken token = RegistrationToken.builder()
                .token(UUID.randomUUID())
                .expirationDate(getExpirationDate())
                .isUsed(false) // Set it to false initially
                .build();
        registrationRequest.get().setRegistrationToken(token);
        var updatedRegistrationRequest = registerUserInfoRepository.save(registrationRequest.get());

        // Generate the HMAC for the token and registerUserInfoId
        String hmac = HmacUtil.generateHmac(token.getToken().toString() + idString, "veljin-tajni-kljuc");

        String activationLink = "http://localhost:8080/api/register/confirm-registration?token=" + hmac + "&registerUserInfoId=" + idString;
        emailService.sendEmail(registrationRequest.get().getAccount().getEmail(), "Obradjen zahtev za registraciju", "Vas zahtev za registraciju je prihvacen! Potvrdite pritiskom na link: " + activationLink);
        return new ResponseEntity<>(updatedRegistrationRequest, HttpStatus.OK);
    }
    @PutMapping("/decline-registration")
    public ResponseEntity<RegisterUserInfo> denyRegistration(@RequestBody String idString) {
        UUID id = UUID.fromString(idString);

        var registrationRequest = registerUserInfoRepository.findById(id);
        var account = registrationRequest.get().getAccount();
        account.setStatus(AccountStatus.DENIED);
        account = accountRepository.save(account);
        registrationRequest.get().setAccount(account);
        registrationRequest.get().setRevisionDate(new Date());
        emailService.sendEmail(account.getEmail(), "Obradjen zahtev za registraciju", "Nazalost, vas zahtev je odbijen, za vise informacija kontaktirajte nas putem telefona: 123456789");
        return new ResponseEntity<>(registerUserInfoRepository.save(registrationRequest.get()), HttpStatus.OK);
    }
    private Date getExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, 3);
        return calendar.getTime();
    }
}
