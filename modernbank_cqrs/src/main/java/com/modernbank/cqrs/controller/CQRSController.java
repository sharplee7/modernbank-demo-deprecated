package com.modernbank.cqrs.controller;

import com.modernbank.cqrs.domain.entity.Customer;
import com.modernbank.cqrs.service.CQRSService;
import com.modernbank.cqrs.service.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

@RestController
public class CQRSController {
    private final CQRSService cqrsService;

    public CQRSController(CQRSService cqrsService) {
        this.cqrsService = cqrsService;
    }
    
    @Operation(summary = "Retrieve customer details", method = "GET", description = "Get detailed information about a specific customer")
    @GetMapping("/customers/{cstmId}/details")
    public Customer retrieveCustomerDetail(@PathVariable("cstmId") String cstmId) throws Exception {
        return cqrsService.retrieveCustomerDetail(cstmId);
    }

    @Autowired
    private CustomerService customerService;

    @PostMapping("/customer")
    public com.modernbank.cqrs.domain.dynamo.Customer saveCustomer(@RequestBody com.modernbank.cqrs.domain.dynamo.Customer customer) {
        return customerService.saveCustomer(customer);
    }

    @GetMapping("/customer/{id}")
    public com.modernbank.cqrs.domain.dynamo.Customer getCustomerById(@PathVariable("id") String customerId) {
        return customerService.getCustomerById(customerId);
    }

    @DeleteMapping("/customer/{id}")
    public String deleteCustomerById(@PathVariable("id") String customerId) {
        return  customerService.deleteCustomerById(customerId);
    }

    @PutMapping("/customer")
    public String updateCustomer(@RequestBody com.modernbank.cqrs.domain.dynamo.Customer customer) {
        return customerService.updateCustomer(customer);
    }
}