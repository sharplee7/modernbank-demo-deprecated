```mermaid
sequenceDiagram
    participant Client
    participant TransferController_b2bt
    participant TransferService_b2bt
    participant KafkaProducer_b2bt
    participant KafkaConsumer_b2bt
    participant AccountController_account
    participant AccountService_account
    participant KafkaProducer_account
    participant KafkaConsumer_account
    participant Database_b2bt
    participant Database_account

    Client->>TransferController_b2bt: POST /api/v1/btob/transfer
    Note right of Client: Transfer Request DTO

    TransferController_b2bt->>TransferService_b2bt: processBtoBTransfer()
    TransferService_b2bt->>Database_b2bt: Save Initial Transfer Record
    Database_b2bt-->>TransferService_b2bt: Transfer ID

    TransferService_b2bt->>KafkaProducer_b2bt: Publish to "btob-transfer-request"
    Note right of KafkaProducer_b2bt: Topic: btob-transfer-request
    
    KafkaConsumer_account->>KafkaConsumer_account: Consume from "btob-transfer-request"
    KafkaConsumer_account->>AccountService_account: validateAndProcessTransfer()
    
    AccountService_account->>Database_account: Check Source Account Balance
    Database_account-->>AccountService_account: Balance Info

    alt Valid Balance
        AccountService_account->>Database_account: Debit Source Account
        Database_account-->>AccountService_account: Debit Confirmation
        
        AccountService_account->>KafkaProducer_account: Publish to "btob-debit-success"
        Note right of KafkaProducer_account: Topic: btob-debit-success
        
        KafkaConsumer_b2bt->>KafkaConsumer_b2bt: Consume from "btob-debit-success"
        KafkaConsumer_b2bt->>TransferService_b2bt: processDebitSuccess()
        
        TransferService_b2bt->>AccountController_account: POST /api/v1/accounts/credit
        Note right of TransferService_b2bt: REST call to credit target account
        
        AccountController_account->>AccountService_account: creditAccount()
        AccountService_account->>Database_account: Credit Target Account
        Database_account-->>AccountService_account: Credit Confirmation
        AccountService_account-->>AccountController_account: Credit Result
        AccountController_account-->>TransferService_b2bt: 200 OK
        
        TransferService_b2bt->>Database_b2bt: Update Transfer Status to COMPLETED
        Database_b2bt-->>TransferService_b2bt: Update Confirmation
        
        TransferService_b2bt->>KafkaProducer_b2bt: Publish to "btob-transfer-completed"
        Note right of KafkaProducer_b2bt: Topic: btob-transfer-completed
    else Invalid Balance
        AccountService_account->>KafkaProducer_account: Publish to "btob-transfer-failed"
        Note right of KafkaProducer_account: Topic: btob-transfer-failed
        
        KafkaConsumer_b2bt->>KafkaConsumer_b2bt: Consume from "btob-transfer-failed"
        KafkaConsumer_b2bt->>TransferService_b2bt: processTransferFailure()
        TransferService_b2bt->>Database_b2bt: Update Transfer Status to FAILED
        Database_b2bt-->>TransferService_b2bt: Update Confirmation
    end

    TransferService_b2bt-->>TransferController_b2bt: Transfer Result
    TransferController_b2bt-->>Client: Transfer Response

    opt Check Transfer Status
        Client->>TransferController_b2bt: GET /api/v1/btob/transfer/{transferId}
        TransferController_b2bt->>Database_b2bt: Fetch Transfer Status
        Database_b2bt-->>TransferController_b2bt: Transfer Details
        TransferController_b2bt-->>Client: Transfer Status Response
    end