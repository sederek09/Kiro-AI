# Canva API Integration

## Overview
Project ini terintegrasi dengan Canva API untuk membuat dan mengelola desain secara programatik.

## Setup
- Token Canva tersimpan di file `.env` (JANGAN commit ke GitHub)
- Helper script tersedia di `canva.js`

## Cara Menggunakan Canva

### Untuk Membuat Desain Baru
Gunakan script `canva.js` dengan cara:

```javascript
const canva = require('./canva.js');

// Buat desain baru
const result = await canva.createDesign('Judul Desain', 1920, 1080);
console.log(result.design.urls.edit_url); // Link untuk edit di Canva
```

### Atau via Terminal
```bash
node canva.js create "Judul Desain" 1920 1080
```

### Fungsi yang Tersedia
1. `createDesign(title, width, height)` - Membuat desain baru
2. `getDesign(designId)` - Mendapatkan detail desain
3. `listDesigns()` - List semua desain di folder root
4. `getProfile()` - Mendapatkan profil user Canva

## Instruksi untuk Kiro
Ketika user meminta untuk:
- "Buat desain Canva" → Gunakan `canva.js` dengan `createDesign()`
- "Buat poster/banner/dll di Canva" → Gunakan `createDesign()` dengan ukuran yang sesuai
- "List desain Canva" → Gunakan `listDesigns()`

### Ukuran Umum
- Presentasi: 1920 x 1080
- Instagram Post: 1080 x 1080
- Instagram Story: 1080 x 1920
- Facebook Post: 1200 x 630
- YouTube Thumbnail: 1280 x 720
- A4 Document: 2480 x 3508
- Poster: 1587 x 2245

## Contoh Penggunaan di Kiro

```javascript
// Di setiap session, Kiro bisa langsung menjalankan:
const canva = require('./canva.js');
const design = await canva.createDesign('Nama Desain', 1920, 1080);
// Kemudian berikan link edit_url ke user
```

## Catatan Penting
- Token memiliki expiry time, jika error "token expired" user perlu generate token baru dari Canva Developer Portal
- File `.env` tidak akan ter-commit ke GitHub (sudah ada di .gitignore)
