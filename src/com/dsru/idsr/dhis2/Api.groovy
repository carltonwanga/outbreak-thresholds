package com.dsru.idsr.dhis2

class Api {
    public static final String BASIC_AUTH_USER = "Carlton Wanga";
    public static final String BASIC_AUTH_PASSWORD = "W@nga1982";

    public static String generateOAuthBasicAuthToken(){
        String credentials = BASIC_AUTH_USER+":"+BASIC_AUTH_PASSWORD;
        return credentials.bytes.encodeBase64().toString();

    }
}
