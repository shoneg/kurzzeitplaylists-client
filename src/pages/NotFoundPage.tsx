import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const NotFoundPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="panel">
      <h2>{t('notFound.title')}</h2>
      <p className="muted">{t('notFound.body')}</p>
      <Link className="btn" to="/">
        {t('notFound.cta')}
      </Link>
    </section>
  );
};

export default NotFoundPage;
