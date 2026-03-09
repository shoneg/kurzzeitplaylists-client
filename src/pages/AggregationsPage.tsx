import React, { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '../api';
import { buildServerUrl } from '../config';
import { useI18n } from '../i18n';
import {
  AggregationExecutionResult,
  AggregationMode,
  AggregationOverview,
  AggregationRule,
  AggregationUpsertResponse,
  Session,
} from '../types';

type EditorTargetType = 'existing' | 'new';

const parseSpotifyPlaylistId = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const urlMatch = trimmed.match(/^https?:\/\/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)(\?.*)?$/);
  if (urlMatch?.[1]) {
    return urlMatch[1];
  }
  const uriMatch = trimmed.match(/^spotify:playlist:([A-Za-z0-9]+)$/);
  if (uriMatch?.[1]) {
    return uriMatch[1];
  }
  const idMatch = trimmed.match(/^[A-Za-z0-9]{22}$/);
  if (idMatch) {
    return trimmed;
  }
  return undefined;
};

/**
 * Aggregation rule management page.
 */
const AggregationsPage: React.FC<{ session: Session | null }> = ({ session }) => {
  const { t } = useI18n();
  const [overview, setOverview] = useState<AggregationOverview | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [targetType, setTargetType] = useState<EditorTargetType>('existing');
  const [existingTargetId, setExistingTargetId] = useState('');
  const [newTargetName, setNewTargetName] = useState('');
  const [mode, setMode] = useState<AggregationMode>('exact_union');
  const [sourcePlaylistIds, setSourcePlaylistIds] = useState<string[]>([]);
  const [sourceToAdd, setSourceToAdd] = useState('');
  const [manualSourceInput, setManualSourceInput] = useState('');

  const rulesByTargetId = useMemo(() => {
    const map = new Map<string, AggregationRule>();
    (overview?.rules ?? []).forEach((rule) => {
      map.set(rule.targetSpotifyId, rule);
    });
    return map;
  }, [overview]);

  const playlistsById = useMemo(() => {
    const map = new Map<string, string>();
    [...(overview?.playlists ?? []), ...(overview?.targetPlaylists ?? [])].forEach((playlist) => {
      map.set(playlist.spotifyId, playlist.name);
    });
    return map;
  }, [overview]);

  const hydrateEditorFromRule = (rule: AggregationRule) => {
    setTargetType('existing');
    setExistingTargetId(rule.targetSpotifyId);
    setMode(rule.mode);
    setSourcePlaylistIds([...rule.sourcePlaylistIds]);
    setSourceToAdd('');
  };

  const resetForNewRule = () => {
    setTargetType('new');
    setExistingTargetId('');
    setNewTargetName('');
    setMode('exact_union');
    setSourcePlaylistIds([]);
    setSourceToAdd('');
  };

  const loadOverview = (preferredTargetId?: string) => {
    setStatus('loading');
    setErrorMessage('');
    apiGet<AggregationOverview>('/api/aggregations')
      .then((data) => {
        setOverview(data);
        setStatus('idle');
        if (preferredTargetId) {
          const preferredRule = data.rules.find((rule) => rule.targetSpotifyId === preferredTargetId);
          if (preferredRule) {
            hydrateEditorFromRule(preferredRule);
            return;
          }
        }
        if (targetType === 'existing' && existingTargetId) {
          const currentRule = data.rules.find((rule) => rule.targetSpotifyId === existingTargetId);
          if (currentRule) {
            hydrateEditorFromRule(currentRule);
            return;
          }
        }
        if (data.rules.length > 0) {
          hydrateEditorFromRule(data.rules[0]);
        }
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  };

  useEffect(() => {
    if (!session?.authenticated) {
      return;
    }
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const currentTargetId = targetType === 'existing' ? existingTargetId : '';
  const currentRule = currentTargetId ? rulesByTargetId.get(currentTargetId) : undefined;
  const canRunNow = targetType === 'existing' && Boolean(currentRule);
  const canDelete = canRunNow;

  const availableSourceOptions = useMemo(() => {
    const targetIdToExclude = targetType === 'existing' ? existingTargetId : '';
    return (overview?.playlists ?? []).filter(
      (playlist) => playlist.spotifyId !== targetIdToExclude && !sourcePlaylistIds.includes(playlist.spotifyId)
    );
  }, [existingTargetId, overview, sourcePlaylistIds, targetType]);

  useEffect(() => {
    if (availableSourceOptions.length === 0) {
      setSourceToAdd('');
      return;
    }
    const stillExists = availableSourceOptions.some((playlist) => playlist.spotifyId === sourceToAdd);
    if (!stillExists) {
      setSourceToAdd(availableSourceOptions[0].spotifyId);
    }
  }, [availableSourceOptions, sourceToAdd]);

  const onSelectExistingTarget = (value: string) => {
    setExistingTargetId(value);
    const rule = rulesByTargetId.get(value);
    if (rule) {
      setMode(rule.mode);
      setSourcePlaylistIds([...rule.sourcePlaylistIds]);
    } else {
      setMode('exact_union');
      setSourcePlaylistIds([]);
    }
    setNoticeMessage('');
    setErrorMessage('');
  };

  const onAddSource = () => {
    if (!sourceToAdd || sourcePlaylistIds.includes(sourceToAdd)) {
      return;
    }
    setSourcePlaylistIds((prev) => [...prev, sourceToAdd]);
  };

  const onAddManualSource = () => {
    const parsedId = parseSpotifyPlaylistId(manualSourceInput);
    if (!parsedId) {
      setErrorMessage(t('aggregations.sources.manualInvalid'));
      return;
    }
    if (targetType === 'existing' && parsedId === existingTargetId) {
      setErrorMessage(t('aggregations.validation.targetAsSource'));
      return;
    }
    if (sourcePlaylistIds.includes(parsedId)) {
      setManualSourceInput('');
      return;
    }
    setErrorMessage('');
    setSourcePlaylistIds((prev) => [...prev, parsedId]);
    setManualSourceInput('');
  };

  const moveSource = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sourcePlaylistIds.length) {
      return;
    }
    setSourcePlaylistIds((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, moved);
      return copy;
    });
  };

  const removeSource = (spotifyId: string) => {
    setSourcePlaylistIds((prev) => prev.filter((sourceSpotifyId) => sourceSpotifyId !== spotifyId));
  };

  const onSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (targetType === 'existing' && !existingTargetId) {
      setErrorMessage(t('aggregations.validation.targetRequired'));
      return;
    }
    if (targetType === 'new' && !newTargetName.trim()) {
      setErrorMessage(t('aggregations.validation.newNameRequired'));
      return;
    }
    if (sourcePlaylistIds.length < 1) {
      setErrorMessage(t('aggregations.validation.sourcesRequired'));
      return;
    }
    setSaving(true);
    setNoticeMessage('');
    setErrorMessage('');

    apiPost<AggregationUpsertResponse>('/api/aggregations', {
      mode,
      newTargetName: targetType === 'new' ? newTargetName.trim() : undefined,
      sourcePlaylistIds,
      targetSpotifyId: targetType === 'existing' ? existingTargetId : undefined,
    })
      .then((result) => {
        const execution = result.execution;
        setNoticeMessage(
          t('aggregations.save.success', {
            added: execution.added,
            removed: execution.removed,
            target: playlistsById.get(execution.targetSpotifyId) ?? execution.targetSpotifyId,
          })
        );
        loadOverview(result.rule.targetSpotifyId);
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const onRunNow = () => {
    if (!currentTargetId) {
      return;
    }
    setRunning(true);
    setNoticeMessage('');
    setErrorMessage('');
    apiPost<AggregationExecutionResult>(`/api/aggregations/${currentTargetId}/run`)
      .then((execution) => {
        setNoticeMessage(
          t('aggregations.run.success', {
            added: execution.added,
            removed: execution.removed,
            target: playlistsById.get(execution.targetSpotifyId) ?? execution.targetSpotifyId,
          })
        );
        loadOverview(currentTargetId);
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setRunning(false);
      });
  };

  const onDelete = () => {
    if (!currentTargetId) {
      return;
    }
    setDeleting(true);
    setNoticeMessage('');
    setErrorMessage('');
    apiDelete<{ ok: boolean }>(`/api/aggregations/${currentTargetId}`)
      .then(() => {
        setNoticeMessage(t('aggregations.delete.success'));
        setExistingTargetId('');
        setSourcePlaylistIds([]);
        loadOverview();
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (!session?.authenticated) {
    return (
      <section className="panel">
        <h2>{t('aggregations.login.title')}</h2>
        <p className="muted">{t('aggregations.login.subtitle')}</p>
        <a className="btn" href={buildServerUrl('/auth/login')}>
          {t('aggregations.login.cta')}
        </a>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{t('aggregations.title')}</h2>
          <p className="muted">{t('aggregations.subtitle')}</p>
        </div>
      </div>

      {status === 'loading' && <div className="muted">{t('aggregations.loading')}</div>}
      {status === 'error' && <div className="error">{errorMessage}</div>}
      {noticeMessage ? <div className="notice success">{noticeMessage}</div> : null}
      {!noticeMessage && errorMessage ? <div className="error">{errorMessage}</div> : null}

      {status !== 'loading' && overview && (
        <div className="aggregation-layout">
          <aside className="aggregation-rules">
            <div className="aggregation-rules-header">
              <h3>{t('aggregations.rules.title')}</h3>
              <button type="button" className="btn secondary" onClick={resetForNewRule}>
                {t('aggregations.rules.new')}
              </button>
            </div>
            {overview.rules.length === 0 ? (
              <div className="muted">{t('aggregations.rules.empty')}</div>
            ) : (
              <div className="aggregation-rule-list">
                {overview.rules.map((rule) => (
                  <button
                    key={rule.targetSpotifyId}
                    type="button"
                    className={`aggregation-rule-item ${
                      targetType === 'existing' && existingTargetId === rule.targetSpotifyId ? 'active' : ''
                    }`}
                    onClick={() => hydrateEditorFromRule(rule)}
                  >
                    <div className="aggregation-rule-name">
                      {playlistsById.get(rule.targetSpotifyId) ?? rule.targetSpotifyId}
                    </div>
                    <div className="aggregation-rule-meta">{t(`aggregations.mode.${rule.mode}`)}</div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <form className="form aggregation-editor" onSubmit={onSave}>
            <div className="field">
              <span>{t('aggregations.targetType.label')}</span>
              <div className="inline-options">
                <label>
                  <input
                    type="radio"
                    name="targetType"
                    checked={targetType === 'existing'}
                    onChange={() => setTargetType('existing')}
                  />
                  {t('aggregations.targetType.existing')}
                </label>
                <label>
                  <input type="radio" name="targetType" checked={targetType === 'new'} onChange={resetForNewRule} />
                  {t('aggregations.targetType.new')}
                </label>
              </div>
            </div>

            {targetType === 'existing' ? (
              <label className="field">
                <span>{t('aggregations.target.existing')}</span>
                <select value={existingTargetId} onChange={(event) => onSelectExistingTarget(event.target.value)}>
                  <option value="">{t('aggregations.target.select')}</option>
                  {(overview.targetPlaylists ?? []).map((playlist) => (
                    <option key={playlist.spotifyId} value={playlist.spotifyId}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="field">
                <span>{t('aggregations.target.new')}</span>
                <input
                  type="text"
                  value={newTargetName}
                  onChange={(event) => setNewTargetName(event.target.value)}
                  placeholder={t('aggregations.target.newPlaceholder')}
                />
              </label>
            )}

            <label className="field">
              <span>{t('aggregations.mode.label')}</span>
              <select value={mode} onChange={(event) => setMode(event.target.value as AggregationMode)}>
                <option value="exact_union">{t('aggregations.mode.exact_union')}</option>
                <option value="add_missing">{t('aggregations.mode.add_missing')}</option>
              </select>
            </label>

            <div className="field">
              <span>{t('aggregations.sources.label')}</span>
              <div className="inline-select">
                <select value={sourceToAdd} onChange={(event) => setSourceToAdd(event.target.value)}>
                  <option value="">{t('aggregations.sources.select')}</option>
                  {availableSourceOptions.map((playlist) => (
                    <option key={playlist.spotifyId} value={playlist.spotifyId}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
                <button type="button" className="btn secondary" onClick={onAddSource} disabled={!sourceToAdd}>
                  {t('aggregations.sources.add')}
                </button>
              </div>
              <div className="inline-select">
                <input
                  type="text"
                  value={manualSourceInput}
                  onChange={(event) => setManualSourceInput(event.target.value)}
                  placeholder={t('aggregations.sources.manualPlaceholder')}
                />
                <button type="button" className="btn secondary" onClick={onAddManualSource}>
                  {t('aggregations.sources.manualAdd')}
                </button>
              </div>
            </div>

            <div className="aggregation-source-list">
              {sourcePlaylistIds.length === 0 ? (
                <div className="muted">{t('aggregations.sources.empty')}</div>
              ) : (
                sourcePlaylistIds.map((sourceSpotifyId, index) => (
                  <div key={sourceSpotifyId} className="aggregation-source-item">
                    <div className="aggregation-source-name">{playlistsById.get(sourceSpotifyId) ?? sourceSpotifyId}</div>
                    <div className="aggregation-source-actions">
                      <button type="button" className="btn secondary" onClick={() => moveSource(index, -1)}>
                        {t('aggregations.sources.up')}
                      </button>
                      <button type="button" className="btn secondary" onClick={() => moveSource(index, 1)}>
                        {t('aggregations.sources.down')}
                      </button>
                      <button type="button" className="btn secondary" onClick={() => removeSource(sourceSpotifyId)}>
                        {t('aggregations.sources.remove')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="form-actions aggregation-actions">
              <button type="submit" className="btn" disabled={saving}>
                {saving ? t('aggregations.save.saving') : t('aggregations.save.cta')}
              </button>
              <button type="button" className="btn secondary" disabled={!canRunNow || running} onClick={onRunNow}>
                {running ? t('aggregations.run.running') : t('aggregations.run.cta')}
              </button>
              <button type="button" className="btn secondary" disabled={!canDelete || deleting} onClick={onDelete}>
                {deleting ? t('aggregations.delete.deleting') : t('aggregations.delete.cta')}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default AggregationsPage;
