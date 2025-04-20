package com.modernbank.cqrs.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {
    private String message;
    private HttpStatus httpStatus;

    public BusinessException(String message) {
        this(message, HttpStatus.EXPECTATION_FAILED);
    }

    public BusinessException(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getMessage() {
        return this.message;
    }

    public HttpStatus getHttpStatus() {

        return httpStatus;
    }
}
