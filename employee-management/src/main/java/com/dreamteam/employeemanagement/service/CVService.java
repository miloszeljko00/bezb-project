package com.dreamteam.employeemanagement.service;
import com.dreamteam.employeemanagement.model.Permission;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class CVService {
    public static final String cvDirectoryPath = "src/main/resources/cvs/";
    @Value("${server.ssl.key-store}")
    public String serverP12Path;
    @Value("${server.ssl.key-store-password}")
    public String serverP12Password;


    public String saveCV(MultipartFile cv) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IOException, IllegalBlockSizeException, BadPaddingException {
        //certificate
        X509Certificate x509Certificate = loadCertificateFromP12File();
        //secret aes key
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(256);
        SecretKey aesKey = keyGenerator.generateKey();
        //utilize AES algorithm using Cipher
        Cipher aesCipher = Cipher.getInstance("AES");
        aesCipher.init(Cipher.ENCRYPT_MODE, aesKey);
        byte[] encryptedData = aesCipher.doFinal(cv.getBytes());
        //Encrypt AES key using the RSA encryption certificate
        PublicKey publicKey = x509Certificate.getPublicKey();
        Cipher rsaCipher = Cipher.getInstance("RSA");
        rsaCipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedAESKey = rsaCipher.doFinal(aesKey.getEncoded());


        Long currentDateInMils = new Date().getTime();
        String cvFileName = currentDateInMils + "_" +cv.getOriginalFilename();
        if(!cv.isEmpty()) {
            try{
                writeDataToFile(encryptedData, encryptedAESKey, cvFileName);
                return cvFileName;
            } catch (Exception e) {
                log.error(e.getMessage());
                return null;
            }
        }
        return null;
    }
    private void writeDataToFile(byte[] encryptedData, byte[] encryptedAESKey, String cvFileName) throws IOException {
        Path path = Paths.get(cvDirectoryPath);
        File cvFile = new File(String.valueOf(path.toAbsolutePath()), cvFileName);

        FileOutputStream fileOutputStream = new FileOutputStream(cvFile);
        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutputStream);

        // Write the encrypted AES key
        bufferedOutputStream.write(encryptedAESKey);
        // Write a separator to distinguish the AES key and CV data
        bufferedOutputStream.write("###".getBytes());
        // Write the encrypted CV document
        bufferedOutputStream.write(encryptedData);

        bufferedOutputStream.close();
    }
    public byte[] readCV(String cvFileName, UsernamePasswordAuthenticationToken jwt) {
        try {
            Path path = Paths.get(cvDirectoryPath);
            File file = new File(String.valueOf(path.toAbsolutePath()), cvFileName);
            byte[] fileData = Files.readAllBytes(file.toPath());
            // Find the separator position
            byte[] separator = "###".getBytes();
            int separatorIndex = findSeparatorIndex(fileData, separator);

            if (separatorIndex != -1) {
                // Extract the encrypted AES key and CV data
                byte[] encryptedAESKey = Arrays.copyOfRange(fileData, 0, separatorIndex);
                byte[] encryptedCV = Arrays.copyOfRange(fileData, separatorIndex + separator.length, fileData.length);

                return decryptCV(encryptedCV, encryptedAESKey, jwt);
            } else {
                throw new IllegalArgumentException("Separator not found in the file.");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
    private boolean shouldWordDocumentBeReadOnly(UsernamePasswordAuthenticationToken jwt){
        List<GrantedAuthority> permissions = (List<GrantedAuthority>) jwt.getAuthorities();
        boolean hasEditCvsPermission = false;
        for (GrantedAuthority permission : permissions) {
            if (permission.getAuthority().equals("ROLE_EDIT-CV")) {
                hasEditCvsPermission = true;
            }
        }
        return !hasEditCvsPermission;
    }
    private int findSeparatorIndex(byte[] data, byte[] separator) {
        for (int i = 0; i < data.length - separator.length + 1; i++) {
            boolean found = true;
            for (int j = 0; j < separator.length; j++) {
                if (data[i + j] != separator[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }
        return -1;
    }
    private byte[] decryptCV(byte[] encryptedData, byte[] encryptedAESKey, UsernamePasswordAuthenticationToken jwt) {
        try {
            // Decrypt the CV document using the appropriate decryption algorithm and key

            // 1. Retrieve the RSA private key from the keystore or external file
            PrivateKey privateKey = loadPrivateKeyFromFile("certs/server.key");

            // 2. Initialize the RSA decryption cipher
            Cipher rsaCipher = Cipher.getInstance("RSA");
            rsaCipher.init(Cipher.DECRYPT_MODE, privateKey);

            // 3. Decrypt the AES key from the encrypted data
            byte[] decryptedAESKey = rsaCipher.doFinal(encryptedAESKey);

            // 4. Decrypt the CV document using the decrypted AES key
            Cipher aesCipher = Cipher.getInstance("AES");
            SecretKeySpec aesKeySpec = new SecretKeySpec(decryptedAESKey, "AES");
            aesCipher.init(Cipher.DECRYPT_MODE, aesKeySpec);
            byte[] decryptedCV = aesCipher.doFinal(encryptedData);
            if(shouldWordDocumentBeReadOnly(jwt)){
                //Make word document readOnly
                ByteArrayInputStream bis = new ByteArrayInputStream(decryptedCV);
                XWPFDocument wordDocument = new XWPFDocument(bis);
                wordDocument.enforceReadonlyProtection();
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                wordDocument.write(bos);
                return bos.toByteArray();
            }
            return decryptedCV;
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }
    public PrivateKey loadPrivateKeyFromFile(String privateKeyFilePath) {
        try {
            Security.addProvider(new BouncyCastleProvider());

            FileReader fileReader = new FileReader(privateKeyFilePath);
            PemReader pemReader = new PemReader(fileReader);
            PemObject pemObject = pemReader.readPemObject();
            byte[] privateKeyBytes = pemObject.getContent();
            pemReader.close();

            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA", "BC");
            PrivateKey privateKey = keyFactory.generatePrivate(keySpec);

            return privateKey;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public X509Certificate loadCertificateFromP12File() {
        try {
            // Load the keystore from the P12 file
            KeyStore keystore = KeyStore.getInstance("PKCS12");
            FileInputStream fis = new FileInputStream(serverP12Path);
            keystore.load(fis, serverP12Password.toCharArray());
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
