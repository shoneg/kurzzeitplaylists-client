import React from 'react';
import { Link } from 'react-router-dom';
import { buildServerUrl } from '../config';
import { useI18n } from '../i18n';
import { Session } from '../types';

const HomePage: React.FC<{ session: Session | null }> = ({ session }) => {
  const { t } = useI18n();
  const authenticated = session?.authenticated;

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{t('home.title')}</h1>
        <p>{t('home.description')}</p>
        {authenticated ? (
          <Link to="/playlists" className="btn">
            {t('home.cta.loggedIn')}
          </Link>
        ) : (
          <a href={buildServerUrl('/auth/login')} className="btn">
            {t('home.cta.loggedOut')}
          </a>
        )}
      </div>
      <div className="hero-panel">
        <div className="hero-card">
          <div className="hero-card-title">{t('home.card.title')}</div>
          <ul className="feature-list">
            <li>{t('home.card.feature1')}</li>
            <li>{t('home.card.feature2')}</li>
            <li>{t('home.card.feature3')}</li>
          </ul>
        </div>
        <div className="hero-card subtle">
          <div className="hero-card-title">{t('home.status.title')}</div>
          {session === null ? (
            <div className="muted">{t('home.status.checking')}</div>
          ) : authenticated ? (
            <div>
              <div className="muted">{t('home.status.signedIn')}</div>
              <div className="session-name">{session.user?.displayName}</div>
            </div>
          ) : (
            <div className="muted">{t('home.status.signedOut')}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
