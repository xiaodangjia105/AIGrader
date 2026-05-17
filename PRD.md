# AIGrader -- Product Requirements Document (PRD)

> Version: v1.0 | Updated: 2026-05-17

---

## 1. Product Overview

**AI Homework Grading** is an AI-assisted grading SaaS platform for K-12 students, covering the full loop: Teacher Assign -> AI Grade -> Student Correct -> Teacher Review.

### Core Targets

| Metric | Current | Target |
|---|---|---|
| Avg grading time per assignment | 20 min | <= 5 min |
| Student engagement rate | 15% | >= 40% |
| Objective question accuracy | 99% | Maintain 99% |
| Subjective question error rate | 15% | <= 10% |

---

## 2. User Personas

| Role | Core Scenarios | Pain Points |
|---|---|---|
| **Teacher** | Assign homework, review AI grading, view class stats | Repetitive grading takes 70% of time; grading peaks 8-11 PM |
| **Student** | Submit homework, view feedback, correct mistakes | 1-2 day feedback lag, cannot fix mistakes promptly |
| **Admin** | Manage question bank, monitor system metrics | Quality monitoring, teacher workload evaluation |

---

## 3. Core Feature Matrix

### 3.1 Teacher Portal

| Feature | Description | Priority |
|---|---|---|
| Assignment Management | Create/assign homework, select from question bank | P0 |
| Grading Review | Review AI results, correct errors, one-click confirm | P0 |
| Class Statistics | Completion rate, avg score, frequent-mistake heatmap | P1 |
| Personalized Comments | AI-generated + teacher tweak | P1 |

### 3.2 Student Portal

| Feature | Description | Priority |
|---|---|---|
| Answer Homework | Online answering (choice/true-false/fill-blank/short-answer/essay) | P0 |
| Instant Feedback | Second-level AI grading after submission | P0 |
| Mistake Correction | View analysis + re-answer + track correction history | P1 |
| Study Report | Personal weak-point analysis | P2 |

### 3.3 Admin Panel

| Feature | Description | Priority |
|---|---|---|
| Question Bank Management | CRUD + batch import | P0 |
| User Management | Teacher/student account management | P1 |
| Quality Monitoring | AI accuracy stats, error-rate tracking | P2 |

---

## 4. System Architecture

```
+--------------- React SPA (Vite + pnpm) ---------------+
|  Teacher Portal         |  Student Portal              |
|  Admin Panel                                           |
+----------------------- REST API -----------------------+
                            |
+----------- Spring Boot 3.4 (Java 21) -----------------+
|  Controller Layer  ->  Routing, validation              |
|  Service Layer     ->  Business logic                   |
|  AI Engine Layer   ->  Spring AI + DeepSeek              |
|  Repository Layer  ->  Spring Data JPA + pgvector        |
|  Queue Layer       ->  Redis grading task queue          |
|  Cache Layer       ->  Redis AI result cache             |
+----------------------------------------------------------+
                            |
+------------- Infrastructure (Existing Docker) ----------+
|  PostgreSQL 16  +  pgvector extension                    |
|  Redis 7         (Session / Cache / Queue / Rate Limit)  |
|  MinIO           (Homework images / file storage)        |
|  DeepSeek API    (LLM grading)                           |
+----------------------------------------------------------+
```

---

## 5. Database Schema

```sql
-- Users
users (id BIGSERIAL PK, username, nickname, role, class_id, created_at)

-- Classes
classes (id BIGSERIAL PK, name, teacher_id, created_at)

-- Question Bank
questions (
  id BIGSERIAL PK, type, subject, difficulty,
  content TEXT, answer TEXT, rubric TEXT,
  options JSONB, embedding vector(1536), created_at
)

-- Assignments
assignments (id BIGSERIAL PK, title, teacher_id, class_id,
  due_date, status, created_at)

-- Assignment-Question mapping
assignment_questions (id BIGSERIAL PK, assignment_id, question_id,
  sort_order, score)

-- Submissions
submissions (id BIGSERIAL PK, assignment_id, student_id,
  status, submitted_at, ai_graded_at)

-- Submission Answers (per-question)
submission_answers (
  id BIGSERIAL PK, submission_id, question_id,
  student_answer TEXT,
  ai_score DECIMAL, ai_feedback TEXT, ai_confidence DECIMAL,
  is_correct BOOLEAN,
  reviewed_by_teacher BOOLEAN DEFAULT FALSE,
  final_score DECIMAL, teacher_comment TEXT
)

-- Corrections
corrections (id BIGSERIAL PK, submission_answer_id,
  new_answer TEXT, corrected_at)
```

---

## 6. AI Grading Strategy

| Question Type | Strategy | Confidence | Latency |
|---|---|---|---|
| Choice | Exact answer match | 99% | <10ms |
| True/False | Exact answer match | 99% | <10ms |
| Fill-in-blank | Rule match + LLM semantic | 95% | <500ms |
| Short answer | LLM semantic + keywords + vector similarity | 90% | <2s |
| Essay/Proof | LLM multi-dimension scoring + personalized feedback | 85% | <5s |

**Fault tolerance:** Results with ai_confidence < 70% are flagged for teacher review.
Teacher corrections trigger async prompt template tuning.
Redis caches grading results by hash(question_id + answer).

---

## 7. API Design

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/assignments` | Teacher creates assignment |
| GET | `/api/assignments/{id}` | Get assignment detail |
| POST | `/api/submissions` | Student submits homework |
| POST | `/api/submissions/{id}/grade` | Trigger AI grading |
| GET | `/api/submissions/{id}/results` | Get grading results |
| PUT | `/api/grading/{answerId}/review` | Teacher corrects score |
| POST | `/api/corrections` | Student submits correction |
| GET | `/api/statistics/class/{classId}` | Class statistics |
| CRUD | `/api/questions` | Question bank management |
| CRUD | `/api/users` | User management |
