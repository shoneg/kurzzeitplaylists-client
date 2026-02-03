const SERVER_ORIGIN = process.env.REACT_APP_SERVER_ORIGIN || '';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || SERVER_ORIGIN;
export const ROUTER_BASENAME = process.env.REACT_APP_ROUTER_BASENAME || '';

export const buildServerUrl = (path: string): string => {
  if (!SERVER_ORIGIN) {
    return path;
  }
  return `${SERVER_ORIGIN}${path}`;
};

export const buildApiUrl = (path: string): string => {
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};
