import api from './api';

// Field names used by the Create Music request. Change them in .env if needed.
const FILE_FIELD = import.meta.env.VITE_MUSIC_FILE_FIELD || 'music';
const URL_FIELD = import.meta.env.VITE_MUSIC_URL_FIELD || 'uri';

const firstArray = (data, keys) => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
};

export function normalizeTrack(raw, fallbackArtist = '') {
  if (typeof raw === 'string') {
    return {
      id: raw, title: 'Untitled track', artistName: fallbackArtist || 'Unknown artist',
      artistId: null, audioUrl: null, cover: null, albumId: null, albumTitle: '', createdAt: null,
    };
  }
  const artist = raw.artist;
  const album = raw.album;
  return {
    id: raw._id || raw.id,
    title: raw.title || raw.name || 'Untitled track',
    artistName: artist?.username || artist?.name || raw.artistName || fallbackArtist || 'Unknown artist',
    artistId: artist?._id || artist?.id || (typeof artist === 'string' ? artist : null),
    audioUrl: raw.uri || raw.url || raw.audioUrl || raw.audio || raw.src || null,
    cover: raw.coverImage || raw.cover || raw.image || raw.thumbnail || null,
    albumId: album?._id || album?.id || (typeof album === 'string' ? album : null),
    albumTitle: album?.title || raw.albumTitle || '',
    createdAt: raw.createdAt || null,
  };
}

export function normalizeAlbum(raw) {
  const artistName = raw.artist?.username || raw.artist?.name || raw.artistName || '';
  const tracks = firstArray(raw, ['musics', 'tracks', 'songs']).map((t) => normalizeTrack(t, artistName));
  return {
    id: raw._id || raw.id,
    title: raw.title || raw.name || 'Untitled album',
    artistName: artistName || tracks[0]?.artistName || '',
    cover: raw.coverImage || raw.cover || raw.image || null,
    tracks,
  };
}

export async function fetchAllMusic() {
  const { data } = await api.get('/music/');
  return firstArray(data, ['musics', 'music', 'tracks', 'songs', 'data']).map((t) => normalizeTrack(t));
}

export async function fetchAlbum(albumId) {
  const { data } = await api.get(`/music/albums/${encodeURIComponent(albumId)}`);
  const raw = data?.album || data?.data || data;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Unexpected album response from the server.');
  }
  return normalizeAlbum(raw);
}

export async function createMusic({ title, mode, file, audioUrl, coverUrl }) {
  if (mode === 'file') {
    const form = new FormData();
    form.append('title', title);
    form.append(FILE_FIELD, file);
    if (coverUrl) form.append('coverImage', coverUrl);
    const { data } = await api.post('/music/create', form);
    return data;
  }
  const body = { title, [URL_FIELD]: audioUrl };
  if (coverUrl) body.coverImage = coverUrl;
  const { data } = await api.post('/music/create', body);
  return data;
}

export async function createAlbum({ title, musicIds }) {
  const { data } = await api.post('/music/album', { title, musics: musicIds });
  const raw = data?.album || data?.data || data;
  return { id: raw?._id || raw?.id || null, title: raw?.title || title };
}
