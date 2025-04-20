package com.modernbank.account.publisher;

import java.util.concurrent.CompletableFuture;

import com.modernbank.account.domain.entity.Account;
import com.modernbank.account.domain.entity.TransactionHistory;
import com.modernbank.account.exception.SystemException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Component
public class AccountProducer {

    private final Logger LOGGER = LoggerFactory.getLogger(AccountProducer.class);
	
    @Autowired
    private KafkaTemplate<String, Account> accountKafkaTemplate;
    
    @Autowired
    private KafkaTemplate<String, TransactionHistory> transactionKafkaTemplate;
    
    @Value(value = "${creating.account.topic.name}")
    private String creatingAccountTopicName;
    
    @Value(value = "${updating.account.balance.topic.name}")
    private String updatingAccountBalanceTopicName;
    
    @Value(value = "${transaction.topic.name}")
    private String transactionTopicName;
    
    public void sendCreatingAccountMessage(Account account) {
        CompletableFuture<SendResult<String, Account>> future = accountKafkaTemplate.send(creatingAccountTopicName, account);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                Account g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getAcntNo() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                LOGGER.error("Unable to send message=[" + account.getAcntNo() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
    }
    
    public void sendUpdatingAccountBalanceMessage(Account account) {
        CompletableFuture<SendResult<String, Account>> future = accountKafkaTemplate.send(updatingAccountBalanceTopicName, account);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                Account g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getAcntNo() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                LOGGER.error("Unable to send message=[" + account.getAcntNo() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
    }
    
    public void sendTransactionMessage(TransactionHistory transaction) {
        CompletableFuture<SendResult<String, TransactionHistory>> future = transactionKafkaTemplate.send(transactionTopicName, transaction);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                TransactionHistory g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getAcntNo() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                LOGGER.error("Unable to send message=[" + transaction.getAcntNo() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
    }

}