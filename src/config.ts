type RuntimeConfig = {
  REACT_APP_SERVER_ORIGIN?: string;
  REACT_APP_API_BASE_URL?: string;
  REACT_APP_ROUTER_BASENAME?: string;
  REACT_APP_SERVER_BASE_PATH?: string;
};

const runtimeConfig: RuntimeConfig =
  typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__
    ? (window as any).__RUNTIME_CONFIG__
    : {};

const normalizeBasePath = (value: string | undefined): string => {
  if (!value) {
    return '';
  }
  const withSlash = value.startsWith('/') ? value : `/${value}`;
  return withSlash.length > 1 && withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
};

/** Server origin used for auth redirects and links. */
const SERVER_ORIGIN = runtimeConfig.REACT_APP_SERVER_ORIGIN || process.env.REACT_APP_SERVER_ORIGIN || '';
/** API base URL for JSON requests. */
const API_BASE_URL = runtimeConfig.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || SERVER_ORIGIN;
/** Optional base path for server routes (e.g., /kzp-api). */
const SERVER_BASE_PATH = normalizeBasePath(
  runtimeConfig.REACT_APP_SERVER_BASE_PATH || process.env.REACT_APP_SERVER_BASE_PATH
);
/** Router basename for deployments under sub-paths. */
export const ROUTER_BASENAME =
  runtimeConfig.REACT_APP_ROUTER_BASENAME || process.env.REACT_APP_ROUTER_BASENAME || '';

/**
 * Build a full server URL for auth and legacy endpoints.
 */
export const buildServerUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const withBase = `${SERVER_BASE_PATH}${normalizedPath}`;
  if (!SERVER_ORIGIN) {
    return withBase;
  }
  return `${SERVER_ORIGIN}${withBase}`;
};

/**
 * Build a full API URL for JSON requests.
 */
export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const withBase = `${SERVER_BASE_PATH}${normalizedPath}`;
  if (!API_BASE_URL) {
    return withBase;
  }
  return `${API_BASE_URL}${withBase}`;
};
