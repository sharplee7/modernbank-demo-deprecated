```mermaid
sequenceDiagram
    participant Client
    participant AccountController
    participant AccountService
    participant KafkaProducer
    participant KafkaConsumer
    participant ExternalBankAPI
    participant Database

    Client->>AccountController: POST /withdrawals/ (TransactionHistory)
    Note over AccountController: Logs DivCd and StatusCd
    AccountController->>AccountService: withdrawOwnBankOrTransferOtherBank()
    
    alt Internal Bank Transfer
        AccountService->>Database: Check Account Balance
        Database-->>AccountService: Balance Info
        AccountService->>Database: Update Account Balance
        Database-->>AccountService: Update Confirmation
        AccountService->>Database: Save Transaction History
        Database-->>AccountService: Save Confirmation
    else External Bank Transfer
        AccountService->>KafkaProducer: Publish Withdrawal Request
        KafkaProducer->>KafkaConsumer: Transfer Message
        KafkaConsumer->>ExternalBankAPI: REST Call for External Transfer
        ExternalBankAPI-->>KafkaConsumer: Transfer Response
        KafkaConsumer->>KafkaProducer: Publish Transfer Status
        KafkaProducer->>AccountService: Update Transfer Status
        AccountService->>Database: Update Transaction Status
        Database-->>AccountService: Update Confirmation
    end

    AccountService-->>AccountController: TransactionResult
    AccountController-->>Client: TransactionResult

    Note over Client,Database: External Transfer Confirmation Flow
    Client->>AccountController: POST /withdrawals/confirm/
    AccountController->>AccountService: confirmWithdrawalForExternalTransfer()
    AccountService->>Database: Update Transaction Status
    Database-->>AccountService: Confirmation
    AccountService-->>AccountController: Status Code
    AccountController-->>Client: Status Code