/// <reference types="react-scripts" />

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      REACT_APP_SERVER_ORIGIN?: string;
      REACT_APP_API_BASE_URL?: string;
      REACT_APP_ROUTER_BASENAME?: string;
    };
  }
}

export {};
