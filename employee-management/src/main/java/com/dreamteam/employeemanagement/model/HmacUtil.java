package com.dreamteam.employeemanagement.model;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class HmacUtil {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    public static String generateHmac(String data, String secretKey) {
        try {
            Mac hmac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            hmac.init(secretKeySpec);
            byte[] hashBytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            // Handle the exception appropriately
            e.printStackTrace();
        }
        return null;
    }

    public static boolean verifyHmac(String data, String secretKey, String hmac) {
        String generatedHmac = generateHmac(data, secretKey);
        return generatedHmac != null && generatedHmac.equals(hmac);
    }
}
