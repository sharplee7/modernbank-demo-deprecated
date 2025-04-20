#!/bin/bash

# Log 파일 설정
LOGFILE="/var/log/modernbank-setup.log"
exec > >(tee -a ${LOGFILE}) 2>&1

# 시스템 업데이트
echo "Updating system packages..."
yum update -y

# Git 설치
echo "Installing Git..."
yum install -y git

# Node.js 20 설치
echo "Installing Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Node.js 버전 확인
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

# 앱 디렉토리 생성
APP_DIR="/opt/modernbank-ui"
echo "Creating application directory: ${APP_DIR}"
mkdir -p ${APP_DIR}

# Git 리포지토리에서 코드 클론
echo "Cloning the repository..."
REPO_URL="GIT_REPOSITORY_URL" # 실제 Git 리포지토리 URL로 변경해주세요
git clone ${REPO_URL} ${APP_DIR}

# 앱 디렉토리로 이동
cd ${APP_DIR}

# 의존성 패키지 설치
echo "Installing dependencies..."
npm ci

# 환경 변수 파일 생성 (필요한 경우)
echo "Creating .env.production file..."
cat > .env.production << EOL
# 공통 API 기본 URL
NEXT_PUBLIC_API_BASE_URL={ALB 주소가 들어가야 함}

# 서비스별 엔드포인트
NEXT_PUBLIC_AUTH=\${NEXT_PUBLIC_API_BASE_URL}/user
NEXT_PUBLIC_CUSTOMER=\${NEXT_PUBLIC_API_BASE_URL}/customer
NEXT_PUBLIC_TRANSFER=\${NEXT_PUBLIC_API_BASE_URL}/transfer
NEXT_PUBLIC_ACCOUNT=\${NEXT_PUBLIC_API_BASE_URL}/account
NEXT_PUBLIC_CQRS=\${NEXT_PUBLIC_API_BASE_URL}/cqrs
NEXT_PUBLIC_PRODUCT=\${NEXT_PUBLIC_API_BASE_URL}/product
EOL

# 앱 빌드
echo "Building Next.js application..."
npm run build

# systemd 서비스 파일 생성
echo "Creating systemd service..."
cat > /etc/systemd/system/modernbank-ui.service << EOL
[Unit]
Description=ModernBank UI Next.js Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOL

# systemd 서비스 활성화 및 시작
echo "Enabling and starting systemd service..."
systemctl daemon-reload
systemctl enable modernbank-ui.service
systemctl start modernbank-ui.service

# 서비스 상태 확인
echo "Service status:"
systemctl status modernbank-ui.service

