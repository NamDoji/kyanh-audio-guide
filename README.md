# Ky Anh Underground Tunnel Audio Guide

Mobile-first bilingual website for the **Ky Anh Underground Tunnel Audio Guide / Hướng dẫn Audio Địa đạo Kỳ Anh**.

The site is designed for onsite visitors who scan QR codes at the entrance or at each stop, then listen to audio, read summaries, view an illustrated route map, and send feedback without installing an app.

## Features

- Next.js full-stack app with public pages and admin editing UI
- Vietnamese / English language switch saved in `localStorage`
- Bilingual audio player with large mobile controls, progress bar, replay, and transcript
- 6 fixed QR routes: `/stops/1` to `/stops/6`
- Illustrated route map and printable QR management page
- Feedback form with validation and local JSONL storage
- Admin CMS at `/admin` for editing stop titles, summaries, transcripts, audio paths, image paths, and duration
- Tunnel Mode theme, font size controls, sticky header, and mobile bottom navigation
- SEO metadata and sitemap

## Tech Stack

- Frontend: Next.js App Router, React, TypeScript
- Styling: Tailwind CSS v4 plus CSS variables
- Data: `data/stops.json`
- Backend: Next.js API routes
- QR: `qrcode.react`
- Icons: `lucide-react`

## Install

```bash
cd /Users/cuongdoji/.openclaw/workspace/code_projects/kyanh-audio-guide
npm install
```

## Run Local

```bash
npm run dev
```

Open:

- Local: http://localhost:3000
- Phone/tablet on same WiFi: use your Mac IP, for example `http://192.168.x.x:3000`

## Build

```bash
npm run lint
npm run build
```

## Content Model

Main content lives in:

```text
data/stops.json
```

Each stop contains:

- bilingual title, subtitle, summary, transcript, location, reflection
- bilingual highlight list
- audio path for VI and EN
- image path
- fixed QR path
- map marker position

## Admin Editing

Open:

```text
/admin
```

The MVP admin edits `data/stops.json` through API route:

```text
PUT /api/stops/:id
```

This works well for local operation and demos. For production on Vercel/Netlify, replace file writing with a durable store such as PostgreSQL, Supabase, Vercel KV, or a headless CMS.

## Replace Real Audio

Demo audio files are in:

```text
public/audio/
```

Current demo files use `.m4a` because they play well on iOS Safari and Android Chrome:

```text
stop1_vi.m4a
stop1_en.m4a
...
stop6_vi.m4a
stop6_en.m4a
```

To use final recordings:

1. Export each stop as MP3 or M4A.
2. Place files in `public/audio/`.
3. Update the path in `/admin` or directly in `data/stops.json`.
4. Keep one Vietnamese file and one English file for each stop.

Recommended final length: 90-120 seconds per stop.

## Replace Real Images

Placeholder illustrations are in:

```text
public/images/
```

Replace or add images such as:

- `tunnel-entrance.jpg`
- `bamboo-village.jpg`
- `coastal-village.jpg`
- `underground-life.jpg`
- `warning-system.jpg`
- `strategic-map.jpg`
- `heritage.jpg`

Then update `image` path in `/admin` or `data/stops.json`.

## Add a New Stop

1. Add a new stop object in `data/stops.json`.
2. Use the next numeric `id`.
3. Add bilingual audio paths and image path.
4. Add the marker position:

```json
"mapPosition": { "x": 50, "y": 50 }
```

5. If needed, add a QR sign from `/qr`.

## Deploy

### Vercel

```bash
npm run build
vercel
```

Set:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.vn
```

### Netlify

Use Next.js support, build command:

```text
npm run build
```

Publish settings are handled by the Next.js adapter.

### GitHub Pages

This project uses API routes for admin and feedback, so GitHub Pages is only suitable for a static public export after removing backend features or using an external backend.

## Field Launch Checklist

- Replace all demo audio with final VI/EN recordings
- Replace placeholder illustrations with approved site photos or heritage illustrations
- Verify QR links use the final domain
- Print one QR sign per stop
- Test on iPhone Safari, Android Chrome, iPad, laptop, and desktop
- Test with mobile data and weak WiFi
- Confirm audio volume guidance and safety notes are visible
- Review historical text with the site management board
- Add production persistence for admin edits and feedback
- Add contact email/phone for Ban Quản lý di tích

## Routes

- `/` home
- `/language`
- `/stops`
- `/stops/1` ... `/stops/6`
- `/map`
- `/qr`
- `/credits`
- `/feedback`
- `/admin`
- `/sitemap.xml`
