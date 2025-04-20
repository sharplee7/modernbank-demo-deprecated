package com.modernbank.account.rest.customer;

import com.modernbank.account.exception.SystemException;
import com.modernbank.account.rest.customer.entity.Customer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service("customerComposite")
public class CustomerComposite {

    private static Logger LOGGER = LoggerFactory.getLogger(CustomerComposite.class);
	
    @Value("${customer.api.url}")
    private String CUSTOMER_API_URL;
    
    @Autowired
    private final RestTemplate restTemplate;
    
    public CustomerComposite(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Customer retrieveCustomer(String cstmId) throws SystemException {
        String apiUrl =  "/{cstmId}";
        Customer customer = null;
        try {
            customer = this.restTemplate.getForObject(CUSTOMER_API_URL + apiUrl, Customer.class, cstmId);
        } catch (Exception e) {
            throw new SystemException("There is an issue with the RESTful call to Customer Service for retrieving customer information while creating a new account in Account Service." + e.getMessage());
        }

        return customer;
    }

    public Customer fallbackRetriveCustomer(String cstmId, Throwable t) throws Exception {
        String msg = "There is a problem calling the customer information retrieval service for " + cstmId + " using restTemplate.";
        LOGGER.error(msg, t);
        throw new Exception();
    }
}