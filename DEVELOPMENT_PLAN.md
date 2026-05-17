# AIGrader -- Development Plan

> Version: v1.0 | Updated: 2026-05-17

---

## M1 -- Project Init

- [x] Create project directory structure
- [x] Write AGENTS.md collaboration spec
- [x] Write PRD.md requirements doc
- [x] Write DEVELOPMENT_PLAN.md
- [ ] Initialize Spring Boot project (pom.xml, base config)
- [ ] Initialize React project (Vite + pnpm + Ant Design)
- [ ] Configure database connections (PG + pgvector + Redis)
- [ ] Init Git repo + push to GitHub

## M2 -- CRUD + Data Model

- [ ] JPA Entity classes + Repository interfaces
- [ ] Database init script + pgvector extension
- [ ] Question bank CRUD API
- [ ] Question bank frontend pages

## M3 -- AI Grading Engine

- [ ] Spring AI + DeepSeek integration
- [ ] Objective question grading (choice/true-false/fill-blank)
- [ ] Subjective question grading (short-answer/essay/proof)
- [ ] Prompt template management + vector similarity search
- [ ] Redis grading result cache
- [ ] Unit tests for AI engine

## M4 -- Core Loop

- [ ] Teacher: create assignment, view submissions
- [ ] Student: answer interface, submit homework
- [ ] Grading flow: submit -> AI grade -> show results
- [ ] Teacher review: correct scores, add comments
- [ ] Student correction: view analysis + re-answer

## M5 -- Statistics + Admin

- [ ] Class statistics (completion rate, avg score, frequent mistakes)
- [ ] Admin panel full features
- [ ] Student study report

## M6 -- Integration + Tests + Deploy

- [ ] Frontend-backend integration + bug fixes
- [ ] Integration tests + E2E tests
- [ ] Seed data script
- [ ] README documentation
- [ ] Push to GitHub (sanitized config)
