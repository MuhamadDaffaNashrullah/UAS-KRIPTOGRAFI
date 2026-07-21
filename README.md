# ⚡ CIPHERCRAFT — Unified Symmetric Cryptography Simulator

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React Version](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Vite Build](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![State Management](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)

**CIPHERCRAFT** adalah sebuah aplikasi web simulator interaktif terpadu yang memvisualisasikan langkah-demi-langkah (step-by-step) proses enkripsi dan dekripsi dari empat algoritma kriptografi simetris populer: **DES (64-bit)**, **S-DES (8-bit)**, **AES-128 (128-bit)**, dan **S-AES (16-bit)**. 

Aplikasi ini menggunakan filosofi desain **Neobrutalisme** yang memiliki kontras tinggi, warna tajam, garis tepi tebal, dan bayangan solid. Dirancang sebagai proyek tugas **UAS Kriptografi Semester 6**, platform ini memudahkan mahasiswa maupun praktisi memahami cara kerja internal block cipher secara bit-per-bit dan nibble-per-nibble.

---

## 🎨 Tampilan & Desain
- **Neobrutalism UI**: Desain retro-modern berkarakter kuat dengan bayangan padat (`box-shadow: 4px 4px 0px #00a3ff`), borders tebal (`border-4 border-white`), tipografi menggunakan font *Space Grotesk* dan *Space Mono*, serta palet warna Persona 3 Reload (Deep Navy, Electric Blue, Cyan, Teal).
- **Animasi Transisi Halus**: Didukung oleh **Framer Motion** untuk transisi perpindahan halaman dan animasi ekspansi langkah enkripsi/dekripsi secara interaktif.
- **Responsive Layout**: Optimal untuk perangkat mobile, tablet, maupun desktop berkat sistem grid **Tailwind CSS**.

---

## 🚀 Fitur Utama & Modul Simulator

### 1. Data Encryption Standard (DES — 64-bit)
- **Key Schedule Generator**: Memvisualisasikan konversi kunci 64-bit menjadi 16 round keys (kunci ronde) berukuran 48-bit melalui tahapan Permuted Choice 1 (PC-1), Circular Left Shifts (1 atau 2 per ronde), dan Permuted Choice 2 (PC-2).
- **Initial & Final Permutation**: Memetakan posisi bit masukan (Plaintext) 64-bit menggunakan tabel IP, dan memetakan kembali hasil enkripsi ronde ke-16 menggunakan tabel Inverse Initial Permutation (IP⁻¹ / FP).
- **16 Ronde Feistel**: Menunjukkan proses pemisahan blok menjadi bagian Kiri ($L_i$) dan Kanan ($R_i$), fungsi ekspansi (E-bit Selection Table) dari 32-bit ke 48-bit, operasi XOR dengan kunci ronde, substitusi menggunakan 8 tabel S-Box, permutasi P-Box, hingga pertukaran nilai.

### 2. Simplified DES (S-DES — 8-bit)
- **Skala Pembelajaran Mini**: Sangat ideal untuk simulasi manual di kertas karena hanya mengolah blok data 8-bit dan kunci 10-bit.
- **Pembangkitan Kunci (K1 & K2)**: Menunjukkan langkah permutasi P10, Left Shift (LS-1 & LS-2), dan permutasi P8 untuk menghasilkan dua sub-kunci 8-bit.
- **Fungsi Ronde (fk)**: Memvisualisasikan ekspansi P4, XOR dengan kunci, substitusi menggunakan dua tabel S-Box (S0 & S1), permutasi P4, XOR dengan bagian kiri, dan fungsi pertukaran (SW - Swap).

### 3. Advanced Encryption Standard (AES-128 — 128-bit)
- **Representasi State Matrix**: Menampilkan representasi plaintext dalam bentuk matriks 2D berukuran 4x4 byte.
- **Key Expansion (11 Kunci Ronde)**: Memperlihatkan pembentukan kunci ekspansi dari kunci utama 128-bit menjadi total 44 word (W0-W43) menggunakan fungsi SubWord (S-Box AES), RotWord, dan XOR dengan Rcon (Round Constant).
- **Prosedur 10 Ronde**:
  - **Initial Round**: AddRoundKey pertama.
  - **Rounds 1–9**: SubBytes (substitusi byte via S-Box), ShiftRows (pergeseran baris matriks), MixColumns (perkalian matriks di Galois Field $GF(2^8)$), dan AddRoundKey.
  - **Final Round (Ronde 10)**: Sama seperti ronde 1-9 namun tanpa proses MixColumns.

### 4. Simplified AES (S-AES — 16-bit)
- **Skala Pembelajaran AES**: Mengolah blok data 16-bit (4 nibbles) dengan kunci 16-bit.
- **Key Expansion**: Memperlihatkan pembangkitan subkey $K_0, K_1, K_2$ dari word $W_0-W_5$ menggunakan fungsi SubNibbles dan Rcon.
- **Enkripsi & Dekripsi Invers**: Menunjukkan visualisasi penuh operasi SubNibbles, ShiftRows, MixColumns (menggunakan Galois Field $GF(2^4)$), AddRoundKey, beserta operasi inversnya untuk dekripsi secara simetris.

---

## 📂 Struktur Folder Proyek

```text
UAS/
├── .vscode/                 # Konfigurasi editor VS Code
├── public/                  # Aset statis & Favicon
├── src/
│   ├── assets/              # Aset visual & logo
│   ├── components/
│   │   └── shared/
│   │       ├── Navbar.jsx   # Menu navigasi dropdown neobrutalisme
│   │       └── Footer.jsx   # Komponen kredit & footer sistem [NEW]
│   ├── pages/
│   │   └── Landing.jsx      # Halaman utama aplikasi (dashboard CIPHERCRAFT)
│   ├── modules/             # Modul-modul algoritma kriptografi
│   │   ├── des/             # Modul DES
│   │   │   ├── components/  # Komponen GUI simulasi DES
│   │   │   ├── services/    # Logika enkripsi, Sbox, permutasi, keySchedule
│   │   │   └── DESPage.jsx  # Halaman Utama Simulator DES
│   │   ├── sdes/            # Modul S-DES
│   │   │   ├── services/    # Logika sdes.js
│   │   │   └── SDESPage.jsx # Halaman & GUI Simulator S-DES
│   │   ├── aes/             # Modul AES-128
│   │   │   ├── services/    # Logika aes.js, sbox.js, rcon.js, galois.js
│   │   │   └── AESPage.jsx  # Halaman Utama Simulator AES
│   │   └── saes/            # Modul S-AES
│   │       ├── logic/       # Logika state, subNibble, shiftRows, mixColumns, dll.
│   │       └── SAESPage.jsx # Halaman Utama Simulator S-AES
│   ├── App.jsx              # Routing & konfigurasi transisi halaman
│   ├── index.css            # Desain neobrutalisme global & variabel tema
│   └── main.jsx             # Entry point React
├── index.html               # File template HTML & metadata SEO
├── package.json             # File manifes dependensi & script proyek
├── tailwind.config.js       # Konfigurasi utility Tailwind CSS
├── vite.config.js           # Konfigurasi builder Vite
└── vercel.json              # Aturan deploy SPA routing Vercel
```

---

## 🛠️ Pemasangan & Menjalankan secara Lokal

Pastikan Anda telah menginstal **Node.js** di komputer Anda. Ikuti langkah di bawah ini:

1. **Instal Dependensi**
   Unduh paket yang dibutuhkan sesuai `package.json` dengan menjalankan:
   ```bash
   npm install
   ```

2. **Jalankan Aplikasi Mode Development**
   Untuk memulai server lokal dengan fitur hot-reload:
   ```bash
   npm run dev
   ```
   Akses aplikasi melalui peramban di alamat `http://localhost:5173`.

3. **Build untuk Produksi**
   Untuk mengompilasi dan mengoptimalkan kode untuk rilis web:
   ```bash
   npm run build
   ```
   Folder `dist/` akan terbentuk dengan aset yang telah diminimalkan secara otomatis.

---

## ☁️ Panduan Deploy ke Vercel dengan Domain Kustom (`.my.id`)

Aplikasi ini dikonfigurasi untuk berjalan 100% di cloud hosting **Vercel** tanpa ketergantungan pada platform Railway. Konfigurasi perutean klien React Router dijamin berjalan lancar berkat pengaturan `vercel.json` yang tertanam di root folder.

### Langkah 1: Hubungkan Repositori ke Vercel
1. Masuk ke dashboard [Vercel](https://vercel.com) menggunakan Github/Gitlab Anda.
2. Buat proyek baru dengan memilih tombol **"Add New"** -> **"Project"**.
3. Cari dan impor repositori proyek **CIPHERCRAFT** ini.
4. Di bagian pengaturan konfigurasi build, setel nilai berikut:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Klik **"Deploy"** dan tunggu hingga deployment selesai.

### Langkah 2: Tambahkan Domain Kustom `.my.id`
1. Buka proyek Anda di dashboard Vercel, masuk ke **Settings** -> **Domains**.
2. Masukkan alamat domain kustom Anda (misalnya `ciphercraft.my.id` atau `daffa.my.id`) dan klik **Add**.
3. Vercel akan menampilkan status domain "Invalid Configuration" karena Anda harus mengarahkan DNS record domain Anda ke Vercel terlebih dahulu.

### Langkah 3: Konfigurasi DNS di Registrar Domain Anda
Masuk ke client area / DNS Manager dari penyedia domain `.my.id` Anda (misal: DomaiNesia, Niagahoster, Rumahweb, dll.), lalu masukkan record baru berikut:

| Nama/Host | Tipe | Value / Target | Keterangan |
| :--- | :---: | :--- | :--- |
| `@` | **A** | `76.76.21.21` | Mengarahkan root domain ke IP Anycast Vercel |
| `www` | **CNAME** | `cname.vercel-dns.com` | Mengarahkan subdomain www ke DNS Vercel |

*Catatan: Jika Anda menggunakan subdomain lain (contoh: `crypto.daffa.my.id`), cukup buat **CNAME** record dengan Host `crypto` dan Value `cname.vercel-dns.com`.*

Simpan perubahan dan tunggu proses propagasi DNS (biasanya berkisar antara 5 menit hingga 1 jam). Setelah terhubung, Vercel akan otomatis menerbitkan sertifikat SSL gratis untuk mengaktifkan protokol aman HTTPS.

---

## 👨‍💻 Kredit & Hak Cipta

Seluruh arsitektur kode, visualisasi simulator, dan antarmuka Neobrutalisme pada aplikasi ini dikembangkan dan diselesaikan sepenuhnya oleh:

### **Muhamad Daffa Nashrullah**
* **Peran**: Full-stack Developer & Designer
* **Tujuan**: Tugas UAS (Ujian Akhir Semester) Kriptografi - Semester 6
* **Institusi**: Fakultas Ilmu Komputer / Program Studi Teknik Informatika

```text
============================================================
           DIKEMBANGKAN DENGAN SEMANGAT NEOBRUTALISME
       UNTUK PEMBELAJARAN KEAMANAN INFORMASI INTERAKTIF
============================================================
```

> **Catatan Akademis**: Dibuat sebagai demonstrasi praktis penerapan cipher simetris klasik dan modern dengan struktur internal visual yang transparan. Sangat cocok digunakan untuk bahan ajar, presentasi kelas, atau pengujian manual.
