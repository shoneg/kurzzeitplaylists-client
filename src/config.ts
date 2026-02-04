type RuntimeConfig = {
  REACT_APP_SERVER_ORIGIN?: string;
  REACT_APP_API_BASE_URL?: string;
  REACT_APP_ROUTER_BASENAME?: string;
};

const runtimeConfig: RuntimeConfig =
  typeof window !== 'undefined' && (window as any).__RUNTIME_CONFIG__
    ? (window as any).__RUNTIME_CONFIG__
    : {};

/** Server origin used for auth redirects and links. */
const SERVER_ORIGIN = runtimeConfig.REACT_APP_SERVER_ORIGIN || process.env.REACT_APP_SERVER_ORIGIN || '';
/** API base URL for JSON requests. */
const API_BASE_URL = runtimeConfig.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || SERVER_ORIGIN;
/** Router basename for deployments under sub-paths. */
export const ROUTER_BASENAME =
  runtimeConfig.REACT_APP_ROUTER_BASENAME || process.env.REACT_APP_ROUTER_BASENAME || '';

/**
 * Build a full server URL for auth and legacy endpoints.
 */
export const buildServerUrl = (path: string): string => {
  if (!SERVER_ORIGIN) {
    return path;
  }
  return `${SERVER_ORIGIN}${path}`;
};

/**
 * Build a full API URL for JSON requests.
 */
export const buildApiUrl = (path: string): string => {
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};
