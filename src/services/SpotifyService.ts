import axios from 'axios';
import { getAccessToken } from './AuthService';

const spotifyApiBase = 'https://api.spotify.com/v1';

export class SpotifyService {
  static async getRecentlyPlayed(userId: string | null) {
    if (!userId) {
      throw new Error('User ID not found in localStorage.');
    }

    const accessToken = await getAccessToken(userId);
    // console.log(accessToken);

    // const accessToken = localStorage.getItem('spotifyAccessToken');
    if (!accessToken) {
      throw new Error('No access token found.');
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.get(`${spotifyApiBase}/me/player/recently-played`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
      throw error;
    }
  }
  static async getUserId(): Promise<string | null> {
    const accessToken = localStorage.getItem("spotifyAccessToken");
    if (!accessToken) {
      throw new Error("No access token found.");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.get(`${spotifyApiBase}/me`, { headers });
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw error;
    }
  }
}
