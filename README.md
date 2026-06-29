# 🏛️ Kỳ Anh Tunnel Audio Guide

> **A free, QR-based audio guide for a Vietnamese National Historical Site — built to make history accessible to every visitor, at no cost.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kyanh--audio--guide.vercel.app-0070f3?style=flat-square&logo=vercel)](https://kyanh-audio-guide.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🌍 The Problem

The **Kỳ Anh Underground Tunnel** is a Vietnamese National Historical Site — a 32 km tunnel network built by hand in 1965 by local villagers, sheltering over 1,500 people during wartime. Today, it receives hundreds of visitors each year.

Yet most visitors leave without truly understanding what they see:

- 🗣️ **No audio guide exists** — visitors rely on a single on-site staff member or skip interpretation entirely
- 🌐 **International visitors** cannot access explanations in their language
- 📱 **No app** has ever been built for the site
- 💸 **Hiring a private guide is expensive** and not accessible to school groups or local families

## ✅ The Solution

A **mobile-first, bilingual web app** that visitors open by scanning a QR code at the entrance — no download, no account, no cost.

| Feature | Details |
|---|---|
| 🔊 Audio storytelling | 7 stops × 2 languages (Vietnamese + English) |
| 📱 No app required | Runs in any mobile browser via QR code |
| 🗺️ Interactive route map | Visual path through all 7 stops |
| 🌐 Bilingual | Full VI/EN with one-tap language switch |
| ♿ Accessibility | Large mobile controls, adjustable font size, high contrast tunnel mode |
| 🛠️ Admin CMS | Site staff can update content without code |
| 💬 Visitor feedback | Built-in feedback form for continuous improvement |

**Demo:** [kyanh-audio-guide.vercel.app](https://kyanh-audio-guide.vercel.app)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Runtime | React 19 |
| Storage | Vercel Blob (audio/image), JSON (content) |
| QR | qrcode.react |
| Deployment | Vercel (free tier) |

---

## 📐 Architecture

```
kyanh-audio-guide/
├── src/app/
│   ├── page.tsx              # Home / Introduction
│   ├── stops/[id]/           # Audio stop pages (1–7)
│   ├── map/                  # Interactive route map
│   ├── feedback/             # Visitor feedback form
│   ├── qr/                   # Printable QR management
│   ├── admin/                # CMS for site staff
│   └── api/                  # Next.js API routes
├── data/
│   └── stops.json            # Bilingual content for all stops
└── public/
    ├── audio/                # VI + EN audio files (.mp3)
    └── images/               # Stop illustrations
```

---

## 🎧 The 7 Stops

| # | Vietnamese | English |
|---|---|---|
| 1 | Cổng vào & Bối cảnh lịch sử | Entrance & Historical Context |
| 2 | Câu chuyện xây dựng | The Construction Story |
| 3 | Cuộc sống dưới lòng đất | Life Underground |
| 4 | Hệ thống cảnh báo | The Warning System |
| 5 | Vị trí chiến lược | Strategic Position |
| 6 | Di sản và công nhận | Heritage & Recognition |
| 7 | Điểm kết thúc | Final Stop |

Each stop has: bilingual audio (~2 min), written summary, highlights, and a reflection prompt.

---

## 🚀 Run Locally

```bash
git clone https://github.com/NamDoji/kyanh-audio-guide.git
cd kyanh-audio-guide
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌱 Community Impact

This project was built **pro bono** for the local community around Kỳ Anh, Quảng Nam province:

- **Free to use** — no ticket, no app, no account required for visitors
- **Preserves oral history** — stories recorded and structured for future generations
- **Enables independent exploration** — visitors set their own pace without needing a guide
- **Opens the site to the world** — English support brings international visitors into the story
- **Transferable model** — the codebase can be adapted for other historical sites in Vietnam with minimal effort

> *"Technology should lower barriers, not build new ones. This project exists because local history deserves to be heard by everyone."*

---

## 🛠️ Content Management

Site staff (non-technical) can update stop titles, summaries, transcripts, and audio files through the built-in admin panel at `/admin` — no GitHub access or coding knowledge required.

---

## 📄 License

MIT — free to fork and adapt for other Vietnamese historical sites.

---

## 👤 Author

**Do Bao Nam** — built as a community service project to support cultural heritage preservation in Quảng Nam province, Vietnam.

GitHub: [@NamDoji](https://github.com/NamDoji)
