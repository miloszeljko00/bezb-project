package com.dreamteam.pki.service.certificate.interfaces;

import com.dreamteam.pki.service.certificate.data.Issuer;
import com.dreamteam.pki.service.certificate.data.Subject;

import java.security.cert.X509Certificate;
import java.util.Date;

public interface ICertificateGenerator {

    /**
     *
     * @param subject - podatak o tome kome se izdaje sertifikat
     * @param issuer - podatak o tome ko izdaje sertifikat
     * @param startDate - datum od kada je validan sertifikat
     * @param endDate - datum do kada je validan sertifikat
     * @param serialNumber - serijski broj sertifikata, mora biti globalno unique!
     * @return podatke o generisanom sertifikatu
     */
    X509Certificate generate(Subject subject, Issuer issuer, Date startDate, Date endDate, String serialNumber);
}
