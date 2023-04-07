package com.dreamteam.pki.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.bouncycastle.asn1.x500.X500Name;

@Converter(autoApply = true)
public class X500NameConverter implements AttributeConverter<X500Name, String> {

    @Override
    public String convertToDatabaseColumn(X500Name name) {
        if (name == null) {
            return null;
        }
        return name.toString();
    }

    @Override
    public X500Name convertToEntityAttribute(String nameString) {
        if (nameString == null) {
            return null;
        }
        return new X500Name(nameString);
    }
}