import React, { useState } from 'react';
import { apiPost } from '../api';
import { buildServerUrl } from '../config';
import { useI18n } from '../i18n';
import { Session } from '../types';

const DeleteAccountPage: React.FC<{ session: Session | null }> = ({ session }) => {
  const { t } = useI18n();
  const [confirmation, setConfirmation] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDelete = (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    apiPost('/api/auth/delete', { sure: confirmation })
      .then(() => {
        window.location.href = '/';
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  };

  if (!session?.authenticated) {
    return (
      <section className="panel">
        <h2>{t('delete.login.title')}</h2>
        <a className="btn" href={buildServerUrl('/auth/login')}>
          {t('delete.login.cta')}
        </a>
      </section>
    );
  }

  return (
    <section className="panel danger">
      <h2>{t('delete.title')}</h2>
      <p className="muted">{t('delete.description')}</p>
      <form className="form" onSubmit={onDelete}>
        <label className="field">
          <span>{t('delete.confirmLabel')}</span>
          <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        </label>
        {status === 'error' && <div className="error">{errorMessage}</div>}
        <button type="submit" className="btn danger" disabled={confirmation !== "Yes, I'm sure!" || status === 'loading'}>
          {t('delete.cta')}
        </button>
      </form>
    </section>
  );
};

export default DeleteAccountPage;
