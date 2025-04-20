package com.modernbank.cqrs.service;

import com.modernbank.cqrs.domain.entity.Account;
import com.modernbank.cqrs.domain.entity.Customer;

public interface CQRSService {
    public Customer retrieveCustomerDetail(String cstmId) throws Exception;
    public int createCustomer(Customer customer) throws Exception;
    public int createAccount(Account account) throws Exception;
    public int updateTransferLimit(Customer customer) throws Exception;
    public int updateAccountBalance(Account account) throws Exception;

}
