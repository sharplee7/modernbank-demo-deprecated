package com.modernbank.transfer.domain.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class TransferHistory {
    private String cstmId;
    private int seq;
    private String divCd;
    private String stsCd;
    private String dpstAcntNo;
    private String wthdAcntNo;
    private int wthdAcntSeq;
    private String sndMm;
    private String rcvMm;
    private String rcvCstmNm;
    private Long trnfAmt;
    private String trnfDtm;
    
    @Builder
	public TransferHistory(String cstmId, int seq, String divCd, String stsCd, String dpstAcntNo, String wthdAcntNo,
			int wthdAcntSeq, String sndMm, String rcvMm, String rcvCstmNm, Long trnfAmt, String trnfDtm) {
		super();
		this.cstmId = cstmId;
		this.seq = seq;
		this.divCd = divCd;
		this.stsCd = stsCd;
		this.dpstAcntNo = dpstAcntNo;
		this.wthdAcntNo = wthdAcntNo;
		this.wthdAcntSeq = wthdAcntSeq;
		this.sndMm = sndMm;
		this.rcvMm = rcvMm;
		this.rcvCstmNm = rcvCstmNm;
		this.trnfAmt = trnfAmt;
		this.trnfDtm = trnfDtm;
	}
}

