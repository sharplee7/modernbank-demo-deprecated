# 최소한의 JDK 환경
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# 내부 포트와 외부 포트를 동일하게 8081로 설정
EXPOSE 8081

# JAR 파일 복사
COPY ./build/libs/modernbank_account-0.0.1-SNAPSHOT.jar modernbank_account.jar

# 실행 환경 최적화
ENV JAVA_OPTS="-XX:+UseG1GC -XX:+AlwaysPreTouch -XX:+UseStringDeduplication -Djava.security.egd=file:/dev/./urandom"
ENV SERVER_PORT=8081

# 컨테이너 내부에서도 8081에서 실행하도록 설정
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/modernbank_account.jar --server.port=8081"]
