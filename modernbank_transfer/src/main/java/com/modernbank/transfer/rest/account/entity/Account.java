package com.modernbank.transfer.rest.account.entity;

import lombok.Data;

@Data
public class Account {
   private String acntNo;
   private String cstmId;
   private String cstmNm;
   private String acntNm;
   private String newDtm;
   private Long acntBlnc;
}
