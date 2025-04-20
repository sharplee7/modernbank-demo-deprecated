package com.modernbank.cqrs.domain.entity;

import java.io.Serializable;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class RecentWork implements Serializable {
	
    private String cstmId;
    private String cstmNm;
    private String rcntWorkDivCd;
    private String rcntWorkDtm;
    private String workAcntNo;
    private Long workTrnsAmt;
    private String workStsCd;
    
    @Builder
	public RecentWork(String cstmId, String cstmNm, String rcntWorkDivCd, String rcntWorkDtm, String workAcntNo,
			Long workTrnsAmt, String workStsCd) {
		super();
		this.cstmId = cstmId;
		this.cstmNm = cstmNm;
		this.rcntWorkDivCd = rcntWorkDivCd;
		this.rcntWorkDtm = rcntWorkDtm;
		this.workAcntNo = workAcntNo;
		this.workTrnsAmt = workTrnsAmt;
		this.workStsCd = workStsCd;
	}
}
