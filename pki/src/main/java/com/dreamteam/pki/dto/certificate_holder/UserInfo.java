package com.dreamteam.pki.dto.certificate_holder;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInfo {
    private String id;
    private String email;
    private String type;
    private String commonName;
    private String country;
    private String state;
    private String locality;
    private String organization;
    private String organizationalUnit;
}
