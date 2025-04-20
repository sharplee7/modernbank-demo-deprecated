package com.modernbank.cqrs.exception;


import org.springframework.http.HttpStatus;

public class SystemException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	private String message;
    private HttpStatus httpStatus;

    public SystemException(Exception e) {
        this(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public SystemException(String message) {
        this(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public SystemException(String message, HttpStatus httpStatus) {
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
