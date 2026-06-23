import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ authenticated: false }),
  } as Response);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders brand title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Kurzzeitplaylists/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders refresh token link for authenticated users', async () => {
  vi.mocked(global.fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ authenticated: true, user: { displayName: 'Simon', spotifyId: 'u1' } }),
  } as Response);

  render(<App />);

  const refreshLink = await screen.findByText('nav.refreshToken');
  expect(refreshLink).toHaveAttribute('href', 'http://127.0.0.1:8888/auth/refresh-token');
});
