package com.modernbank.product.config;

import com.amazonaws.auth.WebIdentityTokenCredentialsProvider;
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DynamoDBConfig {

    @Value("${aws.dynamodb.endpoint:}") // 환경 변수 또는 프로퍼티에서 엔드포인트 가져오기 (없으면 빈 값)
    private String endPoint;

    @Value("${aws.region:ap-northeast-2}") // 기본 리전 설정
    private String region;

    private static final Logger logger = LoggerFactory.getLogger(DynamoDBConfig.class);

    @Bean
    public DynamoDBMapper dynamoDBMapper() {
        DynamoDBMapperConfig mapperConfig = DynamoDBMapperConfig.builder()
                .withSaveBehavior(DynamoDBMapperConfig.SaveBehavior.CLOBBER)
                .withConsistentReads(DynamoDBMapperConfig.ConsistentReads.CONSISTENT)
                .withTableNameOverride(null)
                .withPaginationLoadingStrategy(DynamoDBMapperConfig.PaginationLoadingStrategy.EAGER_LOADING)
                .build();

        return new DynamoDBMapper(amazonDynamoDB(), mapperConfig);
    }

    @Bean
    public AmazonDynamoDB amazonDynamoDB() {
        AmazonDynamoDBClientBuilder builder = AmazonDynamoDBClientBuilder.standard();

        if (endPoint != null && !endPoint.isEmpty() && endPoint.equals("http://localhost:8000")) {
            // 로컬 DynamoDB 사용 (IAM 인증 없음)
            logger.info("Using Local DynamoDB at {}", endPoint);
            builder.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, region));
        } else {
            // AWS Public Endpoint 사용 (IRSA 적용)
            logger.info("Using AWS DynamoDB in region: {}", region);
            builder.withRegion(region);
            builder.withCredentials(WebIdentityTokenCredentialsProvider.create()); // IRSA 적용
        }

        return builder.build();
    }
}
