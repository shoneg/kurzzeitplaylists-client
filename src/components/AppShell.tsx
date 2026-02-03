import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { apiGet } from '../api';
import { buildServerUrl } from '../config';
import { useI18n } from '../i18n';
import { Session } from '../types';
import DeleteAccountPage from '../pages/DeleteAccountPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import PlaylistDetailPage from '../pages/PlaylistDetailPage';
import PlaylistsPage from '../pages/PlaylistsPage';

/**
 * Top-level layout and routing shell for the client app.
 */
const AppShell: React.FC = () => {
  const { t } = useI18n();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;
    apiGet<Session>('/api/session')
      .then((data) => {
        if (active) {
          setSession(data);
        }
      })
      .catch(() => {
        if (active) {
          setSession({ authenticated: false });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-title">Kurzzeitplaylists</div>
            <div className="brand-subtitle">{t('brand.subtitle')}</div>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/playlists">{t('nav.playlists')}</Link>
          <Link to="/account/delete">{t('nav.delete')}</Link>
          <a href={buildServerUrl('/auth/logout')}>{t('nav.logout')}</a>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage session={session} />} />
          <Route path="/playlists" element={<PlaylistsPage session={session} />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage session={session} />} />
          <Route path="/account/delete" element={<DeleteAccountPage session={session} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppShell;
