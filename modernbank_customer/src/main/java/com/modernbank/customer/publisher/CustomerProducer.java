package com.modernbank.customer.publisher;

import java.util.concurrent.CompletableFuture;

import com.modernbank.customer.domain.entity.Customer;
import com.modernbank.customer.exception.SystemException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Component
public class CustomerProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(CustomerProducer.class);

    @Autowired
    private KafkaTemplate<String, Customer> customerKafkaTemplate;

    @Value(value = "${creating.customer.topic.name}")
    private String creatingCustomerTopicName;

    public void sendCreatingCustomerMessage(Customer customer) {
        CompletableFuture<SendResult<String, Customer>> future = customerKafkaTemplate.send(creatingCustomerTopicName, customer);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                Customer g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getCstmId() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                LOGGER.error("Unable to send message=[" + customer.getCstmId() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
    }
}