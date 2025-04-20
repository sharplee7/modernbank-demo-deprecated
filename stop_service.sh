#!/bin/bash

# stop_services.sh
echo "Stopping all Modern Bank services..."

SERVICES=(
    "/home/ec2-user/workspace/modern-bank/modernbank_account"
    "/home/ec2-user/workspace/modern-bank/modernbank_b2bt"
    "/home/ec2-user/workspace/modern-bank/modernbank_cqrs"
    "/home/ec2-user/workspace/modern-bank/modernbank_customer"
    "/home/ec2-user/workspace/modern-bank/modernbank_transfer"
    "/home/ec2-user/workspace/modern-bank/modernbank_product"
    "/home/ec2-user/workspace/modern-bank/modernbank_user"
)

for service_path in "${SERVICES[@]}"; do
    if [ -f "$service_path/service.pid" ]; then
        PID=$(cat "$service_path/service.pid")
        echo "Stopping service in $service_path (PID: $PID)..."
        kill $PID
        rm "$service_path/service.pid"
    fi
done

echo "All services stopped"
