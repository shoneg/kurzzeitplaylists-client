import React, { createContext, useContext, useMemo } from 'react';

type Language = 'en' | 'de' | 'fr' | 'es';

type Messages = Record<string, string>;

type I18nContextValue = {
  language: Language;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const messages: Record<Language, Messages> = {
  en: {
    'nav.home': 'Home',
    'nav.playlists': 'Playlists',
    'nav.delete': 'Delete Account',
    'nav.logout': 'Log out',
    'brand.subtitle': 'Spotify playlist cleanup, on your terms',
    'home.title': 'Short-lived playlists, long-lived control.',
    'home.description':
      'Kurzzeitplaylists keeps your Spotify playlists tidy by removing tracks after a set number of days or when you hit a limit. You decide the rules, we handle the routine.',
    'home.cta.loggedIn': 'Open your playlists',
    'home.cta.loggedOut': 'Log in with Spotify',
    'home.card.title': 'What you can do',
    'home.card.feature1': 'Set max track age or track count per playlist.',
    'home.card.feature2': 'Pick a discard playlist to collect removed tracks.',
    'home.card.feature3': 'Sync playlists directly from Spotify.',
    'home.status.title': 'Session status',
    'home.status.checking': 'Checking session...',
    'home.status.signedIn': 'Signed in as',
    'home.status.signedOut': 'Not logged in yet.',
    'playlists.title': 'Your playlists',
    'playlists.subtitle': 'Choose a playlist to set how long tracks should stay.',
    'playlists.sync': 'Sync playlists',
    'playlists.syncResult': 'Found {newPlaylists} new playlist(s), removed {deletedPlaylists} missing ones.',
    'playlists.loading': 'Loading playlists...',
    'playlists.empty': 'No playlists found yet. Try syncing or create one on Spotify.',
    'playlists.login.title': 'Log in to see your playlists',
    'playlists.login.subtitle': 'Connect your Spotify account to manage cleanup rules.',
    'playlists.login.cta': 'Log in with Spotify',
    'playlists.tag.maxAge': 'Max age {days} days',
    'playlists.tag.maxTracks': 'Max {count} tracks',
    'playlists.tag.discard': 'Discard playlist set',
    'playlists.tag.none': 'No rules set',
    'playlists.tracksLabel': 'Tracks',
    'playlist.back': 'Back to playlists',
    'playlist.oldest': 'Oldest track: {date} ({age} days ago)',
    'playlist.tracks': 'Tracks',
    'playlist.saved': 'Playlist rules saved.',
    'playlist.maxAge.label': 'Max age of tracks (days)',
    'playlist.maxAge.placeholder': 'Leave empty for no limit',
    'playlist.maxTracks.label': 'Max tracks in playlist',
    'playlist.maxTracks.placeholder': 'Leave empty for no limit',
    'playlist.discard.label': 'Discard playlist',
    'playlist.discard.none': 'No playlist (delete tracks)',
    'playlist.save': 'Save rules',
    'playlist.saving': 'Saving...',
    'playlist.loading': 'Loading playlist details...',
    'playlist.notFound': 'Playlist not found.',
    'playlist.login.title': 'Log in to edit playlists',
    'playlist.login.cta': 'Log in with Spotify',
    'delete.title': 'Delete account',
    'delete.description': 'This removes your Kurzzeitplaylists account and all cleanup rules. Your Spotify playlists stay intact.',
    'delete.confirmLabel': 'Type "Yes, I\'m sure!" to confirm',
    'delete.cta': 'Delete forever',
    'delete.login.title': 'Log in to delete your account',
    'delete.login.cta': 'Log in with Spotify',
    'notFound.title': 'Page not found',
    'notFound.body': "The page you are looking for doesn't exist.",
    'notFound.cta': 'Go home',
  },
  de: {
    'nav.home': 'Start',
    'nav.playlists': 'Playlists',
    'nav.delete': 'Account loeschen',
    'nav.logout': 'Abmelden',
    'brand.subtitle': 'Spotify-Playlists aufraeumen, nach deinen Regeln',
    'home.title': 'Kurzlebige Playlists, dauerhafte Kontrolle.',
    'home.description':
      'Kurzzeitplaylists haelt deine Spotify-Playlists sauber, indem Titel nach einer Anzahl von Tagen oder bei einem Limit entfernt werden. Du bestimmst die Regeln, wir erledigen den Rest.',
    'home.cta.loggedIn': 'Zu deinen Playlists',
    'home.cta.loggedOut': 'Mit Spotify anmelden',
    'home.card.title': 'Das kannst du einstellen',
    'home.card.feature1': 'Maximales Alter oder Track-Anzahl pro Playlist.',
    'home.card.feature2': 'Eine Ziel-Playlist fuer entfernte Titel waehlen.',
    'home.card.feature3': 'Playlists direkt mit Spotify synchronisieren.',
    'home.status.title': 'Sitzungsstatus',
    'home.status.checking': 'Sitzung wird geprueft...',
    'home.status.signedIn': 'Angemeldet als',
    'home.status.signedOut': 'Noch nicht angemeldet.',
    'playlists.title': 'Deine Playlists',
    'playlists.subtitle': 'Waehle eine Playlist, um Regeln fuer die Titel zu setzen.',
    'playlists.sync': 'Playlists synchronisieren',
    'playlists.syncResult': '{newPlaylists} neue Playlist(s) gefunden, {deletedPlaylists} fehlende entfernt.',
    'playlists.loading': 'Playlists werden geladen...',
    'playlists.empty': 'Noch keine Playlists gefunden. Synchronisiere oder erstelle eine bei Spotify.',
    'playlists.login.title': 'Melde dich an, um deine Playlists zu sehen',
    'playlists.login.subtitle': 'Verbinde dein Spotify-Konto, um Regeln zu verwalten.',
    'playlists.login.cta': 'Mit Spotify anmelden',
    'playlists.tag.maxAge': 'Max. Alter {days} Tage',
    'playlists.tag.maxTracks': 'Max. {count} Titel',
    'playlists.tag.discard': 'Ziel-Playlist gesetzt',
    'playlists.tag.none': 'Keine Regeln gesetzt',
    'playlists.tracksLabel': 'Titel',
    'playlist.back': 'Zurueck zu den Playlists',
    'playlist.oldest': 'Aeltester Titel: {date} (vor {age} Tagen)',
    'playlist.tracks': 'Titel',
    'playlist.saved': 'Playlist-Regeln gespeichert.',
    'playlist.maxAge.label': 'Maximales Alter der Titel (Tage)',
    'playlist.maxAge.placeholder': 'Leer lassen fuer kein Limit',
    'playlist.maxTracks.label': 'Maximale Anzahl von Titeln',
    'playlist.maxTracks.placeholder': 'Leer lassen fuer kein Limit',
    'playlist.discard.label': 'Ziel-Playlist',
    'playlist.discard.none': 'Keine Playlist (Titel loeschen)',
    'playlist.save': 'Regeln speichern',
    'playlist.saving': 'Speichern...',
    'playlist.loading': 'Playlist-Details werden geladen...',
    'playlist.notFound': 'Playlist nicht gefunden.',
    'playlist.login.title': 'Melde dich an, um Playlists zu bearbeiten',
    'playlist.login.cta': 'Mit Spotify anmelden',
    'delete.title': 'Account loeschen',
    'delete.description': 'Dies entfernt deinen Kurzzeitplaylists-Account und alle Regeln. Deine Spotify-Playlists bleiben erhalten.',
    'delete.confirmLabel': 'Tippe "Yes, I\'m sure!" zur Bestaetigung',
    'delete.cta': 'Endgueltig loeschen',
    'delete.login.title': 'Melde dich an, um deinen Account zu loeschen',
    'delete.login.cta': 'Mit Spotify anmelden',
    'notFound.title': 'Seite nicht gefunden',
    'notFound.body': 'Die gesuchte Seite existiert nicht.',
    'notFound.cta': 'Zur Startseite',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.playlists': 'Playlists',
    'nav.delete': 'Supprimer le compte',
    'nav.logout': 'Se deconnecter',
    'brand.subtitle': 'Nettoyage des playlists Spotify, selon vos regles',
    'home.title': 'Playlists courtes, controle durable.',
    'home.description':
      'Kurzzeitplaylists garde vos playlists Spotify propres en supprimant des titres apres un certain nombre de jours ou a un seuil fixe. Vous fixez les regles, on s\'occupe du reste.',
    'home.cta.loggedIn': 'Ouvrir vos playlists',
    'home.cta.loggedOut': 'Se connecter avec Spotify',
    'home.card.title': 'Ce que vous pouvez faire',
    'home.card.feature1': 'Fixer un age max ou un nombre de titres par playlist.',
    'home.card.feature2': 'Choisir une playlist de decharge pour les titres retires.',
    'home.card.feature3': 'Synchroniser les playlists depuis Spotify.',
    'home.status.title': 'Etat de session',
    'home.status.checking': 'Verification de la session...',
    'home.status.signedIn': 'Connecte en tant que',
    'home.status.signedOut': 'Pas encore connecte.',
    'playlists.title': 'Vos playlists',
    'playlists.subtitle': 'Choisissez une playlist pour definir la duree des titres.',
    'playlists.sync': 'Synchroniser les playlists',
    'playlists.syncResult': '{newPlaylists} nouvelle(s) playlist(s), {deletedPlaylists} manquante(s) retiree(s).',
    'playlists.loading': 'Chargement des playlists...',
    'playlists.empty': 'Aucune playlist pour le moment. Synchronisez ou creez-en une sur Spotify.',
    'playlists.login.title': 'Connectez-vous pour voir vos playlists',
    'playlists.login.subtitle': 'Connectez votre compte Spotify pour gerer les regles.',
    'playlists.login.cta': 'Se connecter avec Spotify',
    'playlists.tag.maxAge': 'Age max {days} jours',
    'playlists.tag.maxTracks': 'Max {count} titres',
    'playlists.tag.discard': 'Playlist de decharge definie',
    'playlists.tag.none': 'Aucune regle',
    'playlists.tracksLabel': 'Titres',
    'playlist.back': 'Retour aux playlists',
    'playlist.oldest': 'Titre le plus ancien : {date} (il y a {age} jours)',
    'playlist.tracks': 'Titres',
    'playlist.saved': 'Regles enregistrees.',
    'playlist.maxAge.label': 'Age max des titres (jours)',
    'playlist.maxAge.placeholder': 'Laisser vide pour aucun limite',
    'playlist.maxTracks.label': 'Nombre max de titres',
    'playlist.maxTracks.placeholder': 'Laisser vide pour aucun limite',
    'playlist.discard.label': 'Playlist de decharge',
    'playlist.discard.none': 'Aucune playlist (supprimer les titres)',
    'playlist.save': 'Enregistrer',
    'playlist.saving': 'Enregistrement...',
    'playlist.loading': 'Chargement des details...',
    'playlist.notFound': 'Playlist introuvable.',
    'playlist.login.title': 'Connectez-vous pour modifier les playlists',
    'playlist.login.cta': 'Se connecter avec Spotify',
    'delete.title': 'Supprimer le compte',
    'delete.description': 'Cela supprime votre compte Kurzzeitplaylists et toutes les regles. Vos playlists Spotify restent intactes.',
    'delete.confirmLabel': 'Tapez "Yes, I\'m sure!" pour confirmer',
    'delete.cta': 'Supprimer definitivement',
    'delete.login.title': 'Connectez-vous pour supprimer votre compte',
    'delete.login.cta': 'Se connecter avec Spotify',
    'notFound.title': 'Page introuvable',
    'notFound.body': 'La page demandee n\'existe pas.',
    'notFound.cta': 'Retour a l\'accueil',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.playlists': 'Playlists',
    'nav.delete': 'Eliminar cuenta',
    'nav.logout': 'Cerrar sesion',
    'brand.subtitle': 'Limpieza de playlists de Spotify, a tu manera',
    'home.title': 'Playlists temporales, control duradero.',
    'home.description':
      'Kurzzeitplaylists mantiene tus playlists de Spotify limpias eliminando canciones despues de ciertos dias o al llegar a un limite. Tu defines las reglas, nosotros hacemos el resto.',
    'home.cta.loggedIn': 'Abrir tus playlists',
    'home.cta.loggedOut': 'Iniciar sesion con Spotify',
    'home.card.title': 'Lo que puedes hacer',
    'home.card.feature1': 'Definir edad maxima o cantidad de pistas por playlist.',
    'home.card.feature2': 'Elegir una playlist de descarte para los temas eliminados.',
    'home.card.feature3': 'Sincronizar playlists directamente desde Spotify.',
    'home.status.title': 'Estado de sesion',
    'home.status.checking': 'Comprobando sesion...',
    'home.status.signedIn': 'Conectado como',
    'home.status.signedOut': 'Aun no has iniciado sesion.',
    'playlists.title': 'Tus playlists',
    'playlists.subtitle': 'Elige una playlist para definir el tiempo de las canciones.',
    'playlists.sync': 'Sincronizar playlists',
    'playlists.syncResult': 'Encontradas {newPlaylists} playlist(s) nueva(s), eliminadas {deletedPlaylists} faltantes.',
    'playlists.loading': 'Cargando playlists...',
    'playlists.empty': 'No se encontraron playlists. Sincroniza o crea una en Spotify.',
    'playlists.login.title': 'Inicia sesion para ver tus playlists',
    'playlists.login.subtitle': 'Conecta tu cuenta de Spotify para gestionar reglas.',
    'playlists.login.cta': 'Iniciar sesion con Spotify',
    'playlists.tag.maxAge': 'Edad max {days} dias',
    'playlists.tag.maxTracks': 'Max {count} pistas',
    'playlists.tag.discard': 'Playlist de descarte definida',
    'playlists.tag.none': 'Sin reglas',
    'playlists.tracksLabel': 'Pistas',
    'playlist.back': 'Volver a playlists',
    'playlist.oldest': 'Cancion mas antigua: {date} (hace {age} dias)',
    'playlist.tracks': 'Pistas',
    'playlist.saved': 'Reglas guardadas.',
    'playlist.maxAge.label': 'Edad maxima de canciones (dias)',
    'playlist.maxAge.placeholder': 'Dejar vacio para no limitar',
    'playlist.maxTracks.label': 'Maximo de pistas',
    'playlist.maxTracks.placeholder': 'Dejar vacio para no limitar',
    'playlist.discard.label': 'Playlist de descarte',
    'playlist.discard.none': 'Sin playlist (eliminar pistas)',
    'playlist.save': 'Guardar reglas',
    'playlist.saving': 'Guardando...',
    'playlist.loading': 'Cargando detalles...',
    'playlist.notFound': 'Playlist no encontrada.',
    'playlist.login.title': 'Inicia sesion para editar playlists',
    'playlist.login.cta': 'Iniciar sesion con Spotify',
    'delete.title': 'Eliminar cuenta',
    'delete.description': 'Esto elimina tu cuenta de Kurzzeitplaylists y todas las reglas. Tus playlists de Spotify permanecen intactas.',
    'delete.confirmLabel': 'Escribe "Yes, I\'m sure!" para confirmar',
    'delete.cta': 'Eliminar para siempre',
    'delete.login.title': 'Inicia sesion para eliminar tu cuenta',
    'delete.login.cta': 'Iniciar sesion con Spotify',
    'notFound.title': 'Pagina no encontrada',
    'notFound.body': 'La pagina que buscas no existe.',
    'notFound.cta': 'Volver al inicio',
  },
};

const detectLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  const candidates = navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    if (normalized.startsWith('de')) return 'de';
    if (normalized.startsWith('fr')) return 'fr';
    if (normalized.startsWith('es')) return 'es';
    if (normalized.startsWith('en')) return 'en';
  }
  return 'en';
};

const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  t: (key) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = useMemo(() => detectLanguage(), []);

  const value = useMemo<I18nContextValue>(() => {
    const fallback = messages.en;
    const current = messages[language] ?? fallback;
    const t = (key: string, vars?: Record<string, string | number>) => {
      const template = current[key] ?? fallback[key] ?? key;
      if (!vars) {
        return template;
      }
      return Object.entries(vars).reduce((text, [varKey, varValue]) => {
        return text.replaceAll(`{${varKey}}`, String(varValue));
      }, template);
    };
    return { language, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => useContext(I18nContext);
