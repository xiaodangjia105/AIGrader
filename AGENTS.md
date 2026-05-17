# AIGrader -- AI Collaboration Spec

This file provides project-level constraints and context anchors for Codex / AI coding assistants.
Send this file as context at the start of every new conversation.

---

## Project Overview

AI Homework Grading Platform: Teacher assigns, AI grades, Student corrects, Teacher reviews.

- **Backend:** Spring Boot 3.4 + Maven + Java 21
- **Frontend:** React 18 + Vite + TypeScript + Ant Design 5
- **AI:** Spring AI + DeepSeek (`deepseek-chat`)
- **Database:** PostgreSQL 16 + pgvector extension
- **Cache/Queue:** Redis 7
- **Object Storage:** MinIO

## Project Structure

```
AIGrader/
├── AGENTS.md               <-- This file
├── PRD.md                  <-- Requirements doc (anchor)
├── DEVELOPMENT_PLAN.md     <-- Development plan (anchor)
├── backend/                <-- Spring Boot backend
│   ├── pom.xml
│   └── src/main/java/com/aigrader/
│       ├── AIGraderApplication.java
│       ├── controller/     <-- REST controllers
│       ├── service/        <-- Business services
│       ├── ai/             <-- AI engine
│       ├── repository/     <-- JPA repositories
│       ├── entity/         <-- JPA entities
│       ├── dto/            <-- DTOs
│       ├── config/         <-- Configuration
│       └── common/         <-- Utilities/exceptions/constants
├── frontend/               <-- React frontend
│   ├── src/
│   │   ├── pages/          <-- teacher/ student/ admin/
│   │   ├── components/     <-- Shared components
│   │   ├── hooks/          <-- Custom hooks
│   │   ├── services/       <-- API layer
│   │   ├── store/          <-- Zustand stores
│   │   ├── router/         <-- Route config
│   │   └── types/          <-- TypeScript types
│   └── package.json
└── skills/                 <-- Codex skills
```

## Core Constraints

### File Operations
- **NEVER** batch delete files or directories (del /s, rd /s, rmdir /s, rm -rf, Remove-Item -Recurse)
- Delete only one explicitly-pathed file at a time
- If batch deletion is needed, stop and ask the user to do it manually

### Per-Conversation Scope
- Each conversation focuses on **one file / one class**
- Send PRD.md and DEVELOPMENT_PLAN.md as context anchors at conversation start
- Close the conversation after the task is done; open a new one for the next task

### Code Style
- Java: Standard Spring Boot layered architecture (Controller -> Service -> Repository)
- React: Function components + Hooks, TypeScript strict mode
- No unnecessary comments; code should be self-explanatory
- No copyright/license headers

### Config Security
- API Keys, DB passwords use environment variables
- Config templates use `.example` suffix (e.g., `application-local.yml.example`)
- `.env` and `application-local.yml` are in .gitignore

### AI Responsibility Boundaries
- AI handles: code implementation + test writing + doc maintenance
- Developer handles: final decisions + code review + merge

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | `sk-xxx` |
| `DB_HOST` | PostgreSQL host | `10.237.255.9` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `aigrader` |
| `DB_USER` | Database user | `aigrader` |
| `DB_PASSWORD` | Database password | `aigrader123` |
| `REDIS_HOST` | Redis host | `10.237.255.9` |
| `REDIS_PORT` | Redis port | `6379` |

## Key References

- Requirements: `PRD.md`
- Development Plan: `DEVELOPMENT_PLAN.md`
- DeepSeek API: `https://api.deepseek.com`
- Spring AI Docs: https://docs.spring.io/spring-ai/reference/
