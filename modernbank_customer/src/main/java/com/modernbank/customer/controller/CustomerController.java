package com.modernbank.customer.controller;


import com.modernbank.customer.domain.entity.Customer;
import com.modernbank.customer.service.CustomerService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.annotation.Resource;

@RestController
public class CustomerController {

    @Resource(name = "customerService")
    private CustomerService customerService;
    
    @Operation(summary = "Customer Registration", method = "POST", description = "Register a new customer")
    @RequestMapping(method = RequestMethod.POST, path = "/")
    public Integer createCustomer(@RequestBody Customer customer) throws Exception{
        System.out.println("-----> 1.Controller request...");
         return customerService.createCustomer(customer);
    }

    @Operation(summary = "Basic Customer Information Retrieval", method = "GET", description = "Retrieve basic customer information")
    @RequestMapping(method = RequestMethod.GET, path = "/{cstmId}")
    public Customer retrieveCustomer(@PathVariable(name = "cstmId") String cstmId) throws Exception{
        return customerService.retrieveCustomer(cstmId);
    }

    @Operation(summary = "Detailed Customer Information Retrieval", method = "GET", description = "Retrieve detailed customer information")
    @RequestMapping(method = RequestMethod.GET, path = "/{cstmId}/details")
    public Customer retrieveCustomerDetail(@PathVariable(name = "cstmId") String cstmId) throws Exception{
        return customerService.retrieveCustomerDetail(cstmId);
    }

    @Operation(summary = "Check Customer Existence", method = "GET", description = "Check if a customer exists")
    @RequestMapping(method = RequestMethod.GET, path ="/{cstmId}/exists")
    public Boolean existsCustomerId(@PathVariable(name = "cstmId") String cstmId) throws Exception{
    	return customerService.existsCustomerId(cstmId);
    }
    
}
