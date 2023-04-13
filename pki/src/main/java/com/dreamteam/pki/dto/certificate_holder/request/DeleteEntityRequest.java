package com.dreamteam.pki.dto.certificate_holder.request;

import lombok.Data;

@Data
public class DeleteEntityRequest {
    private String email;
    private String password;
    private String commonName;
    private String country;
    private String state;
    private String locality;
    private String organization;
    private String organizationalUnit;
}
