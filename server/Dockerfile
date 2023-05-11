# 베이스 이미지
FROM node:18.14.2

# 작업 디렉토리
WORKDIR /app/server

# 현재 디렉토리의 모든 파일을 복사
COPY package*.json ./

# Install the dependencies
RUN npm install && npm cache clean --force

# 포트
EXPOSE 8080

# 실행 명령어
CMD ["node", "index.js"]
