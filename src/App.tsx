import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppShell from './components/AppShell';
import { ROUTER_BASENAME } from './config';

/**
 * Application entry component wiring the router and shell.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter basename={ROUTER_BASENAME || undefined}>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
