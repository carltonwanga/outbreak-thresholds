package com.dsru.idsr.dhis2

class Api {
    public static final String BASIC_AUTH_USER = "";
    public static final String BASIC_AUTH_PASSWORD = "";

    public static String generateOAuthBasicAuthToken(){
        String credentials = BASIC_AUTH_USER+":"+BASIC_AUTH_PASSWORD;
        return credentials.bytes.encodeBase64().toString();

    }
}
