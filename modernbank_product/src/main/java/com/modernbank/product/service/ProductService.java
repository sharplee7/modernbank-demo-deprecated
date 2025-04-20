package com.modernbank.product.service;

import java.util.List;

import com.modernbank.product.model.Product;
import com.modernbank.product.repository.ProductRepository;

import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    /**
     * 계좌 상품 저장
     */
    public void saveProduct(Product product) {
        repository.save(product);
    }

    /**
     * 특정 ID의 계좌 상품 조회
     */
    public Product findProductById(String id) {
        return repository.findProductById(id);
    }

    /**
     * 모든 계좌 상품 조회
     */
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    /**
     * 계좌 상품 삭제
     */
    public String deleteProductById(String id) {
        return repository.deleteProductById(id);
    }

    /**
     * 계좌 상품 수정
     * @param product
     * @return
     */
    public String updateProductById(Product product) {
        return repository.updateProudctById(product);
    }
}
