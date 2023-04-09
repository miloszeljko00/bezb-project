package com.dreamteam.pki.service.certificate.keystore;

import com.dreamteam.pki.service.certificate.keystore.interfaces.IKeyStoreWriter;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.*;
import java.security.cert.Certificate;

@Service
public class KeyStoreWriter implements IKeyStoreWriter {

    private KeyStore keyStore;

    public KeyStoreWriter() {
        try {
            keyStore = KeyStore.getInstance("JKS", "SUN");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void loadKeyStore(String keyStoreFile, String keyStorePassword) {
        try {
            if(keyStoreFile != null) {
                keyStore.load(new FileInputStream(keyStoreFile), keyStorePassword.toCharArray());
            } else {
                keyStore.load(null, keyStorePassword.toCharArray());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void saveKeyStore(String keyStoreFile, String keyStorePassword) {
        try {
            keyStore.store(new FileOutputStream(keyStoreFile), keyStorePassword.toCharArray());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void writeCertificate(String certificateName, PrivateKey privateKey, String keyStorePassword, java.security.cert.Certificate certificate) {
        try {
            keyStore.setKeyEntry(certificateName, privateKey, keyStorePassword.toCharArray(), new Certificate[] {certificate});
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }
    }
}
