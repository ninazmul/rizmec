import React from 'react';
import { fetchPlaylistItems } from '@/lib/youtube';

interface VideoItem {
  videoId: string;
  title: string;
  thumbnailUrl: string;
}

export const YouTubePlaylist: React.FC<{ playlistId: string }> = async ({ playlistId }) => {
  const videos: VideoItem[] = await fetchPlaylistItems(playlistId);

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 max-w-4xl mx-auto w-full">
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/50">
          <iframe
            src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
            title="RIZMEC YouTube Playlist"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="text-neutral-500 font-mono text-xs mt-4 text-center">
          Direct playlist feed • Click the playlist icon at top-right of player to view all videos
        </p>
      </div>
    );
  }

  return (
    <section className="youtube-grid">
      {videos.map((video) => (
        <div key={video.videoId} className="youtube-item">
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="video-title">{video.title}</div>
        </div>
      ))}
    </section>
  );
};
