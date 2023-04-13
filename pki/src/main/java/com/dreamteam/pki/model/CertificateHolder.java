package com.dreamteam.pki.model;

import com.dreamteam.pki.model.enums.CertificateHolderType;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bouncycastle.asn1.x500.X500Name;
import org.hibernate.annotations.Cascade;

import java.security.PublicKey;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "certificate_holders")
public class CertificateHolder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_holder_type")
    private CertificateHolderType type;


    /**
     * Here is a breakdown of the fields in a typical X500Name:
     *
     * commonName: The common name of the entity, usually the name of a person or organization. This field is often abbreviated as "CN".
     * country: The country or region where the entity is located. This field is often abbreviated as "C".
     * state: The state or province where the entity is located. This field is often abbreviated as "ST".
     * locality: The locality or city where the entity is located. This field is often abbreviated as "L".
     * organization: The organization or company that the entity belongs to. This field is often abbreviated as "O".
     * organizationalUnit: The unit or department within the organization that the entity belongs to. This field is often abbreviated as "OU".
     * Here's an example of an X500Name:
     *
     * CN=John Doe,OU=IT,O=Acme Corp,L=New York,ST=NY,C=US
     */
    @Column(name = "X500Name")
    private X500Name x500Name;

    @OneToMany(mappedBy = "subject")
    private List<Certificate> certificates;

    @OneToOne(cascade = CascadeType.ALL)
    private Account account;

    @Column(name = "is_deleted")
    private boolean isDeleted;
    
    public CertificateHolder(){
        certificates = new ArrayList<>();
    }

    public void addCertificate(Certificate certificate) {
        this.certificates.add(certificate);
    }
}
