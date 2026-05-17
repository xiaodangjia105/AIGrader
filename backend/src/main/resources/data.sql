-- ai_grader Seed Data
-- Run after pgvector extension is enabled

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Seed Users (MVP: hardcoded demo accounts)
INSERT INTO users (id, username, nickname, role, class_id, created_at) VALUES
(1, 'teacher_zhang', 'Zhang (Math Teacher)', 'TEACHER', NULL, NOW()),
(2, 'teacher_li', 'Li (Chinese Teacher)', 'TEACHER', NULL, NOW()),
(3, 'student_xiao', 'Xiao Ming', 'STUDENT', 1, NOW()),
(4, 'student_hong', 'Xiao Hong', 'STUDENT', 1, NOW()),
(5, 'student_gang', 'Xiao Gang', 'STUDENT', 1, NOW()),
(6, 'admin', 'Admin', 'ADMIN', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Class
INSERT INTO class_groups (id, name, teacher_id, created_at) VALUES
(1, 'Class 3-A', 1, NOW()),
(2, 'Class 3-B', 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Questions
INSERT INTO questions (id, type, subject, difficulty, content, answer, rubric, options, created_at) VALUES

-- Multiple Choice
(1, 'CHOICE', 'Math', 'EASY',
 'What is 15 + 27?',
 'C',
 NULL,
 '{"A":"40","B":"41","C":"42","D":"43"}',
 NOW()),

-- True/False
(2, 'TRUE_FALSE', 'Math', 'EASY',
 'The sum of angles in a triangle is 180 degrees.',
 'TRUE',
 NULL,
 NULL,
 NOW()),

-- Fill in the blank
(3, 'FILL_BLANK', 'Math', 'MEDIUM',
 'If x + 5 = 12, then x = ___.',
 '7',
 NULL,
 NULL,
 NOW()),

-- Short answer
(4, 'SHORT_ANSWER', 'Chinese', 'MEDIUM',
 'Briefly explain the main idea of the poem "Quiet Night Thought" by Li Bai.',
 'The poem expresses the poet''s homesickness while far from home, triggered by moonlight on a quiet night.',
 'Evaluate: correct theme identification (4 pts), clarity of expression (3 pts), supporting details (3 pts).',
 NULL,
 NOW()),

-- Essay
(5, 'ESSAY', 'Chinese', 'HARD',
 'Write a short essay (200-300 words) on "The person I admire most".',
 'A well-structured essay should include: introduction of the person, specific reasons for admiration, personal impact, and conclusion.',
 'Scoring dimensions: Content relevance (4 pts), Structure (3 pts), Language expression (3 pts).',
 NULL,
 NOW()),

-- Fill in the blank (Math)
(6, 'FILL_BLANK', 'Math', 'EASY',
 '8 * 7 = ___.',
 '56',
 NULL,
 NULL,
 NOW()),

-- Multiple Choice (Chinese)
(7, 'CHOICE', 'Chinese', 'EASY',
 'Which of the following is NOT one of the Four Great Classical Novels of Chinese literature?',
 'D',
 NULL,
 '{"A":"Romance of the Three Kingdoms","B":"Journey to the West","C":"Dream of the Red Chamber","D":"The Scholars"}',
 NOW()),

-- True/False (Science)
(8, 'TRUE_FALSE', 'Science', 'MEDIUM',
 'Water boils at 100 degrees Celsius at standard atmospheric pressure.',
 'TRUE',
 NULL,
 NULL,
 NOW()),

-- Short answer (Science)
(9, 'SHORT_ANSWER', 'Science', 'MEDIUM',
 'Explain why the sky appears blue.',
 'Rayleigh scattering: shorter (blue) wavelengths of sunlight scatter more than longer (red) wavelengths when sunlight passes through the atmosphere.',
 'Evaluate: mention of Rayleigh scattering (5 pts), explanation of wavelength dependency (3 pts), clarity (2 pts).',
 NULL,
 NOW()),

-- Multiple Choice (Math)
(10, 'CHOICE', 'Math', 'HARD',
 'Solve: If 3x + 4 = 19, then x = ?',
 'B',
 NULL,
 '{"A":"3","B":"5","C":"6","D":"7"}',
 NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('class_groups_id_seq', COALESCE((SELECT MAX(id) FROM class_groups), 1));
SELECT setval('questions_id_seq', COALESCE((SELECT MAX(id) FROM questions), 1));
