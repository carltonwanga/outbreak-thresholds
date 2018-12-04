package com.dsru.idsr.util

class CommonUtils {
    public static Map flattenListParam(Map map){

        [:].putAll(map.collect{ k, v ->
            def outPut = (String[]) v;
            new MapEntry(k, outPut[0])});
    }
}
