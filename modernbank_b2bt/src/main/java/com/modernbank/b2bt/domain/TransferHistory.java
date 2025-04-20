package com.modernbank.b2bt.domain;

import java.io.Serializable;

import lombok.Data;

@Data
public class TransferHistory implements Serializable{
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
    
}
