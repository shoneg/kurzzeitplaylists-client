import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AggregationsPage from './AggregationsPage';
import { apiGet, apiPost } from '../api';

jest.mock('../api', () => ({
  apiDelete: jest.fn(),
  apiGet: jest.fn(),
  apiPost: jest.fn(),
}));

describe('AggregationsPage', () => {
  const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
  const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reorders sources with up/down and sends the ordered list on save', async () => {
    mockedApiGet.mockResolvedValue({
      playlists: [
        { name: 'Target', spotifyId: 'target' },
        { name: 'Source A', spotifyId: 'source-a' },
        { name: 'Source B', spotifyId: 'source-b' },
      ],
      targetPlaylists: [{ name: 'Target', spotifyId: 'target' }],
      rules: [
        {
          mode: 'exact_union',
          sourcePlaylistIds: ['source-a', 'source-b'],
          targetSpotifyId: 'target',
        },
      ],
    });
    mockedApiPost.mockResolvedValue({
      execution: {
        added: 1,
        desiredUnique: 2,
        mode: 'exact_union',
        removed: 0,
        skippedNoUri: 0,
        sourcePlaylistIds: ['source-b', 'source-a'],
        targetSpotifyId: 'target',
      },
      rule: {
        mode: 'exact_union',
        sourcePlaylistIds: ['source-b', 'source-a'],
        targetSpotifyId: 'target',
      },
    });

    render(
      <AggregationsPage
        session={{
          authenticated: true,
          user: { displayName: 'Test', spotifyId: 'u1' },
        }}
      />
    );

    await waitFor(() => expect(mockedApiGet).toHaveBeenCalledWith('/api/aggregations'));

    const downButtons = await screen.findAllByText('aggregations.sources.down');
    fireEvent.click(downButtons[0]);
    fireEvent.click(screen.getByText('aggregations.save.cta'));

    await waitFor(() =>
      expect(mockedApiPost).toHaveBeenCalledWith('/api/aggregations', {
        mode: 'exact_union',
        newTargetName: undefined,
        sourcePlaylistIds: ['source-b', 'source-a'],
        targetSpotifyId: 'target',
      })
    );
  });
});
