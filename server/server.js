import express from 'express'
import cors from 'cors'

const app = express();
const port = 3000;

app.use(cors());

const recentlyPlayedTracks = {
  items: [
    {
      track: {
        name: 'Song 1',
        artists: [{ name: 'Artist 1' }],
        album: {
          images: [{ url: 'https://via.placeholder.com/150' }],
        },
        external_urls: {
          spotify: 'https://open.spotify.com/track/1',
        },
      },
      played_at: '2023-10-01T12:00:00Z',
    },
    {
      track: {
        name: 'Song 2',
        artists: [{ name: 'Artist 2' }],
        album: {
          images: [{ url: 'https://via.placeholder.com/150' }],
        },
        external_urls: {
          spotify: 'https://open.spotify.com/track/2',
        },
      },
      played_at: '2023-10-02T12:00:00Z',
    },
  ],
};

app.get('/api/recently-played', (req, res) => {
  // const { user } = req.query;
  res.json(recentlyPlayedTracks);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
