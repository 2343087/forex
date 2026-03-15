# ⚡ THE APEX SCRIPT: XAUUSD MENTORSHIP PLATFORM
Dokumen ini adalah pedoman mutlak (SSOT - Single Source of Truth) untuk membuat platform edukasi & mentorship XAUUSD skala besar. AI dan Developer wajib mematuhi standar ini. Ga ada kompromi soal kualitas, security, dan performance.

---

## 🚀 1. TECH STACK (ALAT TEMPUR LENGKAP)

Sesuai permintaan lo, stack ini dirancang untuk handle **ratusan ribu hingga jutaan data/user** tanpa lag, pakai bahasa modern yang ngebut dan sat-set.

### 🌐 Frontend (Tampilan Depan)
- **Framework:** Next.js (React.js)
  - **Kenapa:** SSR (Server-Side Rendering) bikin SEO gila-gilaan bagusnya. Routing instan (SPA feel). Kalau pindah dari halaman "Dashboard" ke "Course", ga ada loading putih berkedip. Mulus parah.
- **Styling:** Tailwind CSS (Atau Vanilla CSS pakai modul Next.js jika lo pengen custom parah yang penting *aesthetic* premium, dark-mode, glassmorphism, micro-animations).
- **State Management:** Zustand / React Context (Ringan banget, ga bikin HP kentang nge-lag).

### ⚙️ Backend (Dapur / Logika)
- **Framework:** Node.js dipasangkan dengan Express.js.
  - **Kenapa:** Non-blocking I/O. Kalau pas News NFP rilis dan ada 5000 orang login barengan, server lo ga bakal nge-hang asalkan kodingan asynchnya clean.
- **Database ORM:** Prisma
  - Kenapa: Nyambungin database ke Backend gampang banget, type-safe (kecil kemungkinannya error gara-gara typo nama kolom).

### 🗄️ Database
- **PostgreSQL.** Jangan pake MySQL biasa buat aplikasi duit & transaksi. PostgreSQL lebih ketat, tahan banting buat urusan ACID (kestabilan data).

---

## 💸 2. BIAYA OPERASIONAL REALISTIS (YANG HARUS LO BAYAR SELAIN HOSTINGER)

Bikin web e-learning jutaan user butuh ekosistem. Ini hal yang harus lo perhatiin soal bayar-membayar API pihak ketiga:

**A. WAJIB (Harus ada sejak rilis):**
1. **Video Hosting (Anti Bajakan):** 
   - **Bunny.net:** (Rekomendasi). Sistemnya Pay-as-you-go. Cuma bayar storage (sekitar $0.01/GB) dan bandwidth. Sangat murah. Pakai fitur **Watermark dinamis** & **DRM** biar video lo ga bisa disedot pake IDM.
   - **Vimeo Pro:** Kalau mau lebih gampang setupnya ($20 per bulan), fitur domain-level privacy udah oke. Tapi Bunny.net jauh lebih murah buat skala Indo.
2. **Payment Gateway:** 
   - **Midtrans atau Xendit:** **GRATIS DAFTAR**. Ga ada langganan bulanan. Lo cuma dipotong pas ada yang sukses bayar (Misal: Rp 4.000 per transaksi Virtual Account, 1.5% buat transfer E-wallet/QRIS).

**B. OPSIONAL (Bisa nyusul pas udah rame):**
3. **WhatsApp API Gateway (Penting buat Premium Feel):**
   - Biar user daftar, OTP atau notif pembayaran masuk WA. 
   - **Vendor Indo (Fonnte, Watzap, RuangWA):** Sekitar Rp 100.000 - Rp 200.000 / bulan.
4. **Email Transaksional (Nirim Invoice):**
   - **Resend / SendGrid:** Gratis sampai 3000 email per bulan (Aman, habis itu baru bayar).
5. **DDoS Protection (Tukang Pukul Security):**
   - **Cloudflare:** Pakai versi gratisan di awal udah cukup banget nangkep spam bot. Nanti kalau kompetitor iseng DDoS, baru up ke versi PRO ($20/bulan).

---

## 🏗️ 3. STANDAR FOLDER STRUCTURE

Kita pake pendekatan "Separation of Concerns" (Pemisah urusan). Frontend dan Backend pisah folder, biar kalau webnya jebol, backend lu masih idup (dan sebaliknya).

### `backend/` (Node.js/Express)
- `src/controllers/` -> Otak logika aplikasi (Misal: logic potong komisi affiliasi).
- `src/routes/` -> URL api (Misal: `POST /api/login`, `GET /api/courses`).
- `src/models/` -> Aturan skema / data shaping.
- `src/middleware/` -> Satpam. Ngecek token JWT (login belum?), ngecek Role (Admin bukan?).
- `src/config/` -> Setup eksternal (Koneksi ke Xendit, koneksi ke Database).
- `prisma/` -> File `schema.prisma` penyimpan struktur database dewa.

### `frontend/` (Next.js App Router)
- `src/app/` -> Routing halaman depan (Misal: `app/course/page.tsx`).
- `src/components/` -> Potongan lego (Tombol premium, Navbar, Video Player) dipisah kesini biar rapi.
- `src/lib/` -> Fungsi utility.
- `src/store/` -> State management (Nyimpen status "User ini lagi Dark Mode" atau "Lagi Login").

---

## 💎 4. ATURAN PENULISAN KODE ANTIGRAVITY (GOD-TIER PROTOCOL)

1. **Anti-Halu Database & N+1 Killer:** 
   Jangan ada query bocor. Kalau mau narik data Course beserta modulnya, panggil di awal pake `include`. Jangan ada looping `SELECT` di dalam kode. Indeks (seperti `@index([slug])` di Prisma) hukumnya WAJIB di semua relasi pencarian.
   
2. **Keamanan Ekstra Validasi:** 
   JANGAN percaya input user. Email diketik asal-asalan? Tolak di level API (pakai Zod validator) sebelum nabrak database. Input form apa pun WAJIB lolos XSS & SQL Injection filter (ORM Prisma mostly udah cover ini otomatis, tapi tetap waspada).

3. **Performance (Speed Is A Feature):**
   - Pake Image tag bawaan Next.js (`next/image`) biar gambar thumbnail dan avatar di-resize + convert ke WebP otomatis.
   - Jangan me-render komponen berat pas baru load halaman. Lazy load everything below the fold.

4. **UI/UX RIZZ:**
   - Desain haram buluk. Tampilan wajib kasih vibe "Wallstreet / Forex Elite". Dominan warna elegan (Dark/Navy/Gold/Sleek White).
   - "Loading..." jangan teks doang, kasih skeleton animation atau Spinner elegan.
   - Peringatan error jangan kaku ("Null Pointer Exception"), tapi pakai bahasa manusia ("Waduh, koneksi ke database putus bentar bro, refresh ya").

---
**Tujuan AI / Dev Workflow:** Lo adalah Arsitek. Code gak sekadar jalan, tapi kuat menahan beban finansial dan user traffic tinggi. Pahami The Apex Script ini sebelum nge-build fitur apa pun.