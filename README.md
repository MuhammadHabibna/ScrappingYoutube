# Commentary - YouTube Comment Scraper

**Commentary** website aplikasi berbasis web modern untuk mengambil (scrape) komentar dari video YouTube dan mengekspornya ke dalam format `.csv` untuk keperluan analisis data (seperti sentimen analisis). Aplikasi ini dibangun dengan mengutamakan desain yang bersih, kecepatan, dan kemudahan penggunaan.

![Project Preview](/preview.png)

## 🚀 Fitur Utama

-   **Scraping Cepat**: Menggunakan YouTube Data API v3 untuk mengambil komentar secara legal dan efisien.
-   **Tanpa Database**: Aplikasi berjalan sepenuhnya *stateless*. API Key Anda hanya disimpan di browser (localStorage) Anda sendiri.
-   **Ekspor CSV Langsung**: Mengunduh data komentar (Penulis, Isi Komentar, Likes, Tanggal) dalam format `.csv` yang kompatibel dengan Excel.
-   **UI Modern & Responsif**: Dibangun dengan Tailwind CSS dan Shadcn UI, mendukung Dark Mode.
-   **Konfigurasi Fleksibel**: Atur jumlah komentar yang ingin diambil (hingga 2000 komentar).

## 🛠️ Teknologi yang Digunakan

-   **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
-   **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Komponen UI**: [Shadcn/UI](https://ui.shadcn.com/)
-   **API Client**: Googleapis (YouTube Data API v3)
-   **State Management**: Zustand
-   **Animation**: Framer Motion

## 📋 Prasyarat (System Requirements)

Sebelum menjalankan aplikasi ini di komputer Anda, pastikan Anda memiliki:

1.  **Node.js**: Versi 18.17.0 atau lebih baru. [Download di sini](https://nodejs.org/).
2.  **npm**: Biasanya sudah terinstal otomatis bersama Node.js.
3.  **YouTube Data API Key**: Akun Google Cloud Platform untuk mendapatkan API Key. (Panduan tersedia di dalam aplikasi).

## 📦 Cara Instalasi & Menjalankan

Ikuti langkah-langkah ini untuk menjalankan project di komputer lokal:

### Langkah 1: Siapkan Folder Project
1.  **Ekstrak (Unzip)** file `.zip` source code yang Anda terima.
2.  Masuk ke dalam folder hasil ekstraksi tersebut.

### Langkah 2: Install Dependensi (Wajib)
Jantung aplikasi ini ada di library pendukungnya. Kita perlu menginstalnya terlebih dahulu.
1.  Buka terminal (Command Prompt / PowerShell) di dalam folder project tadi.
    *   *Tips: Di Windows, buka folder project, klik bar alamat di atas, ketik `cmd`, lalu Enter.*
2.  Ketik perintah berikut dan tekan Enter:
```bash
npm install
```
*(Tunggu hingga proses selesai dan muncul folder baru `node_modules`)*

### Langkah 3: Jalankan Aplikasi
Sekarang kita nyalakan server lokalnya:
```bash
npm run dev
```
Jika berhasil, akan muncul tulisan `Ready in [...] localhost:3000`.

### Langkah 4: Buka di Browser
Buka browser (Chrome/Edge/Firefox) dan kunjungi alamat:
**`http://localhost:3000`**

### 4. Build untuk Production (Opsional)
Jika ingin melihat versi performa maksimal (seperti website asli):
```bash
npm run build
npm run start
```
*(Atau gunakan perintah `npm run preview`)*

## 🔑 Cara Menggunakan

1.  Buka aplikasi di browser.
2.  Klik ikon **Settings (Gerigi)** di pojok kanan atas.
3.  Masukkan **YouTube Data API Key** Anda.
    *   *Belum punya key? Klik menu "Panduan Mencari API Key" di dalam popup Settings.*
4.  Masukkan **Link Video YouTube** yang ingin di-scrape di halaman utama.
5.  Atur jumlah komentar menggunakan slider (Max 2000).
6.  Klik tombol **"Start Scraping"**.
7.  Tunggu proses selesai, lalu klik **"Download .CSV"** untuk menyimpan data.

## 📝 Lisensi

Project ini dibuat untuk tujuan edukasi dan open source. Silakan digunakan dan dimodifikasi!
