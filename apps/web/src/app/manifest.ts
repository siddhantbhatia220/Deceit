import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DECEIT — Secret-Word Imposter Game',
    short_name: 'DECEIT',
    description: 'A real-time social deduction party game. Give clues, read the room, find the imposter.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    background_color: '#10191a',
    theme_color: '#10191a',
    orientation: 'portrait-primary',
    categories: ['games', 'entertainment', 'social'],
    lang: 'en',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Quick Play (Pass & Play)',
        short_name: 'Pass & Play',
        description: 'Start a local pass-and-play game immediately',
        url: '/?mode=local',
        icons: [{ src: '/icon.svg', sizes: 'any' }],
      },
    ],
  };
}
