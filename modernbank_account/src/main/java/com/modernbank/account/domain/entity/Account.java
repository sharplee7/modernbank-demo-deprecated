package com.modernbank.account.domain.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class Account {

   private String acntNo;
   private String cstmId;
   private String cstmNm;
   private String acntNm;
   private String newDtm;
   private Long acntBlnc;

   @Builder
   public Account(String acntNo, String cstmId, String cstmNm, String acntNm, String newDtm, Long acntBlnc) {
      this.acntNo = acntNo;
      this.cstmId = cstmId;
      this.cstmNm = cstmNm;
      this.acntNm = acntNm;
      this.newDtm = newDtm;
      this.acntBlnc = acntBlnc;
   }

   public static Account ofAcntNo(String acntNo) {
      return Account.builder()
              .acntNo(acntNo).build();
   }

   public static Account ofCstmId(String cstmId) {
      return Account.builder()
              .cstmId(cstmId).build();
   }

   public static Account of(String acntNo, Long acntBlnc) {
      return Account.builder()
              .acntNo(acntNo)
              .acntBlnc(acntBlnc).build();
   }
}
