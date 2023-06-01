package com.dreamteam.employeemanagement.security.gdpr;

import lombok.*;

import java.io.*;
import java.security.KeyStore;
import java.security.KeyStore.PasswordProtection;
import java.security.KeyStore.SecretKeyEntry;
import java.util.Properties;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
public class EncryptionKeyManager {
    private static final String KEYSTORE_PATH = loadKeystoreFilePathFromConfig();
    private static final String KEYSTORE_PASSWORD = loadKeystorePasswordFromConfig();
    //private static final String KEY_ALIAS = loadKeyAliasFromConfig();
    private static final String KEY_PASSWORD = loadKeyPasswordFromConfig();

    public static SecretKey generateEncryptionKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        return keyGen.generateKey();
    }
    public static void storeKeyInKeyStore(SecretKey secretKey, String alias) throws Exception {
        KeyStore keyStore = KeyStore.getInstance("JCEKS");

        try (FileInputStream fis = new FileInputStream(KEYSTORE_PATH)) {
            keyStore.load(fis, KEYSTORE_PASSWORD.toCharArray());
        } catch (FileNotFoundException e) {
            keyStore.load(null, null);
        }

        KeyStore.SecretKeyEntry secretKeyEntry = new KeyStore.SecretKeyEntry(secretKey);
        KeyStore.ProtectionParameter keyPassword = new KeyStore.PasswordProtection(KEY_PASSWORD.toCharArray());
        keyStore.setEntry(alias, secretKeyEntry, keyPassword);

        try (FileOutputStream fos = new FileOutputStream(KEYSTORE_PATH)) {
            keyStore.store(fos, KEYSTORE_PASSWORD.toCharArray());
        }
    }

    public static SecretKey retrieveKeyFromKeyStore(String alias) throws Exception {
        KeyStore keyStore = KeyStore.getInstance("JCEKS");
        keyStore.load(new FileInputStream(KEYSTORE_PATH), KEYSTORE_PASSWORD.toCharArray());

        KeyStore.SecretKeyEntry keyEntry = (KeyStore.SecretKeyEntry) keyStore.getEntry(alias,
                new KeyStore.PasswordProtection(KEY_PASSWORD.toCharArray()));

        return keyEntry.getSecretKey();
    }

    // Other utility methods and encryption/decryption logic can be added here
    private static String loadKeystoreFilePathFromConfig() {
        Properties properties = new Properties();
        try (InputStream inputStream = new FileInputStream("src/main/resources/application.properties")) {
            properties.load(inputStream);
            return properties.getProperty("keystore.file.path");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null; // Handle the case when the file path is not available
    }
    private static String loadKeystorePasswordFromConfig() {
        Properties properties = new Properties();
        try (InputStream inputStream = new FileInputStream("src/main/resources/application.properties")) {
            properties.load(inputStream);
            return properties.getProperty("keystore.password");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null; // Handle the case when the file path is not available
    }
//    private static String loadKeyAliasFromConfig() {
//        Properties properties = new Properties();
//        try (InputStream inputStream = new FileInputStream("src/main/resources/application.properties")) {
//            properties.load(inputStream);
//            return properties.getProperty("encryption.key.alias");
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        return null; // Handle the case when the file path is not available
//    }
    private static String loadKeyPasswordFromConfig() {
        Properties properties = new Properties();
        try (InputStream inputStream = new FileInputStream("src/main/resources/application.properties")) {
            properties.load(inputStream);
            return properties.getProperty("encryption.key.password");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null; // Handle the case when the file path is not available
    }
}

