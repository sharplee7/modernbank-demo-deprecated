package com.modernbank.customer.rest.transfer.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@Data
public class TransferLimit {
    private String cstmId;
    private Long oneTmTrnfLmt;
    private Long oneDyTrnfLmt;
    
    @Builder
	public TransferLimit(String cstmId, Long oneTmTrnfLmt, Long oneDyTrnfLmt) {
		super();
		this.cstmId = cstmId;
		this.oneTmTrnfLmt = oneTmTrnfLmt;
		this.oneDyTrnfLmt = oneDyTrnfLmt;
	}
}
