package com.dreamteam.employeemanagement.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LogParser {
    private static final Pattern LOG_PATTERN = Pattern.compile("^(\\d{2}:\\d{2}:\\d{2})\\s+(\\S+)\\s+(\\S+)\\s+-\\S+\\s+(.*)$");
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("HH:mm:ss");

    public ArrayList<LogEntry> parseLogEntries() throws ParseException, IOException {
        var logs = new ArrayList<LogEntry>();
        StringBuilder logContents = new StringBuilder();
        String logFilePath = "logs/app.log";
        try (BufferedReader reader = new BufferedReader(new FileReader(logFilePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                logs.add(parseLogEntry(line));
            }
        }
        return logs;
    }

    public LogEntry parseLogEntry(String logLine) throws ParseException {
        Matcher matcher = LOG_PATTERN.matcher(logLine);
        if (matcher.matches()) {
            String timeString = matcher.group(1);
            String levelString = matcher.group(2);
            String loggerName = matcher.group(3);
            String message = matcher.group(4);

            Date timestamp = DATE_FORMAT.parse(timeString);
            LogLevel level = LogLevel.valueOf(levelString);

            return new LogEntry(timestamp, level, loggerName, message, false);
        }

        throw new IllegalArgumentException("Invalid log format: " + logLine);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LogEntry {
        private Date timestamp;
        private LogLevel level;
        private String loggerName;
        private String message;
        private boolean seen;
    }
    public enum LogLevel {
        TRACE, DEBUG, INFO, WARN, ERROR
    }
}