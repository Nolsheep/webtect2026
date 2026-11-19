import { NavLink } from 'react-router-dom';
import { useLang } from '../i18n.jsx';

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-planet" aria-hidden="true" />
        <span className="brand-name">เซ่นเซวิก</span>
      </NavLink>
      <nav>
        <NavLink to="/" end>{t('navHome')}</NavLink>
        <NavLink to="/chat">{t('navChat')}</NavLink>
        <div className="lang-switch" role="group" aria-label="Language">
          <button className={lang === 'th' ? 'active' : ''} onClick={() => setLang('th')}>TH</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
      </nav>
    </header>
  );
}
