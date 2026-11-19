// Thai / English switch for UI labels. Portfolio data has _th and _en fields in the DB.
import { createContext, useContext, useEffect, useState } from 'react';

const dict = {
  th: {
    navHome: 'พอร์ตโฟลิโอ',
    navChat: 'คุยกับ AI',
    heroKicker: 'Group Portfolio · มหาวิทยาลัยกรุงเทพ',
    askNova: 'ถาม Nova เกี่ยวกับเรา',
    seeCrew: 'ดูลูกเรือ',
    members: 'สมาชิก',
    projects: 'ผลงาน',
    skills: 'ทักษะ',
    concept: 'แนวคิดของทีม',
    crew: 'ลูกเรือ',
    groupWork: 'ผลงานที่ทำร่วมกัน',
    techStack: 'เทคโนโลยีของเว็บนี้',
    contact: 'ติดต่อเรา',
    contactText: 'อยากร่วมงานหรือมีคำถาม ส่งสัญญาณมาได้เลย',
    chatTeaser: 'มีคำถามเกี่ยวกับเรา? ให้ AI ตอบแทน',
    chatTitle: 'Nova · ไกด์ AI ของกลุ่ม',
    chatSubtitle: 'ถามเรื่องกลุ่ม ผลงาน หรือสมาชิกแต่ละคนได้เลย ตอบทั้งไทยและอังกฤษ',
    placeholder: 'พิมพ์คำถาม... (Enter เพื่อส่ง)',
    send: 'ส่ง',
    newChat: 'เริ่มแชตใหม่',
    you: 'คุณ',
    thinking: 'Nova กำลังคิด',
    welcome: 'สวัสดีครับ ผม Nova ไกด์ AI ของกลุ่มเซ่นเซวิก 🚀 อยากรู้อะไรเกี่ยวกับกลุ่มหรือสมาชิกคนไหน ถามได้เลยครับ',
    suggestions: ['กลุ่มนี้มีใครบ้าง แต่ละคนทำหน้าที่อะไร', 'นลมีทักษะอะไรบ้าง', 'เก่งเคยทำโปรเจกต์อะไร', 'ติดต่อกลุ่มได้ทางไหน'],
    loadError: 'โหลดข้อมูลไม่สำเร็จ ตรวจสอบว่า server และฐานข้อมูลทำงานอยู่',
    loading: 'กำลังโหลดจักรวาล...',
    viewGithub: 'GitHub',
    footer: 'สร้างด้วย React, Express, PostgreSQL และ Typhoon AI',
  },
  en: {
    navHome: 'Portfolio',
    navChat: 'Chat with AI',
    heroKicker: 'Group Portfolio · Bangkok University',
    askNova: 'Ask Nova about us',
    seeCrew: 'Meet the crew',
    members: 'Members',
    projects: 'Projects',
    skills: 'Skills',
    concept: 'Our concept',
    crew: 'The crew',
    groupWork: 'Built together',
    techStack: 'Built with',
    contact: 'Contact',
    contactText: 'Want to work with us or have a question? Send a signal.',
    chatTeaser: 'Got a question about us? Let our AI answer.',
    chatTitle: 'Nova · our AI guide',
    chatSubtitle: 'Ask about the group, our work, or any member. Thai or English.',
    placeholder: 'Type a question... (Enter to send)',
    send: 'Send',
    newChat: 'New chat',
    you: 'You',
    thinking: 'Nova is thinking',
    welcome: "Hi, I'm Nova, the AI guide of team Sen Sevik 🚀 Ask me anything about the group or any member.",
    suggestions: ['Who is in the group and what do they do?', "What are Nol's skills?", 'What has Keng built?', 'How can I contact the team?'],
    loadError: 'Could not load data. Check that the server and database are running.',
    loading: 'Loading the universe...',
    viewGithub: 'GitHub',
    footer: 'Built with React, Express, PostgreSQL and Typhoon AI',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'th';
    } catch {
      return 'th';
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: (key) => dict[lang][key] ?? key,
    // pick(member, 'role') -> member.role_th or member.role_en
    pick: (obj, field) => obj?.[`${field}_${lang}`] || obj?.[`${field}_th`] || obj?.[`${field}_en`] || '',
  };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLang = () => useContext(LangContext);
