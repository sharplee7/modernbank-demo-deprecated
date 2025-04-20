package com.modernbank.cqrs.domain.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class Customer implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private String cstmId;
    private String cstmNm;
    private String cstmAge;
    private String cstmGnd;
    private String cstmPn;
    private String cstmAdr;
    
    /* Transfer limit information */
    private Long oneTmTrnfLmt;
    private Long oneDyTrnfLmt;
    
    /* Account list */
    private List<Account> accounts = new ArrayList<>();
    
	public void addAllAccounts(List<Account> accounts) {
		this.accounts.addAll(accounts);
	}

	@Builder
	public Customer(String cstmId, String cstmNm, String cstmAge, String cstmGnd, String cstmPn, String cstmAdr,
			Long oneTmTrnfLmt, Long oneDyTrnfLmt) {
		super();
		this.cstmId = cstmId;
		this.cstmNm = cstmNm;
		this.cstmAge = cstmAge;
		this.cstmGnd = cstmGnd;
		this.cstmPn = cstmPn;
		this.cstmAdr = cstmAdr;
		this.oneTmTrnfLmt = oneTmTrnfLmt;
		this.oneDyTrnfLmt = oneDyTrnfLmt;
	}
}