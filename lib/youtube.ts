

interface VideoItem {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export async function fetchPlaylistItems(playlistId: string, maxResults = 50): Promise<VideoItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('YOUTUBE_API_KEY is not set. Returning empty list.');
    return [];
  }
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(
    playlistId
  )}&maxResults=${maxResults}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Failed to fetch playlist items', res.status, await res.text());
    return [];
  }
  const data = await res.json();
  const items = data.items || [];
  return items.map((item: any) => {
    const snippet = item.snippet;
    const videoId = snippet.resourceId?.videoId || '';
    const title = snippet.title;
    const thumbnailUrl = snippet.thumbnails?.medium?.url || '';
    return { videoId, title, thumbnailUrl } as VideoItem;
  });
}
