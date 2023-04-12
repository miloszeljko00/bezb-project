package com.dreamteam.pki.service.certificate;

import com.dreamteam.pki.model.*;
import com.dreamteam.pki.model.enums.CertificateHolderType;
import com.dreamteam.pki.model.enums.CertificateType;
import com.dreamteam.pki.repository.ICertificateExtensionRepository;
import com.dreamteam.pki.repository.ICertificateHolderRepository;
import com.dreamteam.pki.repository.ICertificateRepository;
import com.dreamteam.pki.repository.IKeyStoreRepository;
import com.dreamteam.pki.service.certificate.keystore.interfaces.IKeyStoreReader;
import com.dreamteam.pki.service.certificate.keystore.interfaces.IKeyStoreWriter;
import com.dreamteam.pki.service.generators.CertificateGenerator;
import com.dreamteam.pki.service.generators.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.dreamteam.pki.model.Certificate;
import org.apache.logging.log4j.message.StringMapMessage;
import org.bouncycastle.asn1.*;
import org.bouncycastle.asn1.x509.*;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class CertificateService {
    private final ICertificateRepository certificateRepository;
    private final ICertificateHolderRepository certificateHolderRepository;
    private final CertificateGenerator certificateGenerator;
    private final PasswordGenerator passwordGenerator;

    private final IKeyStoreReader keyStoreReader;
    private final IKeyStoreWriter keyStoreWriter;
    private final IKeyStoreRepository keyStoreRepository;
    private final ICertificateExtensionRepository certificateExtensionRepository;

    public RootCertificate createRootCertificate(RootCertificate certificate){
        certificate = certificateRepository.save(certificate);
        var subject = certificate.getSubject();
        subject.addCertificate(certificate);
        certificateHolderRepository.save(subject);

        try{
            certificateExtensionRepository.saveAll(certificate.getCertificateExtensions());
            List<Extension> extensions = getExtensions(certificate);


            var x509Certificate = certificateGenerator.generate(
                    certificate.getPrivateKey(),
                    certificate.getPublicKey(),
                    certificate.getSubject().getX500Name(),
                    certificate.getIssuer().getX500Name(),
                    certificate.getDateRange().getStartDate(),
                    certificate.getDateRange().getEndDate(),
                    certificate.getSerialNumber(),
                    extensions);



            var keyStore = keyStoreRepository.findById(certificate.getSubject().getId()).orElse(null);

            if(keyStore == null){
                keyStore = new KeyStore(certificate.getSubject().getId(), "src/main/resources/static/" + certificate.getSubject().getId().toString() + ".jks", passwordGenerator.generate(20));
                keyStoreRepository.save(keyStore);
                keyStoreWriter.loadKeyStore(null, keyStore.getPassword());
            }else{
                keyStoreWriter.loadKeyStore(keyStore.getFileName(), keyStore.getPassword());
            }

            keyStoreWriter.writeCertificate(certificate.getSerialNumber().toString(), certificate.getPrivateKey(), keyStore.getPassword(), x509Certificate);
            keyStoreWriter.saveKeyStore(keyStore.getFileName(), keyStore.getPassword());

        }catch (Exception e) {
            return null;
        }
        return certificate;
    }

    public IntermediateCertificate createIntermediateCertificate(IntermediateCertificate certificate) {
        certificate = certificateRepository.save(certificate);
        var subject = certificate.getSubject();
        subject.addCertificate(certificate);
        certificateHolderRepository.save(subject);

        var parentCertificate = certificate.getParentCertificate();

        if(parentCertificate.getType() == CertificateType.ROOT_CERTIFICATE && parentCertificate instanceof RootCertificate rootCertificate){
            rootCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(rootCertificate);
        }else if(parentCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE && parentCertificate instanceof IntermediateCertificate intermediateCertificate){
            intermediateCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(intermediateCertificate);
        }else{
            return null;
        }

        try{
            certificateExtensionRepository.saveAll(certificate.getCertificateExtensions());
            List<Extension> extensions = getExtensions(certificate);

            var x509Certificate = certificateGenerator.generate(
                    certificate.getParentCertificate().getPrivateKey(),
                    certificate.getPublicKey(),
                    certificate.getSubject().getX500Name(),
                    certificate.getIssuer().getX500Name(),
                    certificate.getDateRange().getStartDate(),
                    certificate.getDateRange().getEndDate(),
                    certificate.getSerialNumber(),
                    extensions);

            var keyStore = keyStoreRepository.findById(certificate.getSubject().getId()).orElse(null);

            if(keyStore == null){
                keyStore = new KeyStore(certificate.getSubject().getId(), "src/main/resources/static/" + certificate.getSubject().getId().toString() + ".jks", passwordGenerator.generate(20));
                keyStoreRepository.save(keyStore);
                keyStoreWriter.loadKeyStore(null, keyStore.getPassword());
            }else{
                keyStoreWriter.loadKeyStore(keyStore.getFileName(), keyStore.getPassword());
            }

            keyStoreWriter.writeCertificate(certificate.getSerialNumber().toString(), certificate.getPrivateKey(), keyStore.getPassword(), x509Certificate);
            keyStoreWriter.saveKeyStore(keyStore.getFileName(), keyStore.getPassword());

        }catch (Exception e) {
            certificateRepository.delete(certificate);
            return null;
        }
        return certificate;
    }

    public EntityCertificate createEntityCertificate(EntityCertificate certificate) {
        certificate = certificateRepository.save(certificate);
        var subject = certificate.getSubject();
        subject.addCertificate(certificate);
        certificateHolderRepository.save(subject);

        var parentCertificate = certificate.getParentCertificate();

        if(parentCertificate.getType() == CertificateType.ROOT_CERTIFICATE && parentCertificate instanceof RootCertificate rootCertificate){
            rootCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(rootCertificate);
        }else if(parentCertificate.getType() == CertificateType.INTERMEDIATE_CERTIFICATE && parentCertificate instanceof IntermediateCertificate intermediateCertificate){
            intermediateCertificate.addIssuedCertificate(certificate);
            certificateRepository.save(intermediateCertificate);
        }else{
            return null;
        }

        try{
            certificateExtensionRepository.saveAll(certificate.getCertificateExtensions());
            List<Extension> extensions = getExtensions(certificate);

            var x509Certificate = certificateGenerator.generate(
                    certificate.getParentCertificate().getPrivateKey(),
                    certificate.getPublicKey(),
                    certificate.getSubject().getX500Name(),
                    certificate.getIssuer().getX500Name(),
                    certificate.getDateRange().getStartDate(),
                    certificate.getDateRange().getEndDate(),
                    certificate.getSerialNumber(),
                    extensions);

            var keyStore = keyStoreRepository.findById(certificate.getSubject().getId()).orElse(null);

            if(keyStore == null){
                keyStore = new KeyStore(certificate.getSubject().getId(), "src/main/resources/static/" + certificate.getSubject().getId().toString() + ".jks", passwordGenerator.generate(20));
                keyStoreRepository.save(keyStore);
                keyStoreWriter.loadKeyStore(null, keyStore.getPassword());
            }else{
                keyStoreWriter.loadKeyStore(keyStore.getFileName(), keyStore.getPassword());
            }

            keyStoreWriter.writeCertificate(certificate.getSerialNumber().toString(), certificate.getPrivateKey(), keyStore.getPassword(), x509Certificate);
            keyStoreWriter.saveKeyStore(keyStore.getFileName(), keyStore.getPassword());
        }catch (Exception e) {
            return null;
        }
        return certificate;
    }

    public Certificate findBySerialNumber(BigInteger serialNumber) {
        return certificateRepository.findById(serialNumber).orElse(null);
    }

    public boolean extractCertificate(Certificate certificate) {
        var keystore = keyStoreRepository.findById(certificate.getSubject().getId()).orElse(null);
        if(keystore == null) return false;

        var x509certificate = keyStoreReader.readCertificate("src/main/resources/static" + keystore.getSubjectId() + ".jks", keystore.getPassword(), certificate.getSerialNumber().toString());
        try {
            FileOutputStream os = new FileOutputStream(certificate.getSerialNumber() + ".crt");
            os.write("-----BEGIN CERTIFICATE-----\n".getBytes(StandardCharsets.US_ASCII));
            os.write(Base64.getEncoder().encode(x509certificate.getEncoded()));
            os.write("\n-----END CERTIFICATE-----\n".getBytes(StandardCharsets.US_ASCII));
            os.close();
            if(certificate.getSubject().getType().equals(CertificateHolderType.ENTITY)) return true;

            PrivateKey key = keyStoreReader.readPrivateKey("src/main/resources/static" + keystore.getSubjectId() + ".jks", keystore.getPassword(), certificate.getSerialNumber().toString(), keystore.getPassword());
            os = new FileOutputStream(certificate.getSerialNumber() + "-key" + ".pem");
            os.write("-----BEGIN PRIVATE KEY-----\n".getBytes(StandardCharsets.US_ASCII));
            os.write(Base64.getEncoder().encode(key.getEncoded()));
            os.write("\n-----END PRIVATE KEY-----\n".getBytes(StandardCharsets.US_ASCII));
            os.close();
        } catch (IOException | CertificateEncodingException e) {
            StringMapMessage message = new StringMapMessage();
            message.put("msg", "Error extracting certificate: " + e.getMessage());
            message.put("serial", certificate.getSerialNumber().toString());
            log.error(message.toString());
            throw new RuntimeException(e);
        }
        return true;
    }


    public boolean isValid(RootCertificate rootCertificate) {
        if(rootCertificate.isRevoked()) return false;

        return rootCertificate.getDateRange().isValid() && !rootCertificate.getDateRange().isExpired();
    }
    public boolean isValid(IntermediateCertificate intermediateCertificate) {
        if(intermediateCertificate.isRevoked()) return false;

        if(!intermediateCertificate.getDateRange().isValid() || intermediateCertificate.getDateRange().isExpired()) return false;

        if(intermediateCertificate.getParentCertificate().getType() == CertificateType.ROOT_CERTIFICATE && intermediateCertificate.getParentCertificate() instanceof RootCertificate rc){
            if(!isValid(rc)) return false;
        }
        if(intermediateCertificate.getParentCertificate().getType() == CertificateType.INTERMEDIATE_CERTIFICATE && intermediateCertificate.getParentCertificate() instanceof IntermediateCertificate ic){
            return isValid(ic);
        }
        return true;
    }
    public boolean isValid(EntityCertificate entityCertificate) {
        if(entityCertificate.isRevoked()) return false;

        if(!entityCertificate.getDateRange().isValid() || entityCertificate.getDateRange().isExpired()) return false;

        if(entityCertificate.getParentCertificate().getType() == CertificateType.ROOT_CERTIFICATE && entityCertificate.getParentCertificate() instanceof RootCertificate rc){
            if(!isValid(rc)) return false;
        }
        if(entityCertificate.getParentCertificate().getType() == CertificateType.INTERMEDIATE_CERTIFICATE && entityCertificate.getParentCertificate() instanceof IntermediateCertificate ic){
            return isValid(ic);
        }
        return true;
    }
    private List<Extension> getExtensions(Certificate certificate) throws Exception {
        var extensions = new ArrayList<Extension>();
        
        for(var certificateExtension : certificate.getCertificateExtensions()) {
            switch (certificateExtension.getExtensionType()){
                case AUTHORITY_INFO_ACCESS -> extensions.add(getAuthorityInfoAccessExtension(certificateExtension));
                case BASIC_CONSTRAINTS -> extensions.add(getBasicConstraintsExtension(certificateExtension));
                case CRL_DISTRIBUTION_POINTS -> extensions.add(getCrlDistributionPointsExtension(certificateExtension));
                case ISSUER_ALT_NAME -> extensions.add(getIssuerAltNameExtension(certificateExtension));
                case KEY_USAGE -> extensions.add(getKeyUsageExtension(certificateExtension));
                case PRIVATE_KEY_USAGE_PERIOD -> extensions.add(getPrivateKeyUsagePeriodExtension(certificateExtension));
                case SUBJECT_ALT_NAME -> extensions.add(getSubjectAltNameExtension(certificateExtension));
                default -> throw new Exception("Unknown Extension Type");
            }
        }
        return extensions;
    }

    private Extension getAuthorityInfoAccessExtension(CertificateExtension certificateExtension) throws IOException {
        // Parse the comma-separated list of authority information access values
        String[] authorityInfoAccessList = certificateExtension.getExtensionValue().split(",");

        // Initialize an ASN1EncodableVector to store the AccessDescription objects
        ASN1EncodableVector accessDescriptionVector = new ASN1EncodableVector();

        ASN1ObjectIdentifier accessMethod = AccessDescription.id_ad_ocsp;
        String accessLocation = certificateExtension.getExtensionValue();
        AccessDescription accessDescription = new AccessDescription(accessMethod,new GeneralName(GeneralName.uniformResourceIdentifier, accessLocation));

        // Create an AuthorityInformationAccess object
        AuthorityInformationAccess authorityInfoAccess = new AuthorityInformationAccess(accessDescription);

        // Create and return the extension
        return new Extension(Extension.authorityInfoAccess, certificateExtension.isCritical(), authorityInfoAccess.getEncoded());
    }

    private Extension getBasicConstraintsExtension(CertificateExtension certificateExtension) throws IOException {
        BasicConstraints basicConstraints = new BasicConstraints(Integer.parseInt(certificateExtension.getExtensionValue()));
        return new Extension(Extension.basicConstraints, certificateExtension.isCritical(), basicConstraints.getEncoded());
    }


    private Extension getSubjectAltNameExtension(CertificateExtension certificateExtension) throws IOException {
        // Parse the comma-separated list of subject alternative names
        String[] subjectAltNames = certificateExtension.getExtensionValue().split(",");

        // Create an array of GeneralName objects
        GeneralName[] generalNames = new GeneralName[subjectAltNames.length];
        for (int i = 0; i < subjectAltNames.length; i++) {
            generalNames[i] = new GeneralName(GeneralName.uniformResourceIdentifier, subjectAltNames[i]);
        }

        // Create a GeneralNames object
        GeneralNames subjectAlternativeNames = new GeneralNames(generalNames);

        // Create and return the extension
        return new Extension(Extension.subjectAlternativeName, certificateExtension.isCritical(), subjectAlternativeNames.getEncoded());
    }

    private Extension getPrivateKeyUsagePeriodExtension(CertificateExtension certificateExtension) throws IOException, ParseException {
        // Parse the comma-separated list of private key usage period values
        String[] privateKeyUsagePeriodList = certificateExtension.getExtensionValue().split(",");

        // Initialize the private key usage period values
        ASN1GeneralizedTime notBefore = null;
        ASN1GeneralizedTime notAfter = null;

        // Set up a date format
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        // Parse the private key usage period values
        for (int i = 0; i < privateKeyUsagePeriodList.length; i += 2) {
            if (privateKeyUsagePeriodList[i].equalsIgnoreCase("notBefore")) {
                Date notBeforeDate = dateFormat.parse(privateKeyUsagePeriodList[i + 1]);
                notBefore = new ASN1GeneralizedTime(notBeforeDate);
            } else if (privateKeyUsagePeriodList[i].equalsIgnoreCase("notAfter")) {
                Date notAfterDate = dateFormat.parse(privateKeyUsagePeriodList[i + 1]);
                notAfter = new ASN1GeneralizedTime(notAfterDate);
            }
        }

        // Create an ASN1Sequence object for the Private Key Usage Period extension
        ASN1EncodableVector privateKeyUsagePeriodVector = new ASN1EncodableVector();
        if (notBefore != null) {
            privateKeyUsagePeriodVector.add(new DERTaggedObject(false, 0, notBefore));
        }
        if (notAfter != null) {
            privateKeyUsagePeriodVector.add(new DERTaggedObject(false, 1, notAfter));
        }
        ASN1Sequence privateKeyUsagePeriodSequence = new DERSequence(privateKeyUsagePeriodVector);

        // Create and return the extension
        return new Extension(Extension.privateKeyUsagePeriod, certificateExtension.isCritical(), privateKeyUsagePeriodSequence.getEncoded(ASN1Encoding.DER));
    }

    private Extension getKeyUsageExtension(CertificateExtension certificateExtension) throws IOException {
        int keyUsageBits = Integer.parseInt(certificateExtension.getExtensionValue());
        KeyUsage keyUsage = new KeyUsage(keyUsageBits);
        return new Extension(Extension.keyUsage, certificateExtension.isCritical(), keyUsage.getEncoded());
    }

    private Extension getIssuerAltNameExtension(CertificateExtension certificateExtension) throws IOException {
        // Parse the comma-separated list of issuer alternative names
        String[] issuerAltNames = certificateExtension.getExtensionValue().split(",");

        // Create an array of GeneralName objects
        GeneralName[] generalNames = new GeneralName[issuerAltNames.length];
        for (int i = 0; i < issuerAltNames.length; i++) {
            generalNames[i] = new GeneralName(GeneralName.uniformResourceIdentifier, issuerAltNames[i]);
        }

        // Create a GeneralNames object
        GeneralNames issuerAlternativeNames = new GeneralNames(generalNames);

        // Create and return the extension
        return new Extension(Extension.issuerAlternativeName, certificateExtension.isCritical(), issuerAlternativeNames.getEncoded());
    }

    private Extension getCrlDistributionPointsExtension(CertificateExtension certificateExtension) throws IOException {
        // Parse the comma-separated list of CRL distribution point URLs
        String[] crlDistributionPoints = certificateExtension.getExtensionValue().split(",");

        // Create an array of DistributionPoint objects
        DistributionPoint[] distributionPoints = new DistributionPoint[crlDistributionPoints.length];
        for (int i = 0; i < crlDistributionPoints.length; i++) {
            GeneralName generalName = new GeneralName(GeneralName.uniformResourceIdentifier, crlDistributionPoints[i]);
            GeneralNames generalNames = new GeneralNames(generalName);
            DistributionPointName distributionPointName = new DistributionPointName(DistributionPointName.FULL_NAME, generalNames);
            distributionPoints[i] = new DistributionPoint(distributionPointName, null, null);
        }

        // Create a CRLDistPoint object
        CRLDistPoint crlDistPoint = new CRLDistPoint(distributionPoints);

        // Create and return the extension
        return new Extension(Extension.cRLDistributionPoints, certificateExtension.isCritical(), crlDistPoint.getEncoded());
    }

    public void deleteCertificate(Certificate certificate) {
        certificateRepository.delete(certificate);
    }
    public Certificate createCertificate(Certificate certificate){
        return certificateRepository.save(certificate);
    }
}
