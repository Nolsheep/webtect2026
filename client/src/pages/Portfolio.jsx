import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n.jsx';
import Avatar from '../components/Avatar.jsx';

const STACK = ['React', 'Vite', 'Express', 'PostgreSQL', 'Typhoon AI', 'GitHub Actions', 'Render', 'Docker'];

function ProjectItem({ project }) {
  const { pick } = useLang();
  return (
    <li className="project">
      <div className="project-head">
        <strong>{pick(project, 'title')}</strong>
        {project.year && <span className="muted">{project.year}</span>}
      </div>
      <p>{pick(project, 'description')}</p>
      {project.tech?.length > 0 && (
        <div className="chips small">
          {project.tech.map((x) => <span key={x}>{x}</span>)}
        </div>
      )}
    </li>
  );
}

function MemberCard({ member }) {
  const { t, pick, lang } = useLang();
  const fullName = lang === 'th' ? member.full_name_th : member.full_name_en;
  return (
    <Link to={`/member/${member.slug}`} className="card member" style={{ '--c': member.color }} id={`member-${member.slug}`}>
      <div className="member-top">
        <Avatar member={member} />
        <div>
          <h3>{lang === 'th' ? member.nickname_th : member.nickname_en}</h3>
          <p className="muted">{fullName}</p>
          <span className="role">{pick(member, 'role')}</span>
        </div>
      </div>
      <p>{pick(member, 'bio')}</p>
      <h4>{t('skills')}</h4>
      <div className="chips">
        {member.skills.map((s) => <span key={s}>{s}</span>)}
      </div>
      <h4>{t('projects')} · {member.projects.length}</h4>
      <ul className="mini-works">
        {member.projects.slice(0, 3).map((p) => <li key={p.id}>{pick(p, 'title')}</li>)}
        {member.projects.length > 3 && <li className="muted">+{member.projects.length - 3}</li>}
      </ul>
      <span className="btn primary small view-profile">{t('viewProfile')} →</span>
    </Link>
  );
}

export default function Portfolio() {
  const { t, pick, lang } = useLang();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const { hash } = useLocation();

  useEffect(() => {
    api.getPortfolio().then(setData).catch((e) => setError(e.message));
  }, []);

  // e.g. coming back from a member page to /#crew
  useEffect(() => {
    if (data && hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [data, hash]);

  if (error) return <main className="page"><div className="card notice">{t('loadError')}<br /><small>{error}</small></div></main>;
  if (!data) return <main className="page"><div className="loading">{t('loading')}</div></main>;

  const { group, members, groupProjects } = data;
  const projectCount = groupProjects.length + members.reduce((n, m) => n + m.projects.length, 0);
  const skillCount = new Set(members.flatMap((m) => m.skills)).size;
  const highlights = group[`highlights_${lang}`] ?? [];

  return (
    <main className="page">
      <section className="bento">
        {/* Hero */}
        <div className="card hero">
          <p className="kicker">{t('heroKicker')}</p>
          <h1>
            <span className="gradient-text">{group.name_th}</span>
            <small>{group.name_en}</small>
          </h1>
          <p className="tagline">{pick(group, 'tagline')}</p>
          <div className="actions">
            <Link to="/chat" className="btn primary">✦ {t('askNova')}</Link>
            <a href="#crew" className="btn ghost">{t('seeCrew')} ↓</a>
          </div>
        </div>

        {/* Orbit visual: each member is a planet orbiting the group */}
        <div className="card orbit-card">
          <div className="orbit-system">
            <div className="sun">✦</div>
            {members.map((m, i) => (
              <div key={m.id} className={`orbit orbit-${i + 1}`}>
                <Link to={`/member/${m.slug}`} className="orbiter" style={{ '--c': m.color }}>{m.nickname_th}</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card stat"><b>{members.length}</b><span>{t('members')}</span></div>
        <div className="card stat"><b>{projectCount}</b><span>{t('projects')}</span></div>
        <div className="card stat"><b>{skillCount}+</b><span>{t('skills')}</span></div>

        {/* Concept */}
        <div className="card concept">
          <h2>{t('concept')}</h2>
          <p>{pick(group, 'concept')}</p>
          <ul className="highlights">
            {highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>

        {/* Chat teaser */}
        <Link to="/chat" className="card chat-teaser">
          <div className="nova-orb">AI</div>
          <p>{t('chatTeaser')}</p>
          <span className="btn primary small">{t('navChat')} →</span>
        </Link>
      </section>

      <h2 className="section-title" id="crew">{t('crew')}</h2>
      <section className="bento members-grid">
        {members.map((m) => <MemberCard key={m.id} member={m} />)}
      </section>

      <section className="bento">
        <div className="card group-work">
          <h2>{t('groupWork')}</h2>
          <ul className="projects">
            {groupProjects.map((p) => <ProjectItem key={p.id} project={p} />)}
          </ul>
        </div>
        <div className="card stack">
          <h2>{t('techStack')}</h2>
          <div className="chips">
            {STACK.map((s) => <span key={s}>{s}</span>)}
          </div>
        </div>
        <div className="card contact" id="contact">
          <h2>{t('contact')}</h2>
          <p>{t('contactText')}</p>
          <div className="links column">
            {group.email && <a href={`mailto:${group.email}`}>✉ {group.email}</a>}
            {group.github && <a href={group.github} target="_blank" rel="noreferrer">⌥ GitHub</a>}
            {group.instagram && <a href={group.instagram} target="_blank" rel="noreferrer">◎ Instagram</a>}
            {group.line && <span>LINE: {group.line}</span>}
          </div>
        </div>
      </section>

      <footer className="footer">© 2026 {group.name_th} · {group.university} · {t('footer')}</footer>
    </main>
  );
}
