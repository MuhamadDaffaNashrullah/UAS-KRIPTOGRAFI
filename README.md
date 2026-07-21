# ⚡ CryptoFlow — Unified Symmetric Cryptography Simulator

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React Version](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite Build](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

**CryptoFlow** adalah sebuah aplikasi web simulator interaktif terpadu yang memvisualisasikan langkah-demi-langkah (step-by-step) proses enkripsi dan dekripsi dari empat algoritma kriptografi simetris populer: **DES (64-bit)**, **S-DES (8-bit)**, **AES-128 (128-bit)**, dan **S-AES (16-bit)**. 

Aplikasi ini dirancang menggunakan desain estetika **Neobrutalisme** yang modern, dinamis, dan responsif, ditujukan sebagai alat bantu ajar (media edukasi visual) untuk memahami logika internal block cipher secara bit-per-bit.

---

## 🚀 Fitur Utama Simulator

Aplikasi ini menggabungkan 4 jenis simulator kriptografi dalam satu dashboard terpadu:

1. **DES (Data Encryption Standard - 64-bit)**
   - Visualisasi penuh ekspansi kunci (Key Schedule dari PC-1, Shift, hingga PC-2 untuk 16 round keys).
   - Visualisasi Initial Permutation (IP) dan Inverse/Final Permutation (FP).
   - Penjelasan detail per ronde Feistel (F-Function), termasuk ekspansi E-Bit, XOR dengan round key, substitusi 8 S-Box, dan permutasi P-Box.

2. **S-DES (Simplified DES - 8-bit)**
   - Simulator versi pembelajaran sederhana 8-bit block dengan 10-bit key.
   - Pembangkitan kunci K1 & K2 secara detail (P10, Shift, P8).
   - Visualisasi 2 ronde Feistel utuh lengkap dengan fungsi swap (SW).

3. **AES-128 (Advanced Encryption Standard - 128-bit)**
   - Visualisasi matriks State (State Matrix) berukuran 4x4.
   - Key Expansion penuh untuk membangkitkan 11 round key (W0 hingga W43) lengkap dengan operasi SubWord, RotWord, dan Rcon.
   - Simulasi 10 ronde penuh: SubBytes, ShiftRows, MixColumns (dilewati pada ronde 10), dan AddRoundKey.

4. **S-AES (Simplified AES - 16-bit)**
   - Simulator versi mini AES dengan blok 16-bit dan kunci 16-bit.
   - Ekspansi kunci w0-w5 untuk membangkitkan K0, K1, dan K2.
   - Visualisasi proses 2 ronde (SubNibbles, ShiftRows, MixColumns, AddRoundKey) baik enkripsi maupun dekripsi invers.

---

## 🛠️ Tech Stack & Dependensi

Proyek ini dibangun menggunakan teknologi modern:
- **Core Framework**: React 19 (JavaScript) & Vite (Build Tool & Server Pengembangan)
- **Styling**: Tailwind CSS & Vanilla CSS (Neobrutalism UI custom theme)
- **Animasi & Transisi**: Framer Motion
- **State Management**: Zustand
- **Ikonografi**: Lucide React & Google Material Symbols

---

## 💻 Cara Menjalankan secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan CryptoFlow di komputer Anda:

1. **Klon Repositori atau Download Source Code**
   Pastikan Anda berada di direktori proyek `UAS/`.

2. **Instal Dependensi**
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**
   Mulai server lokal dengan perintah:
   ```bash
   npm run dev
   ```
   Buka peramban (browser) dan akses alamat yang tertera di terminal (biasanya `http://localhost:5173`).

4. **Build untuk Produksi**
   Jika ingin melakukan kompilasi file siap deploy:
   ```bash
   npm run build
   ```
   Hasil build akan tersimpan di dalam folder `dist/`.

---

## ☁️ Panduan Deploy ke Vercel dengan Domain Kustom (`.my.id`)

Proyek ini sepenuhnya dikonfigurasi untuk di-deploy ke **Vercel** (menggantikan konfigurasi platform lama seperti Railway). Berikut adalah panduan langkah demi langkah untuk mengunggah aplikasi dan memasang domain kustom `.my.id` Anda.

### Langkah 1: Hubungkan ke Vercel
1. Masuk ke dashboard [Vercel](https://vercel.com) menggunakan akun GitHub Anda.
2. Klik tombol **"Add New"** -> **"Project"**.
3. Impor repositori GitHub proyek **CryptoFlow** ini.
4. Pada bagian **Build & Development Settings**, Vercel akan otomatis mendeteksi proyek Vite. Pastikan nilainya sesuai:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Klik **"Deploy"** dan tunggu hingga proses build selesai.

### Langkah 2: Tambahkan Domain Kustom `.my.id`
1. Setelah proyek berhasil dideploy, masuk ke tab **"Settings"** -> **"Domains"** di dashboard proyek Vercel Anda.
2. Masukkan alamat domain `.my.id` Anda (contoh: `kriptoflow.my.id` atau `www.kriptoflow.my.id`) lalu klik **"Add"**.
3. Vercel akan memberikan petunjuk DNS Record yang harus Anda pasang di panel penyedia domain/registrar Anda (seperti DomaiNesia, Niagahoster, Rumahweb, dll.).

### Langkah 3: Konfigurasi DNS di Registrar Domain Anda
Masuk ke DNS Manager pada penyedia domain Anda dan tambahkan baris record berikut:

* **Untuk Apex/Root Domain (misal: `kriptoflow.my.id`):**
  - **Tipe Record**: `A`
  - **Host/Name**: `@` (atau kosongkan tergantung registrar)
  - **Value/IP Address**: `76.76.21.21` (IP Anycast Vercel)
  - **TTL**: Default / 3600

* **Untuk Subdomain (misal: `www.kriptoflow.my.id`):**
  - **Tipe Record**: `CNAME`
  - **Host/Name**: `www` (atau nama subdomain lainnya seperti `sim`)
  - **Value/Target**: `cname.vercel-dns.com`
  - **TTL**: Default / 3600

Setelah data disimpan, tunggu proses propagasi DNS (biasanya 5 menit hingga beberapa jam). Vercel akan otomatis memasang sertifikat SSL (HTTPS) gratis untuk domain Anda.

### Catatan Penting SPA Routing (Vercel Config)
Vite + React Router menggunakan rute berbasis klien (*Client-side Routing*). Berkas [vercel.json](file:///e:/Kuliah/Semester%206/Kriptografi/Cyphertext/UAS/vercel.json) di dalam repositori ini telah dikonfigurasi dengan aturan penulisan ulang rute (*rewrites*) agar saat pengguna memuat ulang halaman (*refresh*) di URL kustom seperti `/des` atau `/aes`, server Vercel tidak menghasilkan error `404 Not Found`, melainkan tetap mengarahkannya ke `index.html`.

---

## 🎓 Kredit & Pembuat

Aplikasi simulator ini dikembangkan dan diselesaikan sepenuhnya oleh:

* **Nama**: Muhamad Daffa Nashrullah
* **Tujuan**: Tugas UAS (Ujian Akhir Semester) Kriptografi - Semester 6

> "Dibuat dengan dedikasi tinggi untuk memberikan visualisasi terbaik dari algoritma kriptografi klasik dan modern, menyajikan antarmuka neobrutalisme yang intuitif bagi pembelajar keamanan informasi."
