package com.dreamteam.pki.service.customMapper;

import com.dreamteam.pki.dto.certificate_holder.UserInfo;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.springframework.stereotype.Service;

@Service
public class X500NameMapper {

    public X500Name toX500Name(UserInfo userInfo){
        return (new X500NameBuilder(BCStyle.INSTANCE))
            .addRDN(BCStyle.UID, userInfo.getId())
            .addRDN(BCStyle.CN, userInfo.getCommonName())
            .addRDN(BCStyle.E, userInfo.getEmail())
            .addRDN(BCStyle.O, userInfo.getOrganization())
            .addRDN(BCStyle.OU, userInfo.getOrganizationalUnit())
            .addRDN(BCStyle.C, userInfo.getCountry())
            .addRDN(BCStyle.ST, userInfo.getCountry())
            .addRDN(BCStyle.L, userInfo.getCountry())
        .build();
    }

    public UserInfo fromX500Name(X500Name x500Name) {
        return UserInfo.builder()
            .id(x500Name.getRDNs(BCStyle.UID).length > 0 ? x500Name.getRDNs(BCStyle.UID)[0].getFirst().getValue().toString() : "")
            .commonName(x500Name.getRDNs(BCStyle.CN).length > 0 ? x500Name.getRDNs(BCStyle.CN)[0].getFirst().getValue().toString() : "")
            .email(x500Name.getRDNs(BCStyle.E).length > 0 ? x500Name.getRDNs(BCStyle.E)[0].getFirst().getValue().toString() : "")
            .organization(x500Name.getRDNs(BCStyle.O).length > 0 ? x500Name.getRDNs(BCStyle.O)[0].getFirst().getValue().toString() : "")
            .organizationalUnit(x500Name.getRDNs(BCStyle.OU).length > 0 ? x500Name.getRDNs(BCStyle.OU)[0].getFirst().getValue().toString() : "")
            .country(x500Name.getRDNs(BCStyle.C).length > 0 ? x500Name.getRDNs(BCStyle.C)[0].getFirst().getValue().toString() : "")
            .state(x500Name.getRDNs(BCStyle.ST).length > 0 ? x500Name.getRDNs(BCStyle.ST)[0].getFirst().getValue().toString() : "")
            .locality(x500Name.getRDNs(BCStyle.L).length > 0 ? x500Name.getRDNs(BCStyle.L)[0].getFirst().getValue().toString() : "")
        .build();
    }
}
