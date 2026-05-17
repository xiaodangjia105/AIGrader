# ai_grader 鈥?AI 浣滀笟鎵规敼骞冲彴

鍩轰簬 AI 鐨勪腑灏忓浣滀笟鎵规敼骞冲彴锛岃鐩?**鏁欏笀甯冪疆 鈫?AI 绉掔骇鎵规敼 鈫?瀛︾敓鍗虫椂璁㈡ 鈫?鏁欏笀澶嶆牳** 鐨勫畬鏁撮棴鐜€?
## 鎶€鏈爤

| 灞傜骇 | 鎶€鏈?|
|---|---|
| 鍚庣妗嗘灦 | Spring Boot 3.4 + Java 21 + Maven |
| AI 寮曟搸 | Spring AI + DeepSeek (`deepseek-chat`) |
| 鏁版嵁搴?| PostgreSQL 16 + pgvector 鎵╁睍 |
| 缂撳瓨/闃熷垪 | Redis 7 |
| 瀵硅薄瀛樺偍 | MinIO锛堝悗缁墿灞曪級 |
| 鍓嶇妗嗘灦 | React 18 + Vite + TypeScript |
| UI 缁勪欢 | Ant Design 5 |
| 鐘舵€佺鐞?| Zustand |

## 蹇€熷紑濮?
### 鐜瑕佹眰

- Java 21+
- Node.js 24+ & pnpm
- Maven 3.9+
- PostgreSQL 16锛堥渶鍚敤 pgvector 鎵╁睍锛?- Redis 7

### 1. 鍒涘缓鏁版嵁搴?
```bash
psql -h 10.237.255.9 -U nvc -d nvc_practice -c "CREATE DATABASE ai_grader;"
psql -h 10.237.255.9 -U nvc -d ai_grader -c "CREATE USER ai_grader WITH PASSWORD 'ai_grader123'; GRANT ALL ON DATABASE ai_grader TO ai_grader;"
```

### 2. 鍚姩鍚庣

```bash
cd backend

# 璁剧疆 DeepSeek API Key锛堝繀椤伙級
set DEEPSEEK_API_KEY=sk-your-key-here

# 缂栬瘧骞跺惎鍔紙棣栨鍚姩浼氳嚜鍔ㄥ缓琛級
mvn spring-boot:run
```

鍚庣鍚姩鍚庤闂細http://localhost:8080

### 3. 瀵煎叆绉嶅瓙鏁版嵁

```bash
psql -h 10.237.255.9 -U ai_grader -d ai_grader -f backend/src/main/resources/data.sql
```

绉嶅瓙鏁版嵁鍖呭惈锛?- 6 涓?Demo 鐢ㄦ埛锛? 鏁欏笀 + 3 瀛︾敓 + 1 绠＄悊鍛橈級
- 2 涓彮绾?- 10 閬撻鐩紙閫夋嫨/鍒ゆ柇/濉┖/绠€绛?浣滄枃锛?
### 4. 鍚姩鍓嶇

```bash
cd frontend
pnpm install
pnpm dev
```

璁块棶锛歨ttp://localhost:5173

## Demo 璐︽埛

| 鐢ㄦ埛鍚?| 瑙掕壊 | 鏄电О |
|---|---|---|
| `teacher_zhang` | 鏁欏笀 | 寮犺€佸笀锛堟暟瀛︼級 |
| `teacher_li` | 鏁欏笀 | 鏉庤€佸笀锛堣鏂囷級 |
| `student_xiao` | 瀛︾敓 | 灏忔槑 |
| `student_hong` | 瀛︾敓 | 灏忕孩 |
| `student_gang` | 瀛︾敓 | 灏忓垰 |
| `admin` | 绠＄悊鍛?| 绠＄悊鍛?|

## 椤圭洰缁撴瀯

```
ai_grader/
鈹溾攢鈹€ AGENTS.md              # AI 鍗忎綔瑙勮寖
鈹溾攢鈹€ PRD.md                 # 浜у搧闇€姹傛枃妗?鈹溾攢鈹€ DEVELOPMENT_PLAN.md    # 寮€鍙戣鍒?鈹溾攢鈹€ README.md              # 鏈枃浠?鈹溾攢鈹€ backend/               # Spring Boot 鍚庣锛?2 涓?Java 鏂囦欢锛?鈹?  鈹溾攢鈹€ pom.xml
鈹?  鈹斺攢鈹€ src/main/java/com/ai_grader/
鈹?      鈹溾攢鈹€ ai_graderApplication.java
鈹?      鈹溾攢鈹€ ai/             # AI 鎵规敼寮曟搸锛? 绉嶇瓥鐣ワ級
鈹?      鈹溾攢鈹€ controller/     # REST 鎺у埗鍣紙5 涓級
鈹?      鈹溾攢鈹€ service/        # 涓氬姟鏈嶅姟锛? 涓級
鈹?      鈹溾攢鈹€ repository/     # JPA 鎺ュ彛锛? 涓級
鈹?      鈹溾攢鈹€ entity/         # 瀹炰綋绫伙紙8 涓級
鈹?      鈹溾攢鈹€ dto/            # DTO锛? 涓級
鈹?      鈹溾攢鈹€ config/         # 閰嶇疆锛? 涓級
鈹?      鈹斺攢鈹€ common/         # 鏋氫妇/宸ュ叿锛? 涓級
鈹溾攢鈹€ frontend/              # React 鍓嶇锛?6 涓?TSX 鏂囦欢锛?鈹?  鈹斺攢鈹€ src/
鈹?      鈹溾攢鈹€ pages/          # 12 涓〉闈㈢粍浠?鈹?      鈹溾攢鈹€ components/     # 鍏变韩缁勪欢
鈹?      鈹溾攢鈹€ services/       # API 璋冪敤灏佽
鈹?      鈹溾攢鈹€ store/          # Zustand 鐘舵€?鈹?      鈹斺攢鈹€ router/         # 璺敱閰嶇疆
鈹斺攢鈹€ skills/                # Codex skills
```

## 鐜鍙橀噺

| 鍙橀噺鍚?| 璇存槑 | 榛樿鍊?|
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | 锛堝繀濉級 |
| `DB_HOST` | 鏁版嵁搴撲富鏈?| `10.237.255.9` |
| `DB_PORT` | 鏁版嵁搴撶鍙?| `5432` |
| `DB_NAME` | 鏁版嵁搴撳悕 | `ai_grader` |
| `DB_USER` | 鏁版嵁搴撶敤鎴?| `ai_grader` |
| `DB_PASSWORD` | 鏁版嵁搴撳瘑鐮?| `ai_grader123` |
| `REDIS_HOST` | Redis 涓绘満 | `10.237.255.9` |
| `REDIS_PORT` | Redis 绔彛 | `6379` |
| `SERVER_PORT` | 鏈嶅姟绔彛 | `8080` |