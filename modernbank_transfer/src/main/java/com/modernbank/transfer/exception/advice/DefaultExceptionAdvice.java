package com.modernbank.transfer.exception.advice;

import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.modernbank.transfer.exception.BusinessException;
import com.modernbank.transfer.exception.SystemException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

@ControllerAdvice
public class DefaultExceptionAdvice {
    private final Logger LOGGER = LoggerFactory.getLogger(DefaultExceptionAdvice.class);
    
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<Object> handleException(BusinessException e) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("message", "[Notice]\n" + e.getMessage());
        result.put("httpStatus", e.getHttpStatus().value());

        return new ResponseEntity<>(result, e.getHttpStatus());
    }
    
    @ExceptionHandler(SystemException.class)
    protected ResponseEntity<Object> handleException(SystemException e) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("message", "[System Error]\n" + e.getMessage());
        result.put("httpStatus", e.getHttpStatus().value());

        return new ResponseEntity<>(result, e.getHttpStatus());
    }
    
    @ExceptionHandler(HttpClientErrorException.class)
    protected ResponseEntity<Object> handleException(HttpClientErrorException e) {
        Map<String, Object> result = new HashMap<String, Object>();
        String message = getErrorMessageFromJsonString(e.getResponseBodyAsString());
        result.put("message", message);
        result.put("httpStatus", HttpStatus.EXPECTATION_FAILED.value());

        return new ResponseEntity<>(result, HttpStatus.EXPECTATION_FAILED);
    }
    
    @ExceptionHandler(HttpServerErrorException.class)
    protected ResponseEntity<Object> handleException(HttpServerErrorException e) {
        Map<String, Object> result = new HashMap<String, Object>();
        String message = getErrorMessageFromJsonString(e.getResponseBodyAsString());
        result.put("message", message);
        result.put("httpStatus", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(ResourceAccessException.class)
    protected ResponseEntity<Object> handleException(ResourceAccessException e) {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("message", "[Connection Error]\nFailed to connect to the server.");
        result.put("httpStatus", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleException(Exception e) {
        Map<String, Object> result = new HashMap<String, Object>();
        ResponseEntity<Object> ret = null;
        
        if(e instanceof BusinessException) {
            BusinessException b = (BusinessException)e;
            result.put("message", "[Notice]\n" + b.getMessage());
            result.put("httpStatus", b.getHttpStatus().value());
            ret = new ResponseEntity<>(result, b.getHttpStatus());
        } else if(e instanceof SystemException) {
            BusinessException s = (BusinessException)e;
            result.put("message", "[System Error]\n" + s.getMessage());
            result.put("httpStatus", s.getHttpStatus().value());
            ret = new ResponseEntity<>(result, s.getHttpStatus());
            
            LOGGER.error(s.getMessage(), s);
        } else {
            String msg = "An unexpected problem has occurred.\nPlease contact the administrator.";
            result.put("message", msg);
            result.put("httpStatus", HttpStatus.INTERNAL_SERVER_ERROR.value());
            ret = new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
           
            LOGGER.error(e.getMessage(), e);
        }
        
        return ret;
    }

    class ServerMessage {
        private String message = "success";
        private HttpStatus httpStatus;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public ServerMessage(HttpStatus httpStatus, String message) {
            this.httpStatus = httpStatus;
            this.message = message;
        }

        @Override
        public String toString() {
            return message;
        }
    }

    private String getErrorMessageFromJsonString(String jsonString) {
        return (String) new Gson().fromJson(jsonString, JsonObject.class).get("message").getAsString();
    }
}