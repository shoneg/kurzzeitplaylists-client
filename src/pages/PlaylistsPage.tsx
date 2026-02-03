import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../api';
import { buildServerUrl } from '../config';
import { useI18n } from '../i18n';
import { PlaylistSummary, RecognizeResult, Session } from '../types';

const PlaylistsPage: React.FC<{ session: Session | null }> = ({ session }) => {
  const { t } = useI18n();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recognizeResult, setRecognizeResult] = useState<RecognizeResult | null>(null);

  const loadPlaylists = () => {
    setStatus('loading');
    apiGet<PlaylistSummary[]>('/api/playlists')
      .then((data) => {
        setPlaylists(data);
        setStatus('idle');
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  };

  useEffect(() => {
    if (session?.authenticated) {
      loadPlaylists();
    }
  }, [session]);

  const onRecognize = () => {
    setRecognizeResult(null);
    apiPost<RecognizeResult>('/api/playlists/recognize')
      .then((result) => {
        setRecognizeResult(result);
        loadPlaylists();
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  };

  if (!session?.authenticated) {
    return (
      <section className="panel">
        <h2>{t('playlists.login.title')}</h2>
        <p className="muted">{t('playlists.login.subtitle')}</p>
        <a className="btn" href={buildServerUrl('/auth/login')}>
          {t('playlists.login.cta')}
        </a>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{t('playlists.title')}</h2>
          <p className="muted">{t('playlists.subtitle')}</p>
        </div>
        <button type="button" className="btn secondary" onClick={onRecognize}>
          {t('playlists.sync')}
        </button>
      </div>

      {recognizeResult && (
        <div className="notice">
          {t('playlists.syncResult', {
            newPlaylists: recognizeResult.newPlaylists,
            deletedPlaylists: recognizeResult.deletedPlaylists,
          })}
        </div>
      )}

      {status === 'loading' && <div className="muted">{t('playlists.loading')}</div>}
      {status === 'error' && <div className="error">{errorMessage}</div>}

      {status !== 'loading' && playlists.length === 0 && (
        <div className="empty">{t('playlists.empty')}</div>
      )}

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <Link key={playlist.spotifyId} to={`/playlists/${playlist.spotifyId}`} className="playlist-card">
            <div className="playlist-title">{playlist.name}</div>
            <div className="playlist-meta">{t('playlists.tracksLabel')}: {playlist.numberOfTracks}</div>
            <div className="playlist-rules">
              {playlist.maxTrackAge ? (
                <span className="tag">{t('playlists.tag.maxAge', { days: playlist.maxTrackAge })}</span>
              ) : null}
              {playlist.maxTracks ? (
                <span className="tag">{t('playlists.tag.maxTracks', { count: playlist.maxTracks })}</span>
              ) : null}
              {playlist.discardPlaylist ? <span className="tag">{t('playlists.tag.discard')}</span> : null}
              {!playlist.maxTrackAge && !playlist.maxTracks && !playlist.discardPlaylist ? (
                <span className="tag ghost">{t('playlists.tag.none')}</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PlaylistsPage;
