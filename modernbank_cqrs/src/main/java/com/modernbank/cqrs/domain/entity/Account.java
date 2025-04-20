package com.modernbank.cqrs.domain.entity;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class Account implements Serializable {
	private String acntNo;
	private String cstmId;
	private String cstmNm;
	private String acntNm;
	private String newDtm;
	private Long acntBlnc;

	@Builder
	public Account(String acntNo, String cstmId, String cstmNm, String acntNm, String newDtm, Long acntBlnc) {
		super();
		this.acntNo = acntNo;
		this.cstmId = cstmId;
		this.cstmNm = cstmNm;
		this.acntNm = acntNm;
		this.newDtm = newDtm;
		this.acntBlnc = acntBlnc;
	}

}
