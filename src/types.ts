export type Session = {
  authenticated: boolean;
  user?: {
    displayName: string;
    spotifyId: string;
  };
};

export type PlaylistSummary = {
  spotifyId: string;
  name: string;
  numberOfTracks: number;
  maxTrackAge: number | null;
  maxTracks: number | null;
  discardPlaylist: string | null;
};

export type PlaylistDetail = PlaylistSummary & {
  oldestTrack: {
    date: string;
    ageDays: number;
  };
};

export type PlaylistEditOptions = {
  playlist: PlaylistDetail;
  discardOptions: Array<{
    spotifyId: string;
    name: string;
  }>;
};

export type RecognizeResult = {
  newPlaylists: number;
  deletedPlaylists: number;
};
