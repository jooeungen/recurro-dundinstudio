# Quick Start Guide

Get your Recurro website running in 3 steps:

## 1️⃣ Install Dependencies

```bash
cd recurro-website
npm install
```

## 2️⃣ Start Development Server

```bash
npm run dev
```

## 3️⃣ Open in Browser

- **English**: http://localhost:3000/en
- **Korean**: http://localhost:3000/ko

---

## 🎯 What You'll See

- ✅ Beautiful landing page with hero section
- ✅ App screenshots
- ✅ 6 use-case categories
- ✅ 5 key features
- ✅ Why choose Recurro section
- ✅ Download CTAs (iOS + Android)
- ✅ Language switcher (EN ↔ KO)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Smooth animations

---

## 📝 Customization Quick Tips

### Change Colors
Edit `tailwind.config.ts` → `theme.extend.colors`

### Update Content
Edit translation files:
- `src/locales/en/common.json` (English)
- `src/locales/ko/common.json` (Korean)

### Add/Replace Screenshots
Place images in `public/screenshots/`:
- `1.png` (first screenshot)
- `2.png` (second screenshot)

---

## 🚀 Deploy to Production

### Build
```bash
npm run build
```

### Test Production Build
```bash
npm run start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 📚 Full Documentation

See `README.md` for complete documentation and `PROJECT_SUMMARY.md` for design details.

---

## ✅ All Set!

Your Recurro website is ready to go. The design follows a "Rhythmic Minimalism" aesthetic with warm colors, circular motifs, and smooth animations.

Enjoy! 🎉
