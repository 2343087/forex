<p align="center">
  <img src="https://img.shields.io/badge/Akademi-Edukasi_Forex-d7962d?style=for-the-badge&labelColor=0a0a0a&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNkNzk2MmQiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTEyIDJMOSA5bC03IDJIOSA4aDZsLTMtNyA3LTIgNyAyeiIvPjwvc3ZnPg==" alt="Akademi Edukasi Forex"/>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Express-5-black?style=for-the-badge&logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Midtrans-Payment-00AEEF?style=for-the-badge" alt="Midtrans"/>
</p>

<h1 align="center">⚡ Apex Elite — Akademi Edukasi Forex Realistis</h1>

<p align="center">
  <strong>Platform edukasi trading yang jujur, anti-BS, dan fokus bikin trader mandiri.</strong><br/>
  Bukan tempat jualan mimpi. Bukan sinyal buta. Ini tempat belajar beneran.
</p>

---

## 🤔 Ini Projek Apa Sih?

**Akademi Edukasi Forex** adalah web app (website yang bisa diakses dari HP maupun laptop) buat **belajar trading Forex secara realistis**. Ini bukan platform sinyal abal-abal yang janjiin "100 ribu jadi 100 juta". Ini tempat edukasi beneran.

### Yang Bisa Dilakukan Platform Ini:

| Fitur | Penjelasan Simpel |
|---|---|
| 🎓 **Akademi Edukasi** | Video belajar 4 pilar: Fundamental, Teknikal (SMC), Psikologi, Risk Management |
| 📊 **Analisa Market Harian** | Tim analis posting bias harian buat member VIP |
| 💳 **Pembayaran Otomatis** | Member bisa upgrade VIP via QRIS/Transfer (Midtrans). Sistem auto-aktifkan akses tanpa konfirmasi manual |
| 🧠 **Trading Checklist** | Checklist mental sebelum trading: cek emosi, cek kalender ekonomi, cek risiko |
| 🔔 **Notifikasi Real-time** | Lonceng notifikasi di dashboard buat info modul baru, VIP hampir habis, dll |
| 🤝 **Program Afiliasi** | Setiap member dapet link referral unik. Ajak temen → dapet komisi 30% |
| 👤 **Profil & Settings** | Ganti password, isi nomor WA, liat sisa VIP, liat riwayat transaksi |
| 📱 **PWA (Install di HP)** | Web-nya bisa di-"install" kayak aplikasi di HP — tanpa perlu download dari Play Store |
| 🔐 **Panel Admin CMS** | Admin bisa CRUD modul, posting analisa, liat analytics (revenue, user growth, dll) |
| 🛡️ **Keamanan Level Fortress** | Rate limiting, CORS whitelist, Zod validation, SHA-512 webhook, anti brute-force |

---

## 🏗️ Arsitektur Projek (Buat Yang Penasaran)

```
XAUUSDMentorship/
├── backend/          ← Server API (Express.js + Prisma + PostgreSQL)
│   ├── src/
│   │   ├── controllers/   ← Logic bisnisnya di sini
│   │   ├── middleware/    ← Auth, role checker
│   │   ├── routes/        ← Endpoint API
│   │   └── config/        ← Database, Midtrans config
│   └── prisma/
│       └── schema.prisma  ← Struktur database
│
├── frontend/         ← Website (Next.js 15 + Tailwind CSS)
│   ├── src/
│   │   ├── app/           ← Halaman-halaman website
│   │   ├── components/    ← Komponen UI yang bisa dipake ulang
│   │   ├── store/         ← State management (Zustand)
│   │   └── lib/           ← Helper functions
│   └── public/            ← Gambar, ikon, manifest PWA
│
└── README.md         ← Lo lagi baca ini 😎
```

---

## 🧰 Apa Aja Yang Harus Disiapkan Sebelum Jalanin?

Sebelum bisa jalanin projek ini di laptop/komputer lu, lu harus install beberapa software dulu. **Tenang, semuanya GRATIS.**

### 1. ✅ Node.js (Wajib)
**Apa ini?** Ini "mesin" yang bikin JavaScript bisa jalan di komputer lu (bukan cuma di browser).

📥 Download di: [https://nodejs.org](https://nodejs.org)
- Pilih yang **LTS** (Long Term Support) — itu yang paling stabil.
- Tinggal klik Next-Next-Install kayak install software biasa.
- **Cek berhasil belum:** Buka terminal/command prompt, ketik:
  ```
  node --version
  npm --version
  ```
  Kalau muncul angka versi (misalnya `v20.x.x`), berarti udah bener ✅

### 2. ✅ PostgreSQL (Wajib)
**Apa ini?** Ini "gudang data"-nya. Semua data user, modul, transaksi disimpan di sini.

📥 Download di: [https://www.postgresql.org/download](https://www.postgresql.org/download)
- Waktu install, **INGET password yang lu masukin**. Itu penting banget nanti.
- Default port-nya biasanya `5432`, biarkan aja.
- **Setelah install**, buka pgAdmin (ikut ke-install otomatis), dan bikin database baru namanya: `xauusd_mentorship`

> **Gak mau ribet install?** Bisa pake [Neon](https://neon.tech) atau [Supabase](https://supabase.com) — database PostgreSQL gratis di cloud. Tinggal copy URL-nya nanti.

### 3. ✅ Git (Opsional, tapi Recommended)
**Apa ini?** Ini buat "download" (clone) kodingan dari repository.

📥 Download di: [https://git-scm.com](https://git-scm.com)

### 4. ✅ Code Editor (Opsional)
**Apa ini?** Buat ngeliat dan ngedit kodingannya kalau mau.

📥 Rekomendasi: [Visual Studio Code](https://code.visualstudio.com) — gratis dan paling populer.

---

## 🚀 Cara Jalanin Projek Ini (Step-by-Step)

Oke, ini bagian yang paling penting. Ikutin langkah-langkahnya satu per satu, jangan di-skip ya!

### Step 1: Download / Clone Proyeknya

**Kalau pake Git:**
```bash
git clone https://github.com/username-lu/XAUUSDMentorship.git
cd XAUUSDMentorship
```

**Kalau gak pake Git:**
- Download ZIP dari GitHub → Extract ke folder mana aja → Buka folder itu di terminal.

---

### Step 2: Setup Backend (Server API)

Buka **terminal/command prompt**, lalu:

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install semua package yang dibutuhin
npm install

# 3. Bikin file konfigurasi rahasia
#    Copy file contoh, terus edit isinya
```

Sekarang bikin file bernama `.env` di dalam folder `backend/` dengan isi kayak gini:

```env
# Database — ganti sesuai PostgreSQL lu
DATABASE_URL="postgresql://postgres:PASSWORD_LU@localhost:5432/xauusd_mentorship"

# JWT Secret — ini kunci rahasia buat login system
# Bisa isi random aja yang penting panjang dan susah ditebak
JWT_SECRET="ganti-ini-pake-string-random-panjang-banget-minimal-32-karakter"

# Midtrans Payment Gateway
# Dapetin key-nya di https://dashboard.midtrans.com
MIDTRANS_SERVER_KEY="Mid-server-XXXXXXXXXXXXXXX"
MIDTRANS_CLIENT_KEY="Mid-client-XXXXXXXXXXXXXXX"
MIDTRANS_IS_PRODUCTION=false

# Frontend URL (buat CORS security)
FRONTEND_URL="http://localhost:3000"
```

> ⚠️ **PENTING:** Ganti `PASSWORD_LU` sama password PostgreSQL yang lu set waktu install tadi!

Lanjut di terminal:

```bash
# 4. Setup database (bikin tabel-tabelnya otomatis)
npx prisma migrate dev --name init

# 5. (Opsional) Isi database dengan data contoh
npx prisma db seed

# 6. JALANIN SERVER BACKEND! 🚀
npm run dev
```

Kalau berhasil, lu bakal liat pesan:
```
[server]: Akademi Edukasi Forex API running at http://localhost:5001
[server]: CORS allowed: http://localhost:3000
[server]: Rate limiting: ACTIVE ✅
```

**Jangan tutup terminal ini!** Biarkan jalan terus.

---

### Step 3: Setup Frontend (Website)

Buka **terminal/command prompt BARU** (jangan tutup yang backend), lalu:

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install semua package
npm install
```

Bikin file `.env.local` di dalam folder `frontend/` dengan isi:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-XXXXXXXXXXXXXXX
```

Lanjut:

```bash
# 3. JALANIN WEBSITE! 🚀
npm run dev
```

Kalau berhasil, lu bakal liat:
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

---

### Step 4: Buka di Browser! 🎉

Sekarang buka browser lu (Chrome, Firefox, Edge, terserah) dan ketik:

| URL | Halaman |
|---|---|
| `http://localhost:3000` | 🔒 Landing Page (halaman marketing) |
| `http://localhost:3000/register` | 📝 Daftar akun baru |
| `http://localhost:3000/login` | 🔑 Login |
| `http://localhost:3000/dashboard` | 📊 Dashboard utama (setelah login) |

**SELAMAT!** 🎊 Platform lu udah jalan di komputer sendiri!

---

## 🔑 Akun Default (Kalau Udah Jalanin Seeder)

Kalau lu udah jalanin `npx prisma db seed`, ini akun yang bisa langsung dipake:

| Role | Email | Password |
|---|---|---|
| 🔴 Super Admin | `admin@apex.com` | `admin123` |
| 🟡 VIP Member | `vip@apex.com` | `vip123` |
| 🟢 Free Member | Daftar sendiri di `/register` | — |

> **Catatan:** Password di atas cuma contoh dari seeder. Di production, WAJIB diganti!

---

## 🛡️ Keamanan Yang Udah Terpasang

Platform ini gak cuma cakep doang. Keamanannya juga **level fortress**:

- 🔐 **Rate Limiting** — Max 300 request / 15 menit. Login cuma 20x / 15 menit. Anti brute-force.
- 🌐 **CORS Whitelist** — Cuma frontend yang terdaftar yang boleh akses API.
- 📏 **Body Size Limit** — Max 1MB per request. Anti payload bombing.
- ✅ **Zod Validation** — Semua input divalidasi ketat: format email, panjang password, tipe data.
- 🔑 **SHA-512 Webhook** — Midtrans webhook di-verifikasi pakai signature cryptographic.
- 🧂 **Bcrypt 12 Rounds** — Password di-hash 12 lapis. Butuh jutaan tahun buat di-crack.
- 🚫 **Anti User Enumeration** — Login error gak kasih tau email atau password yang salah.
- 🛡️ **Helmet** — HTTP security headers otomatis (XSS, clickjacking, MIME sniffing protection).
- 📦 **Gzip Compression** — Response dikompresi otomatis biar cepet.

---

## 📁 Tech Stack Lengkap

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js 15, React 19, Tailwind CSS, Framer Motion, Zustand, SWR |
| **Backend** | Express.js 5, Prisma ORM, Zod v4, JWT, Bcrypt |
| **Database** | PostgreSQL |
| **Payment** | Midtrans Snap (QRIS, Virtual Account, dll) |
| **Security** | Helmet, CORS, Rate Limiter, SHA-512 signature verification |
| **PWA** | Service Worker, Web App Manifest |

---

## 📝 Catatan Penting

1. **Ini bukan financial advice.** Platform ini murni edukasi. Trading Forex/Gold punya risiko tinggi.
2. **Jangan pake di production tanpa ganti semua key & secret.** Yang ada di `.env.example` itu dummy.
3. **Backup database lu.** Kalau udah ada data penting, backup dulu sebelum migrate.

---

<p align="center">
  <strong>Signed, Delong The Akademi Edukasi Forex</strong><br/>
  <em>"We don't just write code. We forge systems."</em>
</p>
