package com.modernbank.account.domain.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Builder
public class TransactionHistory {

    private String acntNo;
    private int seq;
    private String divCd; // Transaction type code D:Deposit, W:Withdrawal
    @Builder.Default
    private String stsCd = "0"; // Transaction status 0:In Progress, 1:Success, 2:Failure
    private Long trnsAmt; // Transaction amount
    private Long acntBlnc; // Account balance
    private String trnsBrnch; // Transaction branch
    private String trnsDtm; // Transaction date and time

    @Builder
    public TransactionHistory(String acntNo, int seq, String divCd, String stsCd, Long trnsAmt, Long acntBlnc, String trnsBrnch, String trnsDtm) {
        this.acntNo = acntNo;
        this.seq = seq;
        this.divCd = divCd;
        this.stsCd = stsCd;
        this.trnsAmt = trnsAmt;
        this.acntBlnc = acntBlnc;
        this.trnsBrnch = trnsBrnch;
        this.trnsDtm = trnsDtm;
    }

    public static TransactionHistory ofAcntNo(String acntNo) {
        return TransactionHistory.builder().acntNo(acntNo).build();
    }
}