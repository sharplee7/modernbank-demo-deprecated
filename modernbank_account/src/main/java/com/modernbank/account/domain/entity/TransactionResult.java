package com.modernbank.account.domain.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TransactionResult {
	private String acntNo;
	private int seq;
	private Long formerBlnc;
	private Long trnsAmt;
	private Long acntBlnc;

	@Builder
	public TransactionResult(String acntNo, int seq, Long formerBlnc, Long trnsAmt, Long acntBlnc) {
		this.acntNo = acntNo;
		this.seq = seq;
		this.formerBlnc = formerBlnc;
		this.trnsAmt = trnsAmt;
		this.acntBlnc = acntBlnc;
	}
}
