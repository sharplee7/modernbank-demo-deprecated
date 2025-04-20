package com.modernbank.transfer.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtValidator jwtValidator;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        /*
        System.out.println("들어오는 메소드는: " + request.getMethod());
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt_token")) {
                    String token = cookie.getValue();
                    if (jwtValidator.validateToken(token)) {
                        String userId = jwtValidator.getUserIdFromToken(token);
                        HttpSession session = request.getSession();
                        session.setAttribute("userId", userId);  // save userid to session
                        System.out.println("JwtInterceptor token validation success...");
                        return true;
                    }
                    break;
                }
            }
        } 
        
        System.out.println("JwtInterceptor token validation failed...");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String jsonMessage = "{\"error\": \"Unauthorized\", \"message\": \"Authentication failed. Please log in again.\"}";
        response.getWriter().write(jsonMessage);
        return false;
*/
        return true;
    }
}