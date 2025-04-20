package com.modernbank.cqrs.service;
import com.modernbank.cqrs.domain.dynamo.Customer;
import com.modernbank.cqrs.domain.dynamo.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public Customer saveCustomer(Customer customer) {
        return customerRepository.saveCustomer(customer);
    }

    public Customer getCustomerById(String customerId) {
        return customerRepository.getCustomerById(customerId);
    }

    public String deleteCustomerById(String customerId) {
        return  customerRepository.deleteCustomerById(customerId);
    }

    public String updateCustomer(Customer customer) {
        return customerRepository.updateCustomer(customer);
    }
}