// Personal portfolio page of one member: /member/:slug
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n.jsx';
import Avatar from '../components/Avatar.jsx';

const CATEGORY_ICON = { competition: '🏆', research: '🔬', project: '🛰', training: '🎓', course: '📘', work: '💼', group: '🌌' };

function WorkCard({ project }) {
  const { t, pick } = useLang();
  const cat = project.category || 'project';
  return (
    <article className="card work">
      {project.image_url ? (
        <img className="work-cover" src={project.image_url} alt={pick(project, 'title')} loading="lazy" />
      ) : (
        <div className="work-cover placeholder" aria-hidden="true">{CATEGORY_ICON[cat] ?? '✦'}</div>
      )}
      <div className="work-body">
        <div className="work-meta">
          <span className={`badge cat-${cat}`}>{t(`cat_${cat}`)}</span>
          {project.year && <span className="muted">{project.year}</span>}
        </div>
        <h3>{pick(project, 'title')}</h3>
        <p>{pick(project, 'description')}</p>
        {project.tech?.length > 0 && (
          <div className="chips small">{project.tech.map((x) => <span key={x}>{x}</span>)}</div>
        )}
        {project.link && <a className="work-link" href={project.link} target="_blank" rel="noreferrer">{t('openLink')} ↗</a>}
      </div>
    </article>
  );
}

export default function Member() {
  const { slug } = useParams();
  const { t, pick, lang } = useLang();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  // filter resets to 'all' when moving to another member
  const [filterState, setFilterState] = useState({ slug, value: 'all' });
  const filter = filterState.slug === slug ? filterState.value : 'all';
  const setFilter = (value) => setFilterState({ slug, value });

  useEffect(() => {
    api.getPortfolio().then(setData).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (error) return <main className="page"><div className="card notice">{t('loadError')}<br /><small>{error}</small></div></main>;
  if (!data) return <main className="page"><div className="loading">{t('loading')}</div></main>;

  const { members } = data;
  const index = members.findIndex((m) => m.slug === slug);
  const member = members[index];
  if (!member) {
    return (
      <main className="page">
        <div className="card notice">{t('memberNotFound')}<br /><Link to="/" className="btn ghost small">← {t('backHome')}</Link></div>
      </main>
    );
  }

  const prev = members[(index - 1 + members.length) % members.length];
  const next = members[(index + 1) % members.length];
  const nickname = lang === 'th' ? member.nickname_th : member.nickname_en;
  const categories = [...new Set(member.projects.map((p) => p.category || 'project'))];
  const works = filter === 'all' ? member.projects : member.projects.filter((p) => (p.category || 'project') === filter);
  const competitions = member.projects.filter((p) => p.category === 'competition').length;
  const askText = lang === 'th' ? `เล่าเรื่องของ${member.nickname_th}ให้ฟังหน่อย` : `Tell me about ${member.nickname_en}`;

  return (
    <main className="page member-page" style={{ '--c': member.color }}>
      <Link to="/#crew" className="back-link">← {t('backHome')}</Link>

      <section className="bento">
        <div className="card profile-hero">
          <Avatar member={member} size={132} />
          <div className="profile-text">
            <p className="kicker">{t('crewMember')} · {String(index + 1).padStart(2, '0')}</p>
            <h1>{nickname}</h1>
            <p className="profile-name">{member.full_name_th} · {member.full_name_en}</p>
            <span className="role big">{pick(member, 'role')}</span>
          </div>
        </div>

        <div className="card stat"><b>{member.projects.length}</b><span>{t('works')}</span></div>
        <div className="card stat"><b>{competitions}</b><span>{t('competitions')}</span></div>

        <Link to={`/chat?q=${encodeURIComponent(askText)}`} className="card ask-card">
          <div className="nova-orb small">AI</div>
          <span>{t('askAbout')} {nickname} →</span>
        </Link>

        <div className="card about">
          <h2>{t('about')}</h2>
          <p>{pick(member, 'bio')}</p>
          <div className="links">
            {member.email && <a href={`mailto:${member.email}`}>✉ {member.email}</a>}
            {member.github && <a href={member.github} target="_blank" rel="noreferrer">⌥ GitHub</a>}
          </div>
        </div>

        <div className="card skills-card">
          <h2>{t('skills')}</h2>
          <div className="chips">{member.skills.map((s) => <span key={s}>{s}</span>)}</div>
        </div>
      </section>

      <div className="works-header">
        <h2 className="section-title">{t('portfolioOf')} {nickname}</h2>
        <div className="filters" role="group" aria-label="Filter">
          {['all', ...categories].map((c) => (
            <button key={c} className={filter === c ? 'active' : ''} onClick={() => setFilter(c)}>
              {c === 'all' ? t('all') : `${CATEGORY_ICON[c] ?? ''} ${t(`cat_${c}`)}`}
            </button>
          ))}
        </div>
      </div>
      <section className="works-grid">
        {works.map((p) => <WorkCard key={p.id} project={p} />)}
      </section>

      <nav className="member-nav">
        <Link to={`/member/${prev.slug}`} className="card" style={{ '--c': prev.color }}>
          <small className="muted">← {t('prevMember')}</small>
          <strong>{lang === 'th' ? prev.nickname_th : prev.nickname_en}</strong>
        </Link>
        <Link to={`/member/${next.slug}`} className="card right" style={{ '--c': next.color }}>
          <small className="muted">{t('nextMember')} →</small>
          <strong>{lang === 'th' ? next.nickname_th : next.nickname_en}</strong>
        </Link>
      </nav>
    </main>
  );
}
