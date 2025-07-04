import { INSTAGRAM_USER_ID, ACCESS_TOKEN } from "./secrets";

export const INSTAGRAM_API_URL = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}&limit=10`;

// Add more API URLs here as needed 