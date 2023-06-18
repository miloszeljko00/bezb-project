package com.dreamteam.employeemanagement.service;

import com.dreamteam.employeemanagement.model.Notification;
import com.dreamteam.employeemanagement.repository.IAccountRepository;
import com.dreamteam.employeemanagement.repository.INotificationRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class MyLittleLogger {
;
    @Autowired
    private INotificationRepository notificationRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private IAccountRepository accountRepository;




    public boolean isTraceEnabled() {
        return log.isTraceEnabled();
    }

    public void trace(String s) {
        log.trace(s);
    }

    public void trace(String s, Object o) {
        log.trace(s, o);
    }

    public void trace(String s, Object o, Object o1) {
        log.trace(s, o, o1);
    }

    public void trace(String s, Object... objects) {
        log.trace(s,objects);
    }

    public void trace(String s, Throwable throwable) {
        log.trace(s, throwable);
    }

    public boolean isTraceEnabled(Marker marker) {
        return log.isTraceEnabled(marker);
    }

    public void trace(Marker marker, String s) {
        log.trace(marker, s);
    }

    public void trace(Marker marker, String s, Object o) {
        log.trace(marker, s, o);
    }

    public void trace(Marker marker, String s, Object o, Object o1) {
        log.trace(marker, s, o, o1);
    }

    public void trace(Marker marker, String s, Object... objects) {
        log.trace(marker, s, objects);
    }

    public void trace(Marker marker, String s, Throwable throwable) {
        log.trace(marker, s, throwable);
    }

    public boolean isDebugEnabled() {
        return log.isDebugEnabled();
    }

    public void debug(String s) {
        log.debug(s);
    }

    public void debug(String s, Object o) {
        log.debug(s, o);
    }

    public void debug(String s, Object o, Object o1) {
        log.debug(s, o, o1);
    }

    public void debug(String s, Object... objects) {
        log.debug(s, objects);
    }

    public void debug(String s, Throwable throwable) {
        log.debug(s, throwable);
    }

    public boolean isDebugEnabled(Marker marker) {
        return log.isDebugEnabled(marker);
    }

    public void debug(Marker marker, String s) {
        log.debug(marker, s);
    }

    public void debug(Marker marker, String s, Object o) {
        log.debug(marker, s, o);
    }

    public void debug(Marker marker, String s, Object o, Object o1) {
        log.debug(marker, s, o, o1);
    }

    public void debug(Marker marker, String s, Object... objects) {
        log.debug(marker, s, objects);
    }

    public void debug(Marker marker, String s, Throwable throwable) {
        log.debug(marker, s, throwable);
    }

    public boolean isInfoEnabled() {
        return log.isInfoEnabled();
    }

    public void info(String s) {
        log.info(s);
    }

    public void info(String s, Object o) {
        log.info(s, o);
    }

    public void info(String s, Object o, Object o1) {
        log.info(s, o, o1);
    }

    public void info(String s, Object... objects) {
        log.info(s, objects);
    }

    public void info(String s, Throwable throwable) {
        log.info(s, throwable);
    }

    public boolean isInfoEnabled(Marker marker) {
        return log.isInfoEnabled(marker);
    }

    public void info(Marker marker, String s) {
        log.info(marker, s);
    }

    public void info(Marker marker, String s, Object o) {
        log.info(marker, s, o);
    }

    public void info(Marker marker, String s, Object o, Object o1) {
        log.info(marker, s, o, o1);
    }

    public void info(Marker marker, String s, Object... objects) {
        log.info(marker, s, objects);
    }

    public void info(Marker marker, String s, Throwable throwable) {
        log.info(marker, s, throwable);
    }

    public boolean isWarnEnabled() {
        return log.isWarnEnabled();
    }

    public void warn(String s) {
        log.warn(s);
    }

    public void warn(String s, Object o) {
        log.warn(s, o);
    }

    public void warn(String s, Object... objects) {
        log.warn(s, objects);
    }

    public void warn(String s, Object o, Object o1) {
        log.warn(s, o, o1);
    }

    public void warn(String s, Throwable throwable) {
        log.warn(s, throwable);
    }

    public boolean isWarnEnabled(Marker marker) {
        return log.isWarnEnabled(marker);
    }

    public void warn(Marker marker, String s) {
        log.warn(marker, s);
    }

    public void warn(Marker marker, String s, Object o) {
        log.warn(marker, s, o);
    }

    public void warn(Marker marker, String s, Object o, Object o1) {
        log.warn(marker, s, o, o1);
    }

    public void warn(Marker marker, String s, Object... objects) {
        log.warn(marker, s, objects);
    }

    public void warn(Marker marker, String s, Throwable throwable) {
        log.warn(marker, s, throwable);
    }

    public boolean isErrorEnabled() {
        return log.isErrorEnabled();
    }

    public void error(String s) {
        log.error(s);
        var accounts = accountRepository.findAll();
        accounts = accounts.stream().filter(account -> account.hasRole("Administrator")).toList();
        List<Notification> notifications = new ArrayList<>();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for(var account : accounts) {
            futures.add(CompletableFuture.runAsync(() -> {
                emailService.sendEmail(account.getEmail(), "An error has occurred in Employee Management application", s);
            }));
            notifications.add(new Notification(UUID.randomUUID(), account.getEmail(), s, false));
        }
        notificationRepository.saveAll(notifications);
//        CompletableFuture<Void> allFutures = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
//        try {
//            allFutures.get(); // This will block until all futures are completed
//        } catch (Exception e) {
//            // Handle any exceptions that occurred during execution
//        }
    }

    public void error(String s, Object o) {
        log.error(s, o);
    }

    public void error(String s, Object o, Object o1) {
        log.error(s, o, o1);
    }

    public void error(String s, Object... objects) {
        log.error(s, objects);
    }

    public void error(String s, Throwable throwable) {
        log.error(s, throwable);
    }

    public boolean isErrorEnabled(Marker marker) {
        return log.isErrorEnabled(marker);
    }

    public void error(Marker marker, String s) {
        log.error(marker, s);
    }

    public void error(Marker marker, String s, Object o) {
        log.error(marker, s, o);
    }

    public void error(Marker marker, String s, Object o, Object o1) {
        log.error(marker, s, o, o1);
    }

    public void error(Marker marker, String s, Object... objects) {
        log.error(marker, s, objects);
    }

    public void error(Marker marker, String s, Throwable throwable) {
        log.error(marker, s, throwable);
    }
}
