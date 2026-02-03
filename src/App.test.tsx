import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders brand title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Kurzzeitplaylists/i);
  expect(titleElement).toBeInTheDocument();
});
