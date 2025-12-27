import { INSTAGRAM_USER_ID, ACCESS_TOKEN } from '../../utils/secrets';

/**
 * Fetches Instagram posts from the Instagram Graph API
 * @param {number} limit - Number of posts to fetch (default: 12)
 * @returns {Promise<Array>} Array of Instagram post objects
 */
export async function fetchInstagramPosts(limit = 12) {
  try {
    // Check if credentials are available
    if (!INSTAGRAM_USER_ID || !ACCESS_TOKEN) {
      console.warn('Instagram credentials not found. Using fallback images.');
      return [];
    }

    // Use the correct Instagram Graph API endpoint format
    // For Instagram Business accounts, use: /{ig-user-id}/media
    // Make sure INSTAGRAM_USER_ID is the Instagram Business Account ID, not the Facebook Page ID
    const url = `https://graph.facebook.com/v18.0/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp,video_url&access_token=${ACCESS_TOKEN}&limit=${limit}`;
    
    console.log('Fetching Instagram posts from:', url.replace(ACCESS_TOKEN, 'ACCESS_TOKEN_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API response error:', response.status, response.statusText, errorText);
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Instagram API error response:', data.error);
      throw new Error(`Instagram API error: ${data.error.message} (Code: ${data.error.code})`);
    }
    
    if (!data.data || data.data.length === 0) {
      console.warn('No Instagram posts found');
      return [];
    }
    
    // Filter and format posts
    const posts = data.data.map(post => ({
      id: post.id,
      caption: post.caption || '',
      imageUrl: post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url,
      videoUrl: post.media_type === 'VIDEO' ? (post.video_url || post.media_url) : null,
      permalink: post.permalink,
      mediaType: post.media_type,
      timestamp: post.timestamp,
      // Extract hashtags and mentions from caption
      hashtags: post.caption ? (post.caption.match(/#\w+/g) || []) : [],
    }));
    
    console.log(`Successfully fetched ${posts.length} Instagram posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    // Return empty array on error to prevent breaking the page
    return [];
  }
}

/**
 * Formats Instagram caption for display
 * @param {string} caption - Instagram post caption
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Formatted caption
 */
export function formatInstagramCaption(caption, maxLength = 100) {
  if (!caption) return '';
  if (caption.length <= maxLength) return caption;
  return caption.substring(0, maxLength) + '...';
}

