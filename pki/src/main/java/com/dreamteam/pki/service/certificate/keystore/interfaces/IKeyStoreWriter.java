package com.dreamteam.pki.service.certificate.keystore.interfaces;

import java.security.PrivateKey;

public interface IKeyStoreWriter {
    /**
     * Zadatak ove metode jeste da ucita podatke iz jks datoteke u key store-a.
     *
     * @param keyStoreFile     - datoteka odakle se citaju podaci, null vrednost ako pravimo novu jks datoteku.
     * @param keyStorePassword - lozinka koja je neophodna da se otvori key store
     */
    void loadKeyStore(String keyStoreFile, String keyStorePassword);

    /**
     * Zadatak ove metode jeste da sacuva podatke iz key store-a u jks datoteku.
     *
     * @param keyStoreFile     - datoteka odakle se citaju podaci, null vrednost ako pravimo novu jks datoteku.
     * @param keyStorePassword - lozinka koja je neophodna da se otvori key store
     */
    void saveKeyStore(String keyStoreFile, String keyStorePassword);

    /**
     * Zadatak ove metode jeste da upise novi sertifikat u key store.
     *
     * @param certificateName - naziv pod kojim ce sertifikat biti sacuvan u key store, mora biti unique!
     * @param privateKey      - privatni kljuc za dekriptovanje sertifikata
     * @param certificate     - sertifikat koji se upisuje u key store
     */
    void writeCertificate(String certificateName, PrivateKey privateKey, char[] password, java.security.cert.Certificate certificate);
}
