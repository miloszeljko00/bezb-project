package com.dreamteam.employeemanagement;

import com.dreamteam.employeemanagement.service.MyLittleLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EmployeeManagementApplication {

	public static void main(String[] args) {
		System.setProperty("org.slf4j.LoggerFactory", "com.dreamteam.employeemanagement.service.MyLittleLogger");
		SpringApplication.run(EmployeeManagementApplication.class, args);
	}

}
