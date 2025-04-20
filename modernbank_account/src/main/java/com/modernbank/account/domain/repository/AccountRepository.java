package com.modernbank.account.domain.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.modernbank.account.domain.entity.Account;
import com.modernbank.account.domain.entity.TransactionHistory;

@Mapper
public interface AccountRepository {
    int insertAccount(Account account) throws Exception;
    Account selectAccount(Account account) throws Exception;
    List<Account> selectAccountList(Account account) throws Exception;
    int insertTransactionHistoryData(TransactionHistory transactionHistory) throws Exception;
    List<TransactionHistory> selectTransactionHistoryList(TransactionHistory transactionHistory) throws Exception;
    Long selectCurrentAccountBalance(TransactionHistory transactionHistory) throws Exception;
    int updateTransactionHistory(TransactionHistory transactionHistory) throws Exception;
    int selectMaxSeq(TransactionHistory transactionHistory) throws Exception;
}
