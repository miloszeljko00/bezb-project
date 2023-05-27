package com.dreamteam.employeemanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    Environment environment;

    public void sendEmail(String to, String subject, String body){
        SimpleMailMessage message=new SimpleMailMessage();
        message.setFrom(environment.getProperty("spring.mail.username"));
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }
}
