package com.modernbank.customer.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;

@RestController
public class LoginController {

    @GetMapping("/welcome")
    public ResponseEntity<Map<String, String>> welcome(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId != null) {
            return ResponseEntity.status(200)
                .body(Map.of("greeting", "Hello, " + userId + "!"));
        }
        return ResponseEntity.status(401)
            .body(Map.of("error", "Invalid or missing session"));
    }
}