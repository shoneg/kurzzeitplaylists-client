import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPost } from '../api';
import { buildServerUrl } from '../config';
import { useI18n } from '../i18n';
import { PlaylistEditOptions, Session } from '../types';

const PlaylistDetailPage: React.FC<{ session: Session | null }> = ({ session }) => {
  const { t } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<PlaylistEditOptions | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!session?.authenticated || !id) {
      return;
    }
    setStatus('loading');
    apiGet<PlaylistEditOptions>(`/api/playlists/${id}`)
      .then((data) => {
        setDetails(data);
        setStatus('idle');
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, [session, id]);

  const formState = useMemo(() => {
    if (!details) {
      return {
        maxAge: '',
        maxTracks: '',
        discardPlaylist: '',
      };
    }
    return {
      maxAge: details.playlist.maxTrackAge ? String(details.playlist.maxTrackAge) : '',
      maxTracks: details.playlist.maxTracks ? String(details.playlist.maxTracks) : '',
      discardPlaylist: details.playlist.discardPlaylist ?? '',
    };
  }, [details]);

  const [maxAge, setMaxAge] = useState('');
  const [maxTracks, setMaxTracks] = useState('');
  const [discardPlaylist, setDiscardPlaylist] = useState('');

  useEffect(() => {
    setMaxAge(formState.maxAge);
    setMaxTracks(formState.maxTracks);
    setDiscardPlaylist(formState.discardPlaylist);
  }, [formState]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) {
      return;
    }
    setSaving(true);
    setSuccessMessage('');
    apiPost(`/api/playlists/${id}`, {
      maxAge: maxAge ? Number(maxAge) : null,
      maxTracks: maxTracks ? Number(maxTracks) : null,
      discardPlaylist: discardPlaylist ? discardPlaylist : null,
    })
      .then(() => {
        setSuccessMessage(t('playlist.saved'));
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (!session?.authenticated) {
    return (
      <section className="panel">
        <h2>{t('playlist.login.title')}</h2>
        <a className="btn" href={buildServerUrl('/auth/login')}>
          {t('playlist.login.cta')}
        </a>
      </section>
    );
  }

  if (status === 'loading') {
    return <div className="muted">{t('playlist.loading')}</div>;
  }

  if (status === 'error') {
    return <div className="error">{errorMessage}</div>;
  }

  if (!details) {
    return <div className="muted">{t('playlist.notFound')}</div>;
  }

  const playlist = details.playlist;

  return (
    <section className="panel">
      <button type="button" className="link" onClick={() => navigate('/playlists')}>
        {t('playlist.back')}
      </button>
      <div className="detail-header">
        <div>
          <h2>{playlist.name}</h2>
          <div className="muted">
            {t('playlist.oldest', { date: playlist.oldestTrack.date, age: playlist.oldestTrack.ageDays })}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">{t('playlist.tracks')}</div>
          <div className="stat-value">{playlist.numberOfTracks}</div>
        </div>
      </div>

      {successMessage && <div className="notice success">{successMessage}</div>}

      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span>{t('playlist.maxAge.label')}</span>
          <input
            type="number"
            min={1}
            value={maxAge}
            onChange={(event) => setMaxAge(event.target.value)}
            placeholder={t('playlist.maxAge.placeholder')}
          />
        </label>
        <label className="field">
          <span>{t('playlist.maxTracks.label')}</span>
          <input
            type="number"
            min={1}
            value={maxTracks}
            onChange={(event) => setMaxTracks(event.target.value)}
            placeholder={t('playlist.maxTracks.placeholder')}
          />
        </label>
        <label className="field">
          <span>{t('playlist.discard.label')}</span>
          <select value={discardPlaylist} onChange={(event) => setDiscardPlaylist(event.target.value)}>
            <option value="">{t('playlist.discard.none')}</option>
            {details.discardOptions.map((option) => (
              <option key={option.spotifyId} value={option.spotifyId}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? t('playlist.saving') : t('playlist.save')}
          </button>
        </div>
      </form>
    </section>
  );
};

export default PlaylistDetailPage;
