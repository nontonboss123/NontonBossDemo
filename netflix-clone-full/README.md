
# Netflix Clone – Full Features (React + Vite + Firebase + Firestore + TMDB)

### Fitur
- Auth (Email/Password) + Profile gate sederhana
- Home/Browse dengan **Banner + Trailer Modal (YouTube)** dan beberapa **Row**
- **Search** dengan pagination
- **My List** (Firestore) – simpan/hapus judul
- Halaman **Account** menampilkan koleksi My List
- Responsive + Tailwind

### Setup cepat
1) Install deps
```bash
npm install
```
2) Env
```bash
cp .env.example .env
```
3) TMDB API Key → https://www.themoviedb.org/settings/api
4) Firebase Project → aktifkan Email/Password di Authentication, isi `VITE_FIREBASE_*`.
5) Jalankan
```bash
npm run dev
```

### Firestore
Buat dokumen `lists/{uid}` otomatis saat pengguna menambahkan item pertama.
Rules (contoh minimal, sesuaikan kebutuhan):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lists/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

> Catatan: Ini bukan Netflix asli. Tambahan seperti multi-profile, payment/plan, dan playback DRM tidak termasuk.
