package com.modernbank.customer.security;

import java.util.Base64;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtValidator {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public boolean validateToken(String token) {
        System.out.println("----> token: " + token);
        try {
            byte[] decodedKey = Base64.getDecoder().decode(jwtSecret);
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(decodedKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
    
            Date expiration = claims.getExpiration();
            boolean isValid = expiration == null || expiration.after(new Date());
            System.out.println("Token validation result: " + isValid);
            return isValid;
        } catch (Exception e) {
            System.out.println("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public Claims extractClaims(String token) {
        byte[] decodedKey = Base64.getDecoder().decode(jwtSecret);
        return Jwts.parserBuilder()
                .setSigningKey(decodedKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = extractClaims(token);
        return claims.get("user_id", String.class);
    }
}