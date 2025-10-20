// YouTube.tsx
// Responsive, privacy-friendly YouTube embed component.
//
// Props:
// - url: string (required)
//     Any YouTube URL format is accepted: watch?v=, youtu.be/, embed/, or shorts/.
// - title?: string
//     Accessible title for the iframe. Defaults to 'YouTube video'.
// - className?: string
//     Applied to the outer wrapper. Use this to control width/margins (e.g., 'max-w-3xl mx-auto').
// - aspect?: number
//     Aspect ratio as width/height (default 16/9). Example: 4/3, 1/1.
// - allowFullScreen?: boolean
//     Whether to allow fullscreen (default true).
// - start?: number
//     Start time in seconds for the video (optional).
//
// Usage examples:
//   <YouTube url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
//   <YouTube url="https://youtu.be/abc123" aspect={4/3} className="max-w-md" />
//   <YouTube url="https://www.youtube.com/shorts/xyz987" start={30} />

import React from 'react';

type YouTubeProps = {
  url: string;
  title?: string;
  className?: string;
  aspect?: number;
  allowFullScreen?: boolean;
  start?: number;
};

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    // watch?v=, youtu.be/, embed/, shorts/
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    const v = u.searchParams.get('v');
    if (v) return v;
    const parts = u.pathname.split('/').filter(Boolean);
    const idx = parts.findIndex((p) => p === 'embed' || p === 'shorts');
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

export default function YouTube({
  url,
  title = 'YouTube video',
  className = '',
  aspect = 16 / 9,
  allowFullScreen = true,
  start,
}: YouTubeProps) {
  const id = extractVideoId(url);
  if (!id) return null;

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    ...(start ? { start: String(start) } : {}),
  });

  const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  const paddingTop = `${(1 / aspect) * 100}%`; // e.g., 56.25% for 16:9

  return (
    <div className={`relative w-full ${className}`} style={{ paddingTop }}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full rounded-md"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        {...(allowFullScreen ? { allowFullScreen: true } : {})}
      />
    </div>
  );
}


