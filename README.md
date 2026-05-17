# AIGrader - AI Homework Grading Platform

AI-powered homework grading platform for K-12 education. Full loop: Teacher Assign -> AI Grade -> Student Correct -> Teacher Review.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.4 + Java 21 + Maven |
| AI Engine | Spring AI + DeepSeek (`deepseek-chat`) |
| Database | PostgreSQL 16 + pgvector extension |
| Cache/Queue | Redis 7 |
| Frontend | React 18 + Vite + TypeScript + Ant Design 5 |

## Quick Start

### Prerequisites

- Java 21+
- Node.js 24+ & pnpm
- Maven 3.9+
- PostgreSQL 16 (with pgvector extension)
- Redis 7

### Backend

```bash
cd backend
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
# Edit application-local.yml with your actual DB credentials and DeepSeek API key

mvn spring-boot:run
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000

### Seed Data

After the backend starts and creates tables, run the seed SQL:

```bash
psql -h <host> -U <user> -d aigrader -f backend/src/main/resources/data.sql
```

## Demo Accounts (MVP - hardcoded)

| Username | Role | Nickname |
|----------|------|----------|
| teacher_zhang | TEACHER | Zhang (Math Teacher) |
| teacher_li | TEACHER | Li (Chinese Teacher) |
| student_xiao | STUDENT | Xiao Ming |
| student_hong | STUDENT | Xiao Hong |
| student_gang | STUDENT | Xiao Gang |
| admin | ADMIN | Admin |

## Project Structure

```
AIGrader/
├── AGENTS.md              # AI collaboration spec
├── PRD.md                 # Product requirements
├── DEVELOPMENT_PLAN.md    # Development plan
├── backend/               # Spring Boot backend
├── frontend/              # React frontend
└── skills/                # Codex skills
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek API key | (required) |
| `DB_HOST` | PostgreSQL host | `10.237.255.9` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `aigrader` |
| `DB_USER` | Database user | `aigrader` |
| `DB_PASSWORD` | Database password | `aigrader123` |
| `REDIS_HOST` | Redis host | `10.237.255.9` |
| `REDIS_PORT` | Redis port | `6379` |
| `SERVER_PORT` | Server port | `8080` |

## License

Proprietary - All rights reserved.
