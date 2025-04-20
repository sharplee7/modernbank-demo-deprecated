# go를 이용한 auth 작업 log 

### 1. go install
Amazon Linux 2023에서 dnf 로 설치하면 1.22 가 설치 된다. 그러나 gopls(language server) 가 go ≥ 1.23을 요구하기 때문에 설치가 되지 않아서 intellisens 가 안된다. 
따라서 아래 처럼 설치해야 한다. 

```
# go install
curl -LO https://go.dev/dl/go1.23.4.linux-amd64.tar.gz

sudo tar -C /usr/local -xzf go1.23.1.linux-amd64.tar.gz
# 환경변수 
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export GOROOT=/usr/local/go

source ~/.bashrc


# JWT
openssl rand -base64 32

# 67EL7cJ0U4OJ1wdqt+2w3Nqvy5HB9wwhx+DMsXMz9aY=

```



POST /users
{
  "user_id": "innoshome",
  "username": "inhokang",
  "password": "admin1234"
}

### Database Scheme
CREATE TABLE public.tb_user (
     USER_ID character varying(50) NOT NULL,
     PASSWORD_HASH character varying(255) NOT NULL,
     USERNAME character varying(50) ,
     SALT character varying(255) NOT NULL,
     CREATED_AT timestamp without time zone DEFAULT now()
 );

ALTER TABLE ONLY TB_USER
    ADD CONSTRAINT TB_USER_PKEY PRIMARY KEY (USER_ID);
