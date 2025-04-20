package com.modernbank.customer.domain.repository;

import org.apache.ibatis.annotations.Mapper;

import com.modernbank.customer.domain.entity.Customer;

@Mapper
public interface CustomerRepository {
    int insertCustomer(Customer customer) throws Exception;
    int deleteCustomer(Customer customer) throws Exception;
    Customer selectCustomer(Customer customer) throws Exception;
    int existsCustomer(Customer customer) throws Exception;
}
