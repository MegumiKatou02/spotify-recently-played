import axios from 'axios';
import { db } from '@/config/Firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

/**
 * @param id query param ?user
 * @returns Promise<boolean>: return `true` if document exists else `false`
 */
export async function isDocExist(id: string): Promise<boolean> {
  try {
    const userDocRef = doc(collection(db, 'spotifyTokens'), id);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists();
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * @param userId
 * @returns
 */
export async function getAccessToken(userId: string): Promise<string | null> {
  const userDoc = await getDoc(doc(collection(db, 'spotifyTokens'), userId));
  if (!userDoc.exists()) {
    console.error('No token found for user:', userId);
    return null;
  }

  const data = userDoc.data();
  const { accessToken, refreshToken, expiresAt } = data;

  if (Date.now() < expiresAt) {
    return accessToken;
  }

  return await refreshAccessToken(userId, refreshToken);
}

/**
 * @param userId
 * @param refreshToken token refresh
 * @returns
 */
async function refreshAccessToken(userId: string, refreshToken: string): Promise<string | null> {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);
    formData.append('redirect_uri', redirectUri);
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const response = await axios.post(tokenEndpoint, formData);
    const newAccessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    await setDoc(doc(collection(db, 'spotifyTokens'), userId), {
      accessToken: newAccessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    });

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}
