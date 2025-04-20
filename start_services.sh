#!/bin/bash

# start_services.sh
echo "Starting all Modern Bank services..."

# modernbank_account 실행
echo "Starting modernbank_account..."
cd /home/ec2-user/workspace/modern-bank/modernbank_account
nohup java -jar build/libs/modernbank_account-0.0.1-SNAPSHOT.jar > build/libs/console.log 2>&1 &
echo $! > service.pid

# modernbank_b2bt 실행
echo "Starting modernbank_b2bt..."
cd /home/ec2-user/workspace/modern-bank/modernbank_b2bt
nohup java -jar build/libs/modernbank_b2bt-0.0.1-SNAPSHOT.jar > build/libs/console.log 2>&1 &
echo $! > service.pid

# modernbank_cqrs 실행
echo "Starting modernbank_cqrs..."
cd /home/ec2-user/workspace/modern-bank/modernbank_cqrs
nohup java -jar build/libs/modernbank_cqrs-0.0.1-SNAPSHOT.jar > build/libs/console.log 2>&1 &
echo $! > service.pid

# modernbank_customer 실행
echo "Starting modernbank_customer..."
cd /home/ec2-user/workspace/modern-bank/modernbank_customer
nohup java -jar build/libs/modernbank_customer-0.0.1-SNAPSHOT.jar > build/libs/console.log 2>&1 &
echo $! > service.pid

# modernbank_transfer 실행
echo "Starting modernbank_transfer..."
cd /home/ec2-user/workspace/modern-bank/modernbank_transfer
nohup java -jar build/libs/modernbank_transfer-0.0.1-SNAPSHOT.jar > build/libs/console.log 2>&1 &
echo $! > service.pid

# modernbank_product 실행
echo "Starting modernbank_product..."
cd /home/ec2-user/workspace/modern-bank/modernbank_product
nohup java -jar build/libs/modernbank_product-0.0.1-SNAPSHOT.jar > build/libs/console.log 2>&1 &
echo $! > service.pid

# modernbank_user 실행 (Go 프로그램)
echo "Starting modernbank_user..."
cd /home/ec2-user/workspace/modern-bank/modernbank_user
nohup ./bank-user > console.log 2>&1 &
echo $! > service.pid

echo "All services started. Check console.log in each service directory for logs"
