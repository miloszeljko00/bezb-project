package com.dreamteam.employeemanagement.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

@Service
@Slf4j
public class CVService {
    public static final String cvDirectoryPath = "src/main/resources/cvs/";



//    public InputStream openExcel(Excel excel){
//        try {
//            Path path = Paths.get(excelDirectoryPath + excel.getName());
//            return Files.newInputStream(path.toAbsolutePath());
//        }catch (Exception e){
//            log.error("Can't open excel file: " + excel.getName() + ".");
//            return null;
//        }
//    }



//    public File openFile(Excel excel){
//        try {
//            Path path = Paths.get(excelDirectoryPath + excel.getName());
//            return new File(String.valueOf(path.toAbsolutePath()));
//        }catch (Exception e){
//            log.error("Can't open excel file: " + excel.getName() + ".");
//            return null;
//        }
//    }

//    public void deleteExcelFile(Excel excel) {
//        try {
//            Path path = Paths.get(excelDirectoryPath + excel.getName());
//            log.info(path.toAbsolutePath().toString());
//            Files.delete(path.toAbsolutePath());
//        } catch (Exception e) {
//            log.error("Can't delete excel file: " + excel.getName() + ".");
//        }
//    }

//    public void closeExcel(InputStream excelFile) {
//        try {
//            excelFile.close();
//        } catch (Exception e) {
//            log.error("Can't close excel file.");
//        }
//    }



    public String saveCV(MultipartFile cv) {
        Long currentDateInMils = new Date().getTime();
        String cvFileName = currentDateInMils + "_" +cv.getOriginalFilename();
        if(!cv.isEmpty()) {
            try{
                writeDataToFile(cv, cvFileName);
                return cvFileName;
            } catch (Exception e) {
                log.error(e.getMessage());
                return null;
            }
        }
        return null;
    }
    private void writeDataToFile(MultipartFile excelFile, String excelName) throws IOException {
        byte[] bytes = excelFile.getBytes();

        Path path = Paths.get(cvDirectoryPath);
        File file = new File(String.valueOf(path.toAbsolutePath()), excelName);

        FileOutputStream fileOutputStream = new FileOutputStream(file);

        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);

        bufferedOutputStream.write(bytes);
        bufferedOutputStream.close();
    }
}
