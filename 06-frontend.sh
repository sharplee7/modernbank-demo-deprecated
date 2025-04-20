#!/bin/bash

# Variables
AMI_ID="ami-0d5bb3742db8fc264" # Replace with the appropriate Ubuntu AMI ID for your region
INSTANCE_TYPE="c5.xlarge"

# Fetch the VPC ID
VPC_ID=$(aws ec2 describe-vpcs --query 'Vpcs[0].VpcId' --output text)

# Create a new security group
SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name modernbank-sg --description "Security group for ModernBank UI" --vpc-id $VPC_ID --query 'GroupId' --output text)

# Set security group rules to allow inbound traffic on port 3000 and 22
aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 3000 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 22 --cidr 0.0.0.0/0

# Fetch the Ingress address
INGRESS_ADDRESS=$(kubectl get ingress -n modernbank -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}')

# Fetch a public subnet ID from the VPC
SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" "Name=map-public-ip-on-launch,Values=true" --query 'Subnets[0].SubnetId' --output text)

# Create EC2 instance
aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --security-group-ids $SECURITY_GROUP_ID \
    --subnet-id $SUBNET_ID \
    --associate-public-ip-address \
    --user-data file://<(cat <<'EOF'
#!/bin/bash

# Log file setup
LOGFILE="/var/log/modernbank-setup.log"
exec > >(tee -a ${LOGFILE}) 2>&1

# Update system packages
echo "Updating system packages..."
apt-get update -y && apt-get upgrade -y

# Install Git
echo "Installing Git..."
apt-get install -y git

# Install Node.js 20
echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Check Node.js version
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

# Create application directory
APP_DIR="/opt/modernbank-ui"
echo "Creating application directory: ${APP_DIR}"
mkdir -p ${APP_DIR}

# Clone the repository
echo "Cloning the repository..."
REPO_URL="GIT_REPOSITORY_URL" # Replace with the actual Git repository URL
git clone ${REPO_URL} ${APP_DIR}

# Move to application directory
cd ${APP_DIR}

# Install dependencies
echo "Installing dependencies..."
npm ci

# Create environment variable file
echo "Creating .env.production file..."
cat > .env.production << EOL
# Common API base URL
NEXT_PUBLIC_API_BASE_URL=${INGRESS_ADDRESS}

# Service endpoints
NEXT_PUBLIC_AUTH=\${NEXT_PUBLIC_API_BASE_URL}/user
NEXT_PUBLIC_CUSTOMER=\${NEXT_PUBLIC_API_BASE_URL}/customer
NEXT_PUBLIC_TRANSFER=\${NEXT_PUBLIC_API_BASE_URL}/transfer
NEXT_PUBLIC_ACCOUNT=\${NEXT_PUBLIC_API_BASE_URL}/account
NEXT_PUBLIC_CQRS=\${NEXT_PUBLIC_API_BASE_URL}/cqrs
NEXT_PUBLIC_PRODUCT=\${NEXT_PUBLIC_API_BASE_URL}/product
EOL

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Create systemd service file
echo "Creating systemd service..."
cat > /etc/systemd/system/modernbank-ui.service << EOL
[Unit]
Description=ModernBank UI Next.js Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOL

# Enable and start systemd service
echo "Enabling and starting systemd service..."
systemctl daemon-reload
systemctl enable modernbank-ui.service
systemctl start modernbank-ui.service

# Check service status
echo "Service status:"
systemctl status modernbank-ui.service
EOF
)
