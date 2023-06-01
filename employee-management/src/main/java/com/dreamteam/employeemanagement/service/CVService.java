package com.dreamteam.employeemanagement.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.Date;

@Service
@Slf4j
public class CVService {
    public static final String cvDirectoryPath = "src/main/resources/cvs/";
    @Value("${server.ssl.key-store-password}")
    public String serverP12Password;



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
    private void writeDataToFile(MultipartFile cvFile, String excelName) throws IOException {
        byte[] bytes = cvFile.getBytes();

        Path path = Paths.get(cvDirectoryPath);
        File file = new File(String.valueOf(path.toAbsolutePath()), excelName);

        FileOutputStream fileOutputStream = new FileOutputStream(file);

        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);

        bufferedOutputStream.write(bytes);
        bufferedOutputStream.close();
    }
    public X509Certificate loadCertificateFromP12File(String p12FilePath, String p12FilePassword) {
        try {
            // Load the keystore from the P12 file
            KeyStore keystore = KeyStore.getInstance("PKCS12");
            FileInputStream fis = new FileInputStream(p12FilePath);
            keystore.load(fis, p12FilePassword.toCharArray());
            fis.close();

            // Get the certificate from the keystore
            String alias = keystore.aliases().nextElement();
            Certificate certificate = keystore.getCertificate(alias);

            // Convert the certificate to X509Certificate
            if (certificate instanceof X509Certificate) {
                return (X509Certificate) certificate;
            } else {
                throw new IllegalArgumentException("The loaded certificate is not an X509Certificate.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
