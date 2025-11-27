# 🌐 HMPF App

**HMPF App** adalah platform internal untuk mahasiswa Departemen Fisika UGM — khususnya Pascasarjana — yang menyediakan simulasi TOEFL, manajemen anggota, repositori dosen, dan berbagai fitur akademik yang akan terus dikembangkan secara berkala. Aplikasi ini dirancang untuk membantu mahasiswa meningkatkan kemampuan akademis, mengelola informasi internal, serta mendukung kegiatan organisasi HMPF FMIPA UGM.

---

## 🚀 Tech Stack

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **MongoDB + Mongoose**
- **NextAuth (Google OAuth)**
- **React Icons & Lucide React**
- **React Quill Editor**

---

## 🧩 Fitur Utama

### 🔐 Autentikasi & Role Management
- Login menggunakan **Google OAuth**
- Sistem role:
  - **Admin** — akses penuh, manajemen anggota & konten
  - **Editor** — dapat membuat & mengedit konten tertentu
  - **Member** — akses simulasi & halaman umum
- Proteksi halaman secara dinamis berdasarkan role

---

### 🎧 Simulasi TOEFL Lengkap

#### Listening Simulation
- Audio per prompt  
- Sorting berdasarkan `question_number`  
- Autosave jawaban  

#### Structure & Written Expression

#### Reading Section
- Prompt reading lengkap  
- Pertanyaan terhubung melalui `promptId`

#### Full TOEFL Simulation
- Listening + Structure + Reading dalam satu sesi  
- Autosave  
- Rekap skor & riwayat simulasi  

---

### 🧑‍🏫 Repositori Dosen
Fitur pusat informasi akademik yang memuat data dosen Departemen Fisika:

- Database dosen lengkap  
- Pencarian cepat & akurat  
- Autocomplete  
- Informasi terstruktur untuk memudahkan mahasiswa menghubungi dosen pembimbing / pengajar  

---

### 📰 News / Announcement
- Editor artikel berbasis **React Quill**
- Admin/editor dapat membuat & mempublikasikan pengumuman
- Ditampilkan di dashboard mahasiswa

---

### 👥 Manajemen Anggota
- Menampilkan daftar anggota
- Perubahan role (Admin / Editor / Member)
- Proteksi halaman berdasarkan otorisasi

---

### 🔒 Protected Routes
- `/protected` dan `/admin-dashboard` hanya dapat diakses pengguna terotorisasi
- Validasi session dilakukan melalui server components

---


