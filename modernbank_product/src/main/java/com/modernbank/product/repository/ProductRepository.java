package com.modernbank.product.repository;

import java.util.List;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.modernbank.product.model.Product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ProductRepository {
   @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public Product save(Product product) {
        dynamoDBMapper.save(product);
        return product;
    }

    public Product findProductById(String productId) {
        return dynamoDBMapper.load(Product.class, productId);
    }

    public String deleteProductById(String productId) {
        dynamoDBMapper.delete(dynamoDBMapper.load(Product.class, productId));
        return "Product Id : "+ productId +" Deleted!";
    }

    public String updateProudctById(Product product) {
        dynamoDBMapper.save(product,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(product.getId())
                                )));
        return product.getId();
    }
    
    public List<Product> findAll() {
        return dynamoDBMapper.scan(Product.class, new DynamoDBScanExpression());
    }
}
