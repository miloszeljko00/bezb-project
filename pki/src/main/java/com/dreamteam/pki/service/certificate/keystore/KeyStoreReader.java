package com.dreamteam.pki.service.certificate.keystore;

import com.dreamteam.pki.service.certificate.data.Issuer;
import com.dreamteam.pki.service.certificate.keystore.interfaces.IKeyStoreReader;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.stereotype.Service;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;

@Service
public class KeyStoreReader implements IKeyStoreReader {
    private KeyStore keyStore;

    public KeyStoreReader() {
        try {
            keyStore = KeyStore.getInstance("JKS", "SUN");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Certificate readCertificate(String keyStoreFile, String keyStorePassword, String certificateName) {
        try {
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(keyStoreFile));
            keyStore.load(in, keyStorePassword.toCharArray());

            if(keyStore.isKeyEntry(certificateName)) {
                return keyStore.getCertificate(certificateName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Issuer readIssuer(String keyStoreFile, String keyStorePassword, String certificateName, String privateKeyPassword) {
        try {
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(keyStoreFile));
            keyStore.load(in, keyStorePassword.toCharArray());

            Certificate cert = keyStore.getCertificate(certificateName);

            PrivateKey privateKey = (PrivateKey) keyStore.getKey(certificateName, privateKeyPassword.toCharArray());

            X500Name issuerName = new JcaX509CertificateHolder((X509Certificate) cert).getSubject();
            return new Issuer(privateKey, cert.getPublicKey(), issuerName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public PrivateKey readPrivateKey(String keyStoreFile, String keyStorePassword, String certificateName, String privateKeyPassword) {
        try {
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(keyStoreFile));
            keyStore.load(in, keyStorePassword.toCharArray());

            if(keyStore.isKeyEntry(certificateName)) {
                return (PrivateKey) keyStore.getKey(certificateName, privateKeyPassword.toCharArray());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
