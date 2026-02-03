/** Session payload returned by `/api/session`. */
export type Session = {
  authenticated: boolean;
  user?: {
    displayName: string;
    spotifyId: string;
  };
};

/** Summary payload for playlist list views. */
export type PlaylistSummary = {
  spotifyId: string;
  name: string;
  numberOfTracks: number;
  maxTrackAge: number | null;
  maxTracks: number | null;
  discardPlaylist: string | null;
};

/** Detailed playlist payload including oldest track info. */
export type PlaylistDetail = PlaylistSummary & {
  oldestTrack: {
    date: string;
    ageDays: number;
  };
};

/** Payload used by the playlist edit view. */
export type PlaylistEditOptions = {
  playlist: PlaylistDetail;
  discardOptions: Array<{
    spotifyId: string;
    name: string;
  }>;
};

/** Result of a playlist recognition sync. */
export type RecognizeResult = {
  newPlaylists: number;
  deletedPlaylists: number;
};
