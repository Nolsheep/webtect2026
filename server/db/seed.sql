-- Portfolio data for group "เซ่นเซวิก".
-- Edit this file, then run `npm run db:seed` (in /server) to reload it.
-- Lines marked TODO are placeholders waiting for real data from the team.
-- Chat history (conversations/messages) is NOT touched by this file.

TRUNCATE projects, members, group_info RESTART IDENTITY CASCADE;

INSERT INTO group_info
  (name_th, name_en, tagline_th, tagline_en, concept_th, concept_en,
   highlights_th, highlights_en, university, email, github, instagram, line)
VALUES (
  'เซ่นเซวิก',
  'Sen Sevik',
  'สามนักสำรวจข้อมูล ล่องไปในจักรวาลของ AI',
  'Three data explorers drifting through the AI universe',
  'เราเป็นนักศึกษาปี 3 สาขาปัญญาประดิษฐ์และวิทยาการข้อมูล คณะวิศวกรรมศาสตร์ มหาวิทยาลัยกรุงเทพ ที่รวมตัวกันเพื่อเปลี่ยนข้อมูลและ AI ให้กลายเป็นเครื่องมือที่ใช้งานได้จริง แต่ละคนถนัดคนละด้าน ทั้ง Machine Learning, Frontend และการจัดการระบบ/ข้อมูล จึงทำงานครบตั้งแต่โมเดลจนถึงหน้าเว็บ',
  'We are third-year Artificial Intelligence and Data Science students at the Faculty of Engineering, Bangkok University. We teamed up to turn data and AI into tools people can actually use. Each of us covers a different orbit: machine learning, frontend, and systems/data operations, so together we can ship a product from model to UI.',
  ARRAY['ครบทั้งสาย AI, Frontend และ DevOps ในทีมเดียว', 'ชอบลงมือทำของที่ใช้งานได้จริง', 'สื่อสารกันสองภาษา ไทย/อังกฤษ'],
  ARRAY['AI, frontend and DevOps skills in one crew', 'We like building things people really use', 'Bilingual team: Thai and English'],
  'Bangkok University, Faculty of Engineering (AI & Data Science)',
  'nonkanat@gmail.com',                               -- TODO: group email if you have one
  'https://github.com/Nolsheep/webtect2026',
  NULL,                                               -- TODO: instagram
  NULL                                                -- TODO: LINE
);

INSERT INTO members
  (slug, nickname_th, nickname_en, full_name_th, full_name_en, role_th, role_en,
   bio_th, bio_en, skills, email, github, photo_url, color, sort_order)
VALUES
(
  'kanat', 'นล', 'Nol', 'คเณศร์ ทองนิยม', 'Kanat Thongniyom',
  'Backend & AI Engineer',                            -- TODO: confirm role
  'Backend & AI Engineer',
  'นักศึกษาปี 3 สาขา AI และ Data Science สนใจ Machine Learning, Deep Learning และ Computer Vision ตอนนี้โฟกัสที่ Deep Learning และ NLP ในโปรเจกต์นี้ดูแล Express API, ฐานข้อมูล และการเชื่อมต่อ AI',
  'Third-year AI & Data Science student interested in Machine Learning, Deep Learning and Computer Vision, currently focusing on Deep Learning and NLP. In this project he owns the Express API, the database and the AI integration.',
  ARRAY['Python', 'SQL', 'Scikit-learn', 'Pandas', 'TensorFlow / Keras', 'CNN', 'Matplotlib / Seaborn', 'MySQL', 'Node.js / Express', 'Figma', 'Tableau', 'Generative AI (ChatGPT, Gemini)'],
  'nonkanat@gmail.com', 'https://github.com/Nolsheep', NULL, '#8b5cf6', 1
),
(
  'keng', 'เก่ง', 'Keng', 'นิติกุล แก้วไพฑูรย์', 'Nitikul Keawpaitoon',   -- TODO: check Thai spelling
  'Frontend Developer',                               -- TODO: confirm role
  'Frontend Developer',
  'นักศึกษา AI ที่มีทักษะด้าน cybersecurity, การออกแบบเก็บข้อมูลเชิงสถิติ และการปรับปรุง workflow เคยสร้างระบบเช็กชื่ออัตโนมัติด้วย Line Beacon และ Firebase มีประสบการณ์ด้าน operations และการจัดเวิร์กช็อปนวัตกรรม',
  'AI student with skills in cybersecurity, statistical data design and workflow optimization. Built an automated attendance system with Line Beacon and Firebase, and has hands-on experience in operations and running innovation workshops.',
  ARRAY['React', 'JavaScript', 'HTML / CSS', 'Python', 'MySQL', 'Git / GitHub', 'Firebase', 'Google Sheets automation', 'Generative AI', 'Workflow design'],
  'nitikul.keaw@bumail.net', 'https://github.com/KengJoJo', NULL, '#22d3ee', 2
),
(
  'time', 'ไทม์', 'Time', 'เจตนิพัทธ อินทรีย์', 'Jetniphat Intharee',     -- TODO: check English spelling
  'DevOps & Data',                                    -- TODO: confirm role
  'DevOps & Data',
  'นักศึกษาปี 3 สาขา AI และ Data Science ชอบงานฮาร์ดแวร์และหุ่นยนต์มาตั้งแต่มัธยม เคยชนะการแข่งขัน STEAM Drone & Coding ถนัดทำ Dashboard ด้วย Looker Studio และมีพื้นฐาน Python, NLP และ Arduino',
  'Third-year AI & Data Science student who has loved hardware and robotics since high school. Won the STEAM Drone & Coding competition, builds dashboards in Looker Studio, and has a foundation in Python, NLP and Arduino.',
  ARRAY['Python', 'NLP basics', 'Looker Studio', 'MySQL', 'HTML', 'Arduino', 'Drones', 'Microsoft Excel / Word', 'GitHub Actions', 'Render'],
  'Jetniphat28@gmail.com', NULL,                      -- TODO: GitHub
  NULL, '#f472b6', 3
);

INSERT INTO projects (member_id, title_th, title_en, description_th, description_en, tech, year, link, sort_order) VALUES
-- Group project
(NULL, 'Galaxy Portfolio Chat', 'Galaxy Portfolio Chat',
 'เว็บ Portfolio ของกลุ่มธีมอวกาศ พร้อมแชตบอท AI ที่ตอบคำถามเกี่ยวกับกลุ่มและสมาชิกจากข้อมูลในฐานข้อมูล รองรับไทย/อังกฤษ มี CI/CD ด้วย GitHub Actions',
 'Our space-themed group portfolio with an AI chatbot that answers questions about the group and each member from data in PostgreSQL. Bilingual (Thai/English) with CI/CD on GitHub Actions.',
 ARRAY['React', 'Express', 'PostgreSQL', 'Typhoon AI', 'GitHub Actions', 'Render'], '2026',
 'https://github.com/Nolsheep/webtect2026', 1),

-- Nol
(1, 'จำแนกสุขภาพต้นไม้ด้วย Random Forest', 'Tree health classification',
 'โปรเจกต์วิชา AIE 314 Data Preparation and Data Mining เตรียมข้อมูลและใช้ Random Forest จำแนกสุขภาพของต้นไม้',
 'AIE 314 (Data Preparation & Data Mining) project: prepared the data and used Random Forest to classify the health of trees.',
 ARRAY['Python', 'Scikit-learn', 'Pandas'], NULL, NULL, 1),
(1, 'โปรเจกต์ ML เชื่อมต่อ MySQL', 'ML project with MySQL',
 'โปรเจกต์วิชา AIE 313 Database ออกแบบฐานข้อมูลและเชื่อมโมเดล Machine Learning เข้ากับ MySQL',
 'AIE 313 (Database) project: designed a database and connected a machine learning workflow to MySQL.',
 ARRAY['Python', 'MySQL', 'SQL'], NULL, NULL, 2),
(1, 'MyOrder The Next Gen #1 Boot Camp', 'MyOrder The Next Gen #1 Boot Camp',
 'ผ่านการอบรมด้าน Business Analysis, UX/UI ด้วย Figma, การทดสอบแอป และการ pitch proposal',
 'Completed training in business analysis, UX/UI prototyping with Figma, application testing and proposal pitching.',
 ARRAY['Figma', 'Business Analysis', 'Testing'], '2024', NULL, 3),

-- Keng
(2, 'ระบบบันทึกการเข้าเรียนอัตโนมัติ', 'Automated attendance data logging',
 'ใช้ Line Beacon เช็กชื่ออัตโนมัติเมื่อนักศึกษาเข้าห้อง เก็บข้อมูลแบบ real-time บน Firebase และส่งต่อไป Google Sheets',
 'Line Beacon checks students in automatically when they enter the classroom; Firebase stores the data in real time and syncs it to Google Sheets.',
 ARRAY['Line Beacon', 'Firebase', 'Google Sheets'], NULL, NULL, 1),
(2, 'Operations & CRM Coordinator, Cyberzen', 'Operations & CRM Coordinator, Cyberzen',
 'ดูแลงานประจำวัน อัปเดตข้อมูล CRM ทำรายงานด้วย Excel/Google Sheets และปรับ workflow ให้เร็วขึ้น',
 'Handled daily operations, kept CRM data accurate, built reports in Excel/Google Sheets and streamlined workflows.',
 ARRAY['Excel', 'Google Sheets', 'CRM'], '2020-2025', NULL, 2),

-- Time
(3, 'แชมป์ STEAM Drone & Coding', 'STEAM Drone & Coding champion',
 'ชนะเลิศการแข่งขัน STEAM Drone & Coding และเป็นผู้ช่วยสอนการใช้โดรนในหลายโรงเรียนและมหาวิทยาลัยบูรพา',
 'Won the STEAM Drone & Coding competition and assisted drone training at several schools and Burapha University.',
 ARRAY['Drones', 'Coding'], '2019', NULL, 1),
(3, 'ค่ายหุ่นยนต์รักษาสิ่งแวดล้อม', 'Environmental robot camp',
 'เข้าร่วมอบรมและแข่งขันค่ายหุ่นยนต์รักษาสิ่งแวดล้อม ที่มหาวิทยาลัยบูรพา และเวิร์กช็อป Industrial Robot ของ RAI',
 'Joined the environmental robotics camp and competition at Burapha University, plus the RAI Industrial Robot workshop.',
 ARRAY['Robotics', 'Arduino'], '2020-2021', NULL, 2),
(3, 'Dashboard ด้วย Looker Studio', 'Looker Studio dashboards',
 'สร้าง Dashboard สรุปข้อมูลด้วย Looker Studio',            -- TODO: add the real dashboard project
 'Builds data dashboards in Looker Studio.',
 ARRAY['Looker Studio', 'Excel'], NULL, NULL, 3);
