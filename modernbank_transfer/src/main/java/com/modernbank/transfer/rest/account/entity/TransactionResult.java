package com.modernbank.transfer.rest.account.entity;

import lombok.Data;

@Data
public class TransactionResult {
	private String acntNo;
	private int seq;
	private Long formerBlnc;
	private Long trnsAmt;
	private Long acntBlnc;
}
