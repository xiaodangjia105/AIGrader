-- ai_grader Seed Data
-- Run after pgvector extension is enabled

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Seed Users (bcrypt hashes for password "123456")
INSERT INTO users (id, username, password, nickname, role, class_id, created_at) VALUES
(1, 'teacher_zhang', '$2b$12$UY2SHi6LMfePEK/MvJnMs.q8VYjF4YZKJkUQrTLpT7WTqzFUMuCJa', '张老师（数学）', 'TEACHER', NULL, NOW()),
(2, 'teacher_li', '$2b$12$UY2SHi6LMfePEK/MvJnMs.q8VYjF4YZKJkUQrTLpT7WTqzFUMuCJa', '李老师（语文）', 'TEACHER', NULL, NOW()),
(3, 'student_xiao', '$2b$12$UY2SHi6LMfePEK/MvJnMs.q8VYjF4YZKJkUQrTLpT7WTqzFUMuCJa', '小明', 'STUDENT', 1, NOW()),
(4, 'student_hong', '$2b$12$UY2SHi6LMfePEK/MvJnMs.q8VYjF4YZKJkUQrTLpT7WTqzFUMuCJa', '小红', 'STUDENT', 1, NOW()),
(5, 'student_gang', '$2b$12$UY2SHi6LMfePEK/MvJnMs.q8VYjF4YZKJkUQrTLpT7WTqzFUMuCJa', '小刚', 'STUDENT', 1, NOW()),
(6, 'admin', '$2b$12$UY2SHi6LMfePEK/MvJnMs.q8VYjF4YZKJkUQrTLpT7WTqzFUMuCJa', '管理员', 'ADMIN', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Class
INSERT INTO class_groups (id, name, teacher_id, created_at) VALUES
(1, '三年A班', 1, NOW()),
(2, '三年B班', 2, NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Questions
INSERT INTO questions (id, type, subject, difficulty, content, answer, rubric, options, created_at) VALUES
(1, 'CHOICE', 'Math', 'EASY', '15 + 27 = ?', 'C', NULL, '{"A":"40","B":"41","C":"42","D":"43"}', NOW()),
(2, 'TRUE_FALSE', 'Math', 'EASY', '三角形内角和等于180度。', 'TRUE', NULL, NULL, NOW()),
(3, 'FILL_BLANK', 'Math', 'MEDIUM', '如果 x + 5 = 12，那么 x = ___。', '7', NULL, NULL, NOW()),
(4, 'SHORT_ANSWER', 'Chinese', 'MEDIUM', '简述李白《静夜思》的主题思想。', '诗人通过月光引发思乡之情，表达游子在外的孤独和对家乡的思念。', '评估维度：主题把握(4分) + 表达清晰(3分) + 细节支撑(3分)', NULL, NOW()),
(5, 'ESSAY', 'Chinese', 'HARD', '以"我最敬佩的人"为题，写一篇200-300字的短文。', '应包括：人物介绍、敬佩的具体理由、个人影响和感悟。', '评分维度：内容切题(4分) + 结构完整(3分) + 语言表达(3分)', NULL, NOW()),
(6, 'FILL_BLANK', 'Math', 'EASY', '8 × 7 = ___。', '56', NULL, NULL, NOW()),
(7, 'CHOICE', 'Chinese', 'EASY', '以下哪部不是中国四大名著？', 'D', NULL, '{"A":"《三国演义》","B":"《西游记》","C":"《红楼梦》","D":"《儒林外史》"}', NOW()),
(8, 'TRUE_FALSE', 'Science', 'MEDIUM', '在标准大气压下，水的沸点是100°C。', 'TRUE', NULL, NULL, NOW()),
(9, 'SHORT_ANSWER', 'Science', 'MEDIUM', '请解释为什么天空是蓝色的。', '瑞利散射：太阳光穿过大气层时，波长较短的蓝光比波长长的红光更容易被散射。', '评估维度：提到瑞利散射(5分) + 波长解释(3分) + 表达清晰(2分)', NULL, NOW()),
(10, 'CHOICE', 'Math', 'HARD', '解方程：3x + 4 = 19，x = ?', 'B', NULL, '{"A":"3","B":"5","C":"6","D":"7"}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequences
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('class_groups_id_seq', COALESCE((SELECT MAX(id) FROM class_groups), 1));
SELECT setval('questions_id_seq', COALESCE((SELECT MAX(id) FROM questions), 1));