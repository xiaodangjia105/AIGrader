# ai_grader 鈥?AI 鍗忎綔瑙勮寖

> 鏈枃浠朵负 Codex / AI 缂栫爜鍔╂墜鎻愪緵椤圭洰绾ц涓虹害鏉熶笌涓婁笅鏂囬敋鐐广€?> 姣忔鏂板璇濆紑濮嬫椂锛屽簲棣栧厛鍙戦€佹湰鏂囦欢鍐呭浣滀负涓婁笅鏂囥€?
---

## 椤圭洰姒傝堪

AI 浣滀笟鎵规敼骞冲彴锛氳鐩?**鏁欏笀甯冪疆 鈫?AI 鎵规敼 鈫?瀛︾敓璁㈡ 鈫?鏁欏笀澶嶆牳** 鐨勫畬鏁撮棴鐜€?
- **鍚庣锛?* Spring Boot 3.4 + Maven + Java 21
- **鍓嶇锛?* React 18 + Vite + TypeScript + Ant Design 5
- **AI锛?* Spring AI + DeepSeek (`deepseek-chat`)
- **鏁版嵁搴擄細** PostgreSQL 16 + pgvector 鎵╁睍
- **缂撳瓨/闃熷垪锛?* Redis 7
- **瀵硅薄瀛樺偍锛?* MinIO

## 椤圭洰缁撴瀯

```
ai_grader/
鈹溾攢鈹€ AGENTS.md               鈫?鏈枃浠?鈹溾攢鈹€ PRD.md                  鈫?闇€姹傛枃妗ｏ紙閿氱偣锛?鈹溾攢鈹€ DEVELOPMENT_PLAN.md     鈫?寮€鍙戣鍒掞紙閿氱偣锛?鈹溾攢鈹€ README.md               鈫?椤圭洰璇存槑
鈹溾攢鈹€ backend/                鈫?Spring Boot 鍚庣
鈹?  鈹溾攢鈹€ pom.xml
鈹?  鈹斺攢鈹€ src/main/java/com/ai_grader/
鈹?      鈹溾攢鈹€ ai_graderApplication.java
鈹?      鈹溾攢鈹€ controller/     鈫?REST 鎺у埗鍣?鈹?      鈹溾攢鈹€ service/        鈫?涓氬姟鏈嶅姟
鈹?      鈹溾攢鈹€ ai/             鈫?AI 鎵规敼寮曟搸
鈹?      鈹溾攢鈹€ repository/     鈫?JPA Repository
鈹?      鈹溾攢鈹€ entity/         鈫?瀹炰綋绫?鈹?      鈹溾攢鈹€ dto/            鈫?DTO
鈹?      鈹溾攢鈹€ config/         鈫?閰嶇疆绫?鈹?      鈹斺攢鈹€ common/         鈫?宸ュ叿/寮傚父/甯搁噺
鈹溾攢鈹€ frontend/               鈫?React 鍓嶇
鈹?  鈹溾攢鈹€ src/
鈹?  鈹?  鈹溾攢鈹€ pages/          鈫?teacher/ student/ admin/
鈹?  鈹?  鈹溾攢鈹€ components/     鈫?鍏变韩缁勪欢
鈹?  鈹?  鈹溾攢鈹€ hooks/          鈫?鑷畾涔?Hooks
鈹?  鈹?  鈹溾攢鈹€ services/       鈫?API 璋冪敤
鈹?  鈹?  鈹溾攢鈹€ store/          鈫?Zustand 鐘舵€佺鐞?鈹?  鈹?  鈹溾攢鈹€ router/         鈫?璺敱閰嶇疆
鈹?  鈹?  鈹斺攢鈹€ types/          鈫?TypeScript 绫诲瀷瀹氫箟
鈹?  鈹斺攢鈹€ package.json
鈹斺攢鈹€ skills/                 鈫?Codex skills
```

## 鏍稿績绾︽潫

### 鏂囦欢鎿嶄綔
- **绂佹** 鎵归噺鍒犻櫎鏂囦欢鎴栫洰褰曪紙`del /s`銆乣rd /s`銆乣rmdir /s`銆乣rm -rf`銆乣Remove-Item -Recurse`锛?- 鍒犻櫎鏂囦欢鏃讹紝涓€娆″彧鑳藉垹闄や竴涓槑纭矾寰勭殑鏂囦欢
- 闇€瑕佹壒閲忓垹闄ゆ椂锛屽仠姝㈡搷浣滃苟璇锋眰鐢ㄦ埛鎵嬪姩澶勭悊

### 姣忔瀵硅瘽鑼冨洿
- 姣忔瀵硅瘽鍙仛鐒?**涓€涓枃浠?/ 涓€涓被**
- 瀵硅瘽寮€濮嬪墠锛屽彂閫?`PRD.md` 鍜?`DEVELOPMENT_PLAN.md` 浣滀负涓婁笅鏂囬敋鐐?- 浠诲姟瀹屾垚鍚庡叧闂璇濓紝鏂板紑瀵硅瘽澶勭悊涓嬩竴涓换鍔?
### 浠ｇ爜瑙勮寖
- **Java锛?* 鏍囧噯 Spring Boot 鍒嗗眰鏋舵瀯锛圕ontroller 鈫?Service 鈫?Repository锛?- **React锛?* 鍑芥暟缁勪欢 + Hooks锛孴ypeScript 涓ユ牸妯″紡
- 浠ｇ爜搴旇嚜瑙ｉ噴锛岀姝㈡坊鍔犱笉蹇呰鐨勬敞閲?- 绂佹娣诲姞鐗堟潈/license 澹版槑

### 閰嶇疆瀹夊叏
- API Key銆佹暟鎹簱瀵嗙爜绛夋晱鎰熶俊鎭娇鐢ㄧ幆澧冨彉閲?- 閰嶇疆妯℃澘鏂囦欢浣跨敤 `.example` 鍚庣紑锛堝 `application-local.yml.example`锛?- `.env` 鍜?`application-local.yml` 宸插姞鍏?`.gitignore`

### AI 鑱岃矗杈圭晫
- **AI 璐熻矗锛?* 浠ｇ爜瀹炵幇 + 娴嬭瘯缂栧啓 + 鏂囨。缁存姢
- **寮€鍙戣€呰礋璐ｏ細** 鏈€缁堝喅绛?+ 浠ｇ爜瀹℃煡 + 鍚堝苟

## 鐜鍙橀噺

| 鍙橀噺鍚?| 璇存槑 | 绀轰緥 |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | `sk-xxx` |
| `DB_HOST` | PostgreSQL 涓绘満 | `10.237.255.9` |
| `DB_PORT` | PostgreSQL 绔彛 | `5432` |
| `DB_NAME` | 鏁版嵁搴撳悕 | `ai_grader` |
| `DB_USER` | 鏁版嵁搴撶敤鎴?| `ai_grader` |
| `DB_PASSWORD` | 鏁版嵁搴撳瘑鐮?| `ai_grader123` |
| `REDIS_HOST` | Redis 涓绘満 | `10.237.255.9` |
| `REDIS_PORT` | Redis 绔彛 | `6379` |
| `SERVER_PORT` | 鏈嶅姟绔彛 | `8080` |

## 鍏抽敭鍙傝€?
- 闇€姹傛枃妗ｏ細`PRD.md`
- 寮€鍙戣鍒掞細`DEVELOPMENT_PLAN.md`
- DeepSeek API 鏂囨。锛歨ttps://api-docs.deepseek.com/
- Spring AI 鏂囨。锛歨ttps://docs.spring.io/spring-ai/reference/