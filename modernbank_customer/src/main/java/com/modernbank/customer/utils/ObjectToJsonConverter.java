package com.modernbank.customer.utils;

import java.lang.reflect.Method;

public class ObjectToJsonConverter {

    public static String convertSettersToJson(Object obj) {
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        try {
            for (Method method : obj.getClass().getMethods()) {
                if (method.getName().startsWith("get") && method.getParameterCount() == 0) {
                    String fieldName = method.getName().substring(3);
                    fieldName = fieldName.substring(0, 1).toLowerCase() + fieldName.substring(1);

                    Object value = method.invoke(obj);

                    if (!first) {
                        json.append(", ");
                    }
                    first = false;

                    json.append("\"").append(fieldName).append("\":");
                    if (value instanceof String) {
                        json.append("\"").append(value).append("\"");
                    } else {
                        json.append(value);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        json.append("}");
        return json.toString();
    }
}