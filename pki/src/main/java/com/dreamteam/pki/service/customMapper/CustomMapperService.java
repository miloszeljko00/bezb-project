package com.dreamteam.pki.service.customMapper;

import com.dreamteam.pki.dto.certificate_holder.request.CreateCertificateAuthorityRequest;
import com.dreamteam.pki.dto.certificate_holder.request.CreateEntityRequest;
import com.dreamteam.pki.dto.certificate_holder.response.CreateCertificateAuthorityResponse;
import com.dreamteam.pki.dto.certificate_holder.response.CreateEntityResponse;
import com.dreamteam.pki.dto.certificate_holder.response.GetCertificateHolder;
import com.dreamteam.pki.model.Account;
import com.dreamteam.pki.model.CertificateHolder;
import com.dreamteam.pki.model.enums.CertificateHolderType;
import com.dreamteam.pki.model.enums.Role;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.springframework.stereotype.Service;

@Service
public class CustomMapperService {

    public GetCertificateHolder convertToGetCertificateHolder(CertificateHolder certificateHolder) {
        GetCertificateHolder getCertificateHolder = new GetCertificateHolder();
        getCertificateHolder.setId(certificateHolder.getId());
        getCertificateHolder.setEmail(certificateHolder.getAccount().getEmail());
        getCertificateHolder.setType(certificateHolder.getType());

        X500Name x500Name = certificateHolder.getX500Name();
        RDN[] rdns = x500Name.getRDNs();

        for (RDN rdn : rdns) {
            ASN1ObjectIdentifier oid = rdn.getFirst().getType();
            String attributeName = BCStyle.INSTANCE.oidToDisplayName(oid);
            String attributeValue = rdn.getFirst().getValue().toString();

            switch (attributeName) {
                case "CN":
                    getCertificateHolder.setCommonName(attributeValue);
                    break;
                case "C":
                    getCertificateHolder.setCountry(attributeValue);
                    break;
                case "ST":
                    getCertificateHolder.setState(attributeValue);
                    break;
                case "L":
                    getCertificateHolder.setLocality(attributeValue);
                    break;
                case "O":
                    getCertificateHolder.setOrganization(attributeValue);
                    break;
                case "OU":
                    getCertificateHolder.setOrganizationalUnit(attributeValue);
                    break;
            }
        }
        return getCertificateHolder;
    }
    public CertificateHolder convertCreateEntityRequestToCertificateHolder(CreateEntityRequest request){
        CertificateHolder certificateHolder = new CertificateHolder();
        certificateHolder.setType(CertificateHolderType.ENTITY);
        certificateHolder.setAccount(new Account(request.getEmail(), request.getPassword(), Role.ENTITY));
        X500Name x500Name = new X500Name(
                        "CN=" + request.getCommonName() +
                        ",C=" + request.getCountry() +
                        ",ST=" + request.getState() +
                        ",L=" + request.getLocality() +
                        ",O=" + request.getOrganization() +
                        ",OU=" + request.getOrganizationalUnit()
        );
        certificateHolder.setX500Name(x500Name);
        return certificateHolder;
    }
    public CertificateHolder convertCreateCertificateAuthorityRequestToCertificateHolder(CreateCertificateAuthorityRequest request){
        CertificateHolder certificateHolder = new CertificateHolder();
        certificateHolder.setType(CertificateHolderType.CERTIFICATE_AUTHORITY);
        certificateHolder.setAccount(new Account(request.getEmail(), request.getPassword(), Role.CERTIFICATE_AUTHORITY));
        X500Name x500Name = new X500Name(
                "CN=" + request.getCommonName() +
                        ",C=" + request.getCountry() +
                        ",ST=" + request.getState() +
                        ",L=" + request.getLocality() +
                        ",O=" + request.getOrganization() +
                        ",OU=" + request.getOrganizationalUnit()
        );
        certificateHolder.setX500Name(x500Name);
        return certificateHolder;
    }

    public CreateEntityResponse convertCertificateHolderToCreateEntityResponse(CertificateHolder certificateHolder) {
        CreateEntityResponse response = new CreateEntityResponse();
        response.setEmail(certificateHolder.getAccount().getEmail());
        response.setType(certificateHolder.getType());
        response.setId(certificateHolder.getId());
        RDN[] rdns = certificateHolder.getX500Name().getRDNs();

        // Iterate through the RDNs to find the one with the type "commonName"
        for (RDN rdn : rdns) {
            if (rdn.getFirst().getType().equals(BCStyle.CN)) {
                response.setCommonName(rdn.getFirst().getValue().toString());
                break;
            }
        }

        response.setCountry(certificateHolder.getX500Name().getRDNs(BCStyle.C).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.C)[0].getFirst().getValue().toString() : null);
        response.setState(certificateHolder.getX500Name().getRDNs(BCStyle.ST).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.ST)[0].getFirst().getValue().toString() : null);
        response.setLocality(certificateHolder.getX500Name().getRDNs(BCStyle.L).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.L)[0].getFirst().getValue().toString() : null);
        response.setOrganization(certificateHolder.getX500Name().getRDNs(BCStyle.O).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.O)[0].getFirst().getValue().toString() : null);
        response.setOrganizationalUnit(certificateHolder.getX500Name().getRDNs(BCStyle.OU).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.OU)[0].getFirst().getValue().toString() : null);
        return response;
    }

    public CreateCertificateAuthorityResponse convertCertificateHolderToCreateCertificateAuthorityResponse(CertificateHolder certificateHolder) {
        CreateCertificateAuthorityResponse response = new CreateCertificateAuthorityResponse();
        response.setEmail(certificateHolder.getAccount().getEmail());
        response.setType(certificateHolder.getType());
        response.setId(certificateHolder.getId());
        RDN[] rdns = certificateHolder.getX500Name().getRDNs();

        // Iterate through the RDNs to find the one with the type "commonName"
        for (RDN rdn : rdns) {
            if (rdn.getFirst().getType().equals(BCStyle.CN)) {
                response.setCommonName(rdn.getFirst().getValue().toString());
                break;
            }
        }

        response.setCountry(certificateHolder.getX500Name().getRDNs(BCStyle.C).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.C)[0].getFirst().getValue().toString() : null);
        response.setState(certificateHolder.getX500Name().getRDNs(BCStyle.ST).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.ST)[0].getFirst().getValue().toString() : null);
        response.setLocality(certificateHolder.getX500Name().getRDNs(BCStyle.L).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.L)[0].getFirst().getValue().toString() : null);
        response.setOrganization(certificateHolder.getX500Name().getRDNs(BCStyle.O).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.O)[0].getFirst().getValue().toString() : null);
        response.setOrganizationalUnit(certificateHolder.getX500Name().getRDNs(BCStyle.OU).length > 0 ? certificateHolder.getX500Name().getRDNs(BCStyle.OU)[0].getFirst().getValue().toString() : null);
        return response;
    }
}
