package com.modernbank.transfer.publisher;

import java.util.concurrent.CompletableFuture;

import com.modernbank.transfer.domain.entity.TransferHistory;
import com.modernbank.transfer.domain.entity.TransferLimit;
import com.modernbank.transfer.exception.SystemException;
import com.modernbank.transfer.rest.account.entity.TransactionHistory;
import com.modernbank.transfer.utils.ObjectToJsonConverter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class TransferProducer {
    
    private final Logger LOGGER = LoggerFactory.getLogger(TransferProducer.class);
    
    @Autowired
    private KafkaTemplate<String, TransferHistory> transferKafkaTemplate;
    
    @Autowired
    private KafkaTemplate<String, TransferLimit> transferLimitKafkaTemplate;

    @Value(value = "${b2b.transfer.topic.name}")
    private String b2bTransferTopicName;
    
    @Value(value = "${updating.transfer.limit.topic.name}")
    private String updatingTransferLimitTopicName;
    
    @Value(value = "${transfer.topic.name}")
    private String transferTopicName;

    @Autowired
    RestTemplate restTemplate;
    
    @Value("${account.api.url}")
    private String accountServiceUrl;

    public void sendB2BTransferMessage(TransferHistory transfer) {
        System.out.println("===> start sendB2BTransferMessage at TransferProducer\n" + ObjectToJsonConverter.convertSettersToJson(transfer) + "\n");

        CompletableFuture<SendResult<String, TransferHistory>> future = transferKafkaTemplate.send(b2bTransferTopicName, transfer);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                TransferHistory g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getCstmId() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                //보상 트랜잭션 시작

                transfer.setStsCd("2");
                System.out.println("====> Starting compensation transaction call due to inter-bank transfer failure. ");
                String wthdAcntNo = transfer.getWthdAcntNo();
                int wthdAcntSeq = transfer.getWthdAcntSeq();
                TransactionHistory transactionHistory = TransactionHistory.builder()
                    .acntNo(wthdAcntNo)
                    .seq(wthdAcntSeq)
                    .divCd("2")
                    .stsCd("2")
                    .build();
  
                restTemplate.postForObject(
                    accountServiceUrl + "/withdrawals/cancel/",
                    transactionHistory,
                    Integer.class
                );

                System.out.println("====> Ending compensation transaction call due to inter-bank transfer failure. ");

                LOGGER.error("Unable to send message=[" + transfer.getCstmId() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
    }
    
    public void sendUpdatingTansferLimitMessage(TransferLimit transferLimit) {
        System.out.println("start kafka send at transfer");
        CompletableFuture<SendResult<String, TransferLimit>> future = transferLimitKafkaTemplate.send(updatingTransferLimitTopicName, transferLimit);
        System.out.println("done kafka send at transfer");
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                TransferLimit g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getCstmId() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                LOGGER.error("Unable to send message=[" + transferLimit.getCstmId() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
        System.out.println("done... at sendUpdateTransferLimitMessage...");
    }
    
    public void sendCQRSTransferMessage(TransferHistory transfer) {
        CompletableFuture<SendResult<String, TransferHistory>> future = transferKafkaTemplate.send(transferTopicName, transfer);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                TransferHistory g = result.getProducerRecord().value();
                LOGGER.info("Sent message=[" + g.getCstmId() + "] with offset=[" + result.getRecordMetadata().offset() + "]");
            } else {
                LOGGER.error("Unable to send message=[" + transfer.getCstmId() + "] due to : " + ex.getMessage());
                throw new SystemException("Kafka data transmission error");
            }
        });
    }
}