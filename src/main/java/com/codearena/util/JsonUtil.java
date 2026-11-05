package com.codearena.util;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * Centralized JSON serialization & standardized response formatting.
 */
public final class JsonUtil {
    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(Timestamp.class, (JsonSerializer<Timestamp>) (src, typeOfSrc, context) ->
                    new JsonPrimitive(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(src)))
            .registerTypeAdapter(Date.class, (JsonSerializer<Date>) (src, typeOfSrc, context) ->
                    new JsonPrimitive(new SimpleDateFormat("yyyy-MM-dd").format(src)))
            .create();

    private JsonUtil() {
    }

    public static Gson getGson() {
        return gson;
        
    }

    public static String toJson(Object obj) {
        return gson.toJson(obj);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }

    public static <T> T fromJson(String json, Type typeOfT) {
        return gson.fromJson(json, typeOfT);
    }

    /**
     * Standard success JSON response.
     */
    public static String successResponse(String message, Object data) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", true);
        if (message != null) map.put("message", message);
        if (data != null) map.put("data", data);
        return gson.toJson(map);
    }

    /**
     * Standard error JSON response.
     */
    public static String errorResponse(String message, int statusCode) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", false);
        map.put("status", statusCode);
        map.put("message", message);
        return gson.toJson(map);
    }
}

