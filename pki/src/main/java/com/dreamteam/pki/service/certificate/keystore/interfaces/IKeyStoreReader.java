package com.dreamteam.pki.service.certificate.keystore.interfaces;

import com.dreamteam.pki.service.certificate.data.Issuer;
import org.springframework.stereotype.Service;

import java.security.*;
import java.security.cert.Certificate;


public interface IKeyStoreReader {

    /**
     * Zadatak ove metode jeste da ucita sertifikat iz KeyStore-a.
     * @param keyStoreFile - datoteka odakle se citaju podaci
     * @param keyStorePassword - lozinka koja je neophodna da se otvori key store
     * @param certificateName - certificateName putem kog se identifikuje sertifikat izdavaoca
     * @return - podatke o izdatom sertifikatu
     */
    public Certificate readCertificate(String keyStoreFile, String keyStorePassword, String certificateName);

    /**
     * Zadatak ove metode jeste da ucita podatke o izdavaocu i odgovarajuci privatni kljuc.
     * Ovi podaci se mogu iskoristiti da se novi sertifikati izdaju.
     *
     * @param keyStoreFile - datoteka odakle se citaju podaci
     * @param keyStorePassword - lozinka koja je neophodna da se otvori key store
     * @param certificateName - certificateName putem kog se identifikuje sertifikat izdavaoca
     * @param privateKeyPassword - lozinka koja je neophodna da se izvuce privatni kljuc
     * @return - podatke o izdavaocu i odgovarajuci privatni kljuc
     */
    public Issuer readIssuer(String keyStoreFile, String keyStorePassword, String certificateName, String privateKeyPassword);

    /**
     * Zadatak ove metode jeste da ucita privatani kljuc iz KeyStore-a.
     * @param keyStoreFile - datoteka odakle se citaju podaci
     * @param keyStorePassword - lozinka koja je neophodna da se otvori key store
     * @param certificateName - certificateName putem kog se identifikuje sertifikat izdavaoca
     * @param privateKeyPassword - lozinka koja je neophodna da se izvuce privatni kljuc
     * @return - podatke o izdatom sertifikatu
     */
    public PrivateKey readPrivateKey(String keyStoreFile, String keyStorePassword, String certificateName, String privateKeyPassword);
}
