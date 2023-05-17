package com.dreamteam.employeemanagement.service;

import com.dreamteam.employeemanagement.model.RegisterUserInfo;
import com.dreamteam.employeemanagement.model.enums.AccountStatus;
import com.dreamteam.employeemanagement.repository.IRegisterUserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

@Service
public class RegisterService {
    @Autowired
    private IRegisterUserInfoRepository registerUserInfoRepository;

    public boolean checkIfAccountWithThisEmailWasRecentlyDeclined(String email){
        Date endDate = new Date();  // Current date as the end date
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -3);  // Subtract 3 days
        Date startDate = calendar.getTime();  // Start date is 3 days ago
        Optional<RegisterUserInfo> userInfo = registerUserInfoRepository.findByAccountStatusAndAccountEmailAndRevisionDateBetween(AccountStatus.DENIED, email, startDate, endDate);
        if (userInfo.isPresent()) {
            return true;
        } else {
            return false;
        }
    }
}
