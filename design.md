# Clasnet Design System

> Sistem desain untuk website baru **Clasnet Group** (clasnet.co.id), dibangun di atas
> **Carbon Design System** — design system enterprise open-source milik IBM.
> Dokumen ini adalah *single source of truth* untuk warna, tipografi, layout, komponen,
> dan pemetaan konten lama ke struktur baru.

---

## Overview

Sistem marketing Clasnet adalah penerapan setia dari **Carbon Design System**. Permukaan
dominan adalah `{colors.canvas}` putih murni dengan `{colors.surface-1}` abu muda untuk
elevasi, charcoal `{colors.ink}` (#161616) untuk teks, dan Clasnet Blue `{colors.primary}`
(#0f62fe) sebagai satu-satunya aksen brand.

Pilihan yang mendefinisikan adalah **geometri datar (flat geometry)**: setiap CTA, card,
input, dan container menggunakan sudut square (`{rounded.none}` 0px) dengan border tipis
1px. Tidak ada pill membulat, tidak ada soft shadow, tidak ada gradient atmosferik.
Sistem ini *engineered*, bukan *stylized*.

**IBM Plex Sans** membawa seluruh hierarki tipografi. Ukuran display (76 / 60 / 42px)
berjalan pada weight **300** — treatment display ringan khas Carbon yang membuat 76px
terasa lebih tenang dibanding brand lain yang memakai weight 700. Body type berada pada
weight 400 dengan `letter-spacing: 0.16px` (detail presisi Carbon) dan line-height 1.50.
Suaranya terbaca cermat, teknis, dan dapat dipercaya — tepat untuk sebuah software house
& developer IT.

Sistem ini jarang memakai warna — Clasnet Blue menandai link, primary CTA, dan CTA banner
full-bleed yang langka. Charcoal membawa setiap permukaan lain yang bukan putih.
Hasilnya: gravitas enterprise tanpa kekakuan enterprise — rigor, ringan, dan sengaja ditahan.

**Karakteristik Kunci:**
- **Carbon Design System** — chrome marketing Clasnet ADALAH Carbon. Button square, input square-with-bottom-rule, corner tetap 0px.
- **Display type ringan**: Plex Sans weight 300 untuk headline 42–76px adalah tanda tangan tipografis brand.
- **Satu warna aksen**: `{colors.primary}` Clasnet Blue membawa setiap link, primary CTA, dan CTA banner. Tidak ada warna brand kedua.
- Putih canvas + abu muda (`{colors.surface-1}`) + charcoal (`{colors.ink}`) menutup 95% permukaan.
- Footer membalik ke charcoal (`{colors.inverse-canvas}` #161616) — satu-satunya permukaan gelap di atas page break.
- Hierarki card dibawa oleh hairline 1px dan perubahan surface, bukan oleh drop shadow.
- `letter-spacing: 0.16px` pada body adalah detail presisi Carbon — tracking positif kecil adalah bagian dari suara brand.
- Ritme halaman: utility bar → top nav → hero dengan headline ringan → fact band → feature card grid → enterprise feature row (Tentang) → program tab strip → edukasi → testimonial → tim → customer logo marquee → penawaran/kontak → CTA banner biru → newsletter/client-area → dark footer.

---

## Colors

> Sumber: token Carbon (Gray, Blue, Green, Yellow, Red) + brand lama Clasnet.
> Semua nilai di bawah adalah hex final yang dipakai di `css/style.css`.

### Brand & Accent
| Token | Hex | Use |
|---|---|---|
| `{colors.primary}` (Clasnet Blue) | `#0f62fe` | Link, primary CTA, CTA banner, focus ring, selected-tab underline |
| `{colors.blue-hover}` | `#0353e9` | Hover primary button |
| `{colors.blue-60}` (link hover) | `#0043ce` | Hovered link state |
| `{colors.blue-80}` (pressed) | `#002d9c` | Pressed / active primary button |
| `{colors.on-primary}` | `#ffffff` | Teks di atas primary / CTA banner |

### Logo & Brand Mark
Aset: `assets/logo.png` — **globe mark Clasnet** (PNG transparan). Sumber master:
`I:\portfolio\public\Clasnet-Globe---Clear-Logo---Variasi.png`.

Versi web di-derive dari master: di-crop ke bounding box piksel opaque lalu diberi padding
2,5%, kemudian di-resize ke maksimum 512px → **512 × 444** (mark mengisi ±95% frame).
Master aslinya 1867 × 1691 dengan 86% area transparan, sehingga tanpa crop globe akan
tampak jauh lebih kecil dari kotak penampungnya. Wordmark lama (200 × 52) disimpan sebagai
`assets/logo-wordmark.png` untuk cadangan.

**Warna mark:** merah (`rgb(224,32,32)` dominan) + biru (`rgb(32,64,128)`) — warna brand lama
Clasnet. Ini **satu-satunya pengecualian** terhadap aturan "satu warna aksen": mark boleh
membawa warna brand, tetapi seluruh chrome UI (link, CTA, focus ring, underline) tetap hanya
memakai Clasnet Blue `{colors.primary}`. Merah logo tidak boleh dipakai ulang sebagai warna UI.

**Penempatan & ukuran** (semua `object-fit: contain`, corner 0px, tanpa shadow):
| Lokasi | Selector | Ukuran |
|---|---|---|
| Header nav | `.brand img` | `height: 36px; width: auto` |
| Footer (charcoal) | `.footer-brand .logo-wrap img` | `height: 44px; width: auto` + kotak `background: var(--canvas)` padding 3px |
| Admin — layar login | `.login-logo` | 48 × 48 |
| Admin — side-nav | `.side-brand img` | 28 × 28 |
| Favicon | `<link rel="icon" href="assets/logo.png">` | semua halaman HTML |

Logo selalu dipasangkan dengan wordmark teks (`.brand-text`: `CLAS` + `NET` aksen biru, sub
`SOFTWARE HOUSE & DEVELOPER IT`) membentuk lockup mark + wordmark. Di atas footer charcoal,
mark ditempatkan pada kotak putih agar merah-biru tetap kontras — bukan di-invert.

### Surface
| Token | Hex | Use |
|---|---|---|
| `{colors.canvas}` | `#ffffff` | Default page background |
| `{colors.surface-1}` | `#f4f4f4` | Input fields, alternate-row stripes, subtle section bands |
| `{colors.surface-2}` | `#e0e0e0` | Disabled fields, hairline-as-fill separators |
| `{colors.hairline}` | `#e0e0e0` | 1px border pada card, input, divider |
| `{colors.hairline-strong}` | `#161616` | 1px charcoal underline pada focused input |
| `{colors.inverse-canvas}` | `#161616` | Charcoal — footer surface |
| `{colors.inverse-surface-1}` | `#262626` | Satu step lebih terang dari inverse canvas — footer divider, hovered footer item |

### Text
| Token | Hex | Use |
|---|---|---|
| `{colors.ink}` | `#161616` | Semua headline & body type yang ditekankan |
| `{colors.ink-muted}` | `#525252` | Secondary type — meta, sub-headline, footer body |
| `{colors.ink-subtle}` | `#8c8c8c` | Tertiary type — disabled, helper text, caption |
| `{colors.inverse-ink}` | `#ffffff` | Putih di atas charcoal — footer heading |
| `{colors.inverse-ink-muted}` | `#c6c6c6` | Abu terang di atas charcoal — footer body |

### Semantic
| Token | Hex | Use |
|---|---|---|
| `{colors.semantic-success}` | `#24a148` | Success states (Carbon green-50) |
| `{colors.semantic-warning}` | `#f1c21b` | Warning states (Carbon yellow-30) |
| `{colors.semantic-error}` | `#da1e28` | Error states; danger button bg (Carbon red-60) |
| `{colors.semantic-info}` | `#0f62fe` | Identik dengan primary — informational badge |

---

## Typography

### Font Family
- **IBM Plex Sans** — typeface open-source (SIL OFL), tersedia di Google Fonts. Geometris,
  sedikit humanis, dirancang khusus untuk enterprise UI. Fallback: `Helvetica Neue, Arial, sans-serif`.
- Satu family membawa display, body, dan caption — tidak ada pairing display + body.
  Hierarki dibawa oleh **size + weight**, bukan pergantian family.
- **Tidak ada mono** di permukaan marketing (Plex Mono hanya untuk permukaan produk).

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 76px | 300 | 1.17 | -0.5px | Headline hero terbesar |
| `{typography.display-lg}` | 60px | 300 | 1.17 | -0.4px | Headline pembuka section |
| `{typography.display-md}` | 42px | 300 | 1.20 | 0 | Sub-section headline, judul hero card |
| `{typography.headline}` | 32px | 400 | 1.25 | 0 | Card collection heading, judul CTA banner |
| `{typography.card-title}` | 24px | 400 | 1.33 | 0 | Judul feature card |
| `{typography.subhead}` | 20px | 400 | 1.40 | 0 | Lead body di samping display headline |
| `{typography.body-lg}` | 18px | 400 | 1.50 | 0 | Subhead hero, lead paragraph |
| `{typography.body}` | 16px | 400 | 1.50 | 0.16px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.29 | 0.16px | Card body, footer column |
| `{typography.body-emphasis}` | 14px | 600 | 1.29 | 0.16px | Selected tab label, emphasized body line |
| `{typography.caption}` | 12px | 400 | 1.33 | 0.32px | Caption, meta, utility bar |
| `{typography.button}` | 14px | 400 | 1.29 | 0.16px | Semua button label |
| `{typography.eyebrow}` | 14px | 400 | 1.29 | 0.16px | Section eyebrow (sentence case, bukan all-caps) |

### Principles
- **Display ringan adalah suara brand.** Plex Sans weight 300 untuk headline 76px terbaca
  tenang dan otoritatif — menggantinya ke 700 akan membuatnya seperti situs enterprise generik.
- **`letter-spacing: 0.16px` Carbon** pada ukuran body adalah detail presisi. Jangan dihapus.
- **Eyebrow memakai sentence case 14px** — Carbon menolak eyebrow all-caps ber-tracking.
- **Line-height mengetat di display, rileks di body**: 1.17 di display-xl, 1.50 di body.

---

## Layout

### Spacing System
- **Base unit**: 4px (grid 4-pixel khas Carbon).
- **Token**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Padding interior card: `{spacing.lg}` 24px (feature card); `{spacing.xl}` 32px (product card); `{spacing.xxl}` 48px (hero card & CTA banner).
- Padding button: 12px vertikal · 16px horizontal (spec Carbon).
- Padding form input: 11px vertikal · 16px horizontal.

### Grid & Container
- Grid 16-kolom Carbon di desktop, turun ke 8 / 4 kolom di tablet / mobile.
- Max content width ~1584px (breakpoint max-grid Carbon). Wrapper konten Clasnet: **1312px**.
- Card grid 4-up di desktop, 2-up di tablet, 1-up di mobile.
- Customer logo marquee memakai tile fixed-width dalam flex row, scroll horizontal di viewport kecil.

### Whitespace Philosophy
Carbon memakai presisi ke grid 4-pixel sebagai sistem whitespace-nya. Section dipisahkan
via baris abu tipis (`{colors.surface-1}`) bukan lewat gap vertikal besar. Konten padat
by design — pelanggan Clasnet (pemdes, UMKM, sekolah, instansi) ingin melihat banyak hal
dalam satu halaman, bukan banyak ruang kosong.

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | Tanpa shadow, tanpa border | Default body type, hero text, footer body |
| 1 (hairline) | 1px `{colors.hairline}` border di atas canvas | Feature card, input, list item |
| 2 (surface lift) | `{colors.surface-1}` background di atas canvas | Alternate-row banner, hovered card |
| 3 (focus ring) | 2px `{colors.primary}` outline + 1px `{colors.hairline-strong}` underline | Focused input, focused button |

Carbon menolak drop shadow di marketing — kedalaman dibawa oleh perubahan surface dan
hairline 1px. Pengecualian: permukaan produk/app (di luar cakupan situs marketing ini).

### Decorative Depth
- **Soft blue gradient backdrop** muncul di belakang ilustrasi hero — wash biru-ke-putih
  samar yang menghangatkan canvas tanpa bersaing dengan headline.
- **Tidak ada kedalaman atmosferik.** Tidak ada spotlight card, pastel block, atau gradient panel.

---

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Default — setiap button, card, input, container |
| `{rounded.xs}` | 2px | Small badge (pengecualian langka) |
| `{rounded.sm}` | 4px | Avatar squared, dropdown menu |
| `{rounded.md}` | 6px | (jarang; didokumentasikan untuk kelengkapan) |
| `{rounded.lg}` | 8px | (jarang; didokumentasikan untuk kelengkapan) |
| `{rounded.pill}` | 9999px | Status pill/badge di product UI (langka di marketing) |

Brand berkomitmen pada sudut datar 0px. Token lain ada untuk permukaan produk/mobile.

### Photography & Illustration Geometry
- Clasnet memakai ilustrasi abstrak geometris (mesh, dotted pattern) bergaya Carbon +
  placeholder datar untuk fotografi (hero, program, tim, vendor).
- **Keputusan final: hero Home memakai ilustrasi SVG geometris, BUKAN fotografi.** Hero foto
  full-bleed (`assets/hero.jpg` + scrim) sudah pernah diimplementasikan lalu **ditolak** —
  hasilnya dinilai lebih buruk daripada versi ilustrasi. Jangan ulangi tanpa diminta.
  File `assets/hero.jpg` tetap disimpan tapi tidak dipakai.
- Frame gambar datar — tanpa rounded corner.
- Customer logo tile berada di tile `{rounded.none}` 0px dengan border tipis 1px.

---

## Components

### Buttons
- **`button-primary`** — Blue solid CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 12px 16px, rounded `{rounded.none}`. Pressed → `{colors.blue-80}`.
- **`button-secondary`** — Charcoal solid. Background `{colors.ink}`, text `{colors.inverse-ink}`, padding 12px 16px, rounded `{rounded.none}`.
- **`button-tertiary`** — Putih dengan border 1px biru + teks biru. Background `{colors.canvas}`, text `{colors.primary}`, border 1px `{colors.primary}`, padding 12px 16px, rounded `{rounded.none}`.
- **`button-ghost`** — Plain text + chevron, tanpa background sampai hover. Text `{colors.primary}`, padding 12px 16px, rounded `{rounded.none}`.
- **`button-danger`** — Background `{colors.semantic-error}`, text `{colors.on-primary}`, rounded `{rounded.none}`.

### Cards & Containers
- **`feature-card`** — Tile highlight default (Keunggulan, Layanan). Canvas, padding 24px, stroke 1px `{colors.hairline}`.
- **`feature-card-elevated`** — Bentuk sama di atas `{colors.surface-1}` — untuk card "Recommended"/unggulan.
- **`product-card`** — Tile showcase produk lebih besar (Paket Harga). Canvas, padding 32px.
- **`hero-card`** — Card komposisi hero dengan judul ringan, body, CTA. Canvas, padding 48px, type `{typography.display-md}`.
- **`cta-banner`** — Panel CTA biru full-width dekat bawah halaman. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.headline}`, padding 48px.
- **`resource-tile`** — Tile artikel/testimoni lebih kecil. Canvas, padding 16px, type `{typography.body-sm}`.
- **`customer-logo-tile`** — Tile tunggal di marquee vendor. Canvas, text `{colors.ink-muted}`, type `{typography.caption}`, padding 24px, border hairline 1px.
- **`team-card`** — Tile anggota tim. Canvas, foto/placeholder datar, nama `{typography.card-title}`, peran `{typography.body-sm}` `{colors.ink-muted}`.

### Inputs & Forms
- **`text-input`** / **`text-input-focused`** / **`text-input-error`** — Chrome input Carbon. Background `{colors.surface-1}`, text `{colors.ink}`, padding 11px 16px, rounded `{rounded.none}`. Focus mengganti hairline bawah 1px dengan underline 2px `{colors.primary}`. Error menambah underline 2px `{colors.semantic-error}`.
- **`newsletter-input`** — Capture "Client Area" / penawaran. Background `{colors.surface-1}`, padding 11px 16px. Submit di sebelahnya = `button-primary`.

### Tabs
- **`product-tab`** / **`product-tab-selected`** — Tab strip horizontal untuk **Program** (e-Government, Desa Pintar, UMKM Mandiri, Sekolah Unggul) dan **Edukasi**.
  - Default: `{colors.canvas}` bg, `{colors.ink-muted}` text, padding 16px 20px, bottom 1px hairline.
  - Selected: `{colors.canvas}` bg, `{colors.ink}` text, weight `{typography.body-emphasis}`, bottom 2px `{colors.primary}` underline.

### Navigation
- **`top-nav`** — Bar putih sticky: logomark Clasnet kiri, kategori nav tengah, Client Area + search kanan. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 48px, bottom hairline 1px.
- **`utility-bar`** — Ribbon abu ramping di atas top nav: lokasi, telepon, email, sosmed. Background `{colors.surface-1}`, text `{colors.ink-muted}`, type `{typography.caption}`, height 32px.

### Footer
- **`footer`** — Footer charcoal (`{colors.inverse-canvas}`) dengan wordmark Clasnet kiri dan 5–6 kolom link caption-sized. Satu-satunya permukaan inverted. Padding 64px 32px.

---

## Content & Page Structure (Pemetaan Konten Lama → Baru)

Konten diambil dari clasnet.co.id lama. Ritme section (atas → bawah):

| # | Section | Surface | Komponen | Konten Clasnet |
|---|---|---|---|---|
| 1 | Utility bar | `surface-1` | `utility-bar` | Alamat Wangon, +62 851-1704-1846, info@clasnet.co.id, sosmed |
| 2 | Top nav | `canvas` | `top-nav` | Wordmark CLASNET · Beranda, Profil, Program, Produk, Edukasi, Portofolio, Kontak · Client Area |
| 3 | Hero | `canvas` + soft blue gradient | `hero-card`, `button-primary`, `button-tertiary` | Eyebrow "Kreatif & Inovatif"; display-xl "Solusi Digital Kreatif & Inovatif"; subhead "Mitra meningkatkan Bisnis Anda"; CTA Penawaran Gratis + Hubungi Kami |
| 4 | Fact band | `surface-1` | stat row | 2123 Klien · 345 Produk · 125 Layanan |
| 5 | Tentang Kami | `canvas` | enterprise feature row + hairline checkmark | "Solusi IT Terbaik dengan Pengalaman 20 Tahun lebih"; teks + ilustrasi; 3 checkmark; stats 85% / 54+ |
| 6 | Keunggulan | `canvas` | `feature-card` ×4 | Terbaik di Industri, Pemenang Penghargaan, Staf Profesional, Dukungan 24/7 |
| 7 | Layanan | `surface-1` | `feature-card` ×5 + CTA card | Keamanan Siber, Analisis Data, Pengembangan Web, Pengembangan Aplikasi, Optimasi SEO + card "Hubungi Kami" |
| 8 | Paket Harga | `canvas` | `product-card` ×3 | Paket Dasar Rp49.000, Paket Standar Rp99.000, Paket Lanjutan Rp149.000 |
| 9 | Program | `surface-1` | `product-tab` strip + panel | e-Government, Desa Pintar, UMKM Mandiri, Sekolah Unggul (masing-masing 4 poin + ilustrasi) |
| 10 | Edukasi | `canvas` | feature row / tile | Kelas Industri, Magang, PKL, Unison Academy |
| 11 | Testimoni | `surface-1` | `resource-tile` ×4 | Andi Prasetyo, Budi Santoso, Siti Rahayu, Dinda Putri |
| 12 | Tim | `canvas` | `team-card` ×6 | Teguh Giana, Fika Saraswati, Rangga Buana, Windy Suprobo, Evellyn Meutia, Mohtar Mohamad |
| 13 | Vendor marquee | `canvas` | `customer-logo-tile` | 9 vendor (Vendor #1–#9) |
| 14 | Penawaran + Kontak | `surface-1` | `text-input`, map | Form nama/email/pesan + Google Map Wangon |
| 15 | CTA banner | `primary` | `cta-banner` | "Siap Melayani Kebutuhan IT Anda" + CTA Client Area |
| 16 | Footer | `inverse-canvas` | `footer` | Kontak, Program, Edukasi, Produk, Dokumentasi + copyright |

### Data Eksternal (dari situs lama)
- Client Area: `https://billing.clasnet.co.id/login` · Order: `.../order` · Signup: `.../signup`
- CCTV: `https://cctv.clasnet.id/harga-paket-4-camera/`
- SID (Desa): `https://desa-s.id/` · Kelas Industri: `https://kelasindustri.clasnet.co.id/`
- Magang: `https://internship.clasnet.id/` · PKL: `https://prakerin.clasnet.id/` · Academy: `https://academy.unison.id/`
- Dokumentasi footer: `desa-s.id/sid`, `prakerin.clasnet.id/doc`, `internship.clasnet.id/doc`,
  `prakerin.clasnet.id/administrasi`, `academy.unison.id/doc`, `billing.clasnet.co.id/doc`

---

## Do's and Don'ts

### Do
- Pakai `{rounded.none}` 0px pada setiap CTA, card, input, container. Estetika flat-square adalah brand.
- Pasangkan Plex Sans weight 300 untuk display (42px+) dengan weight 400 untuk body. Tahan keinginan menebalkan headline.
- Cadangkan `{colors.primary}` Clasnet Blue untuk primary CTA, link, focused-input underline, dan CTA banner. Jangan jadikan background card atau warna eyebrow.
- Terapkan `letter-spacing: 0.16px` pada ukuran body. Bagian dari suara tipografis.
- Pakai perubahan surface (`canvas` → `surface-1`) dan hairline 1px untuk hierarki card. Lewati drop shadow.
- Patuh sentence case untuk eyebrow dan section label — Carbon menolak all-caps tracking.
- Balik ke `{colors.inverse-canvas}` hanya di footer; sisa halaman tetap terang.

### Don't
- Jangan bulatkan sudut button, card, atau input. Bahkan 4px merusak tampilan Carbon.
- Jangan tebalkan display headline. Weight 300 adalah suara brand; weight 700 membuatnya generik.
- Jangan tambahkan kedalaman atmosferik (gradient backdrop, drop shadow, overlay) di luar soft-blue hero gradient yang terdokumentasi.
- Jangan perkenalkan warna brand kedua. Clasnet Blue satu-satunya aksen kromatik; semantik status pakai green/yellow/red terdokumentasi.
- Jangan ganti IBM Plex Sans dengan Inter/Helvetica tanpa mempertahankan `letter-spacing: 0.16px` dan display weight-300.
- Jangan pakai button pill. Carbon pakai sudut square; pill terbaca seperti brand lain.
- Jangan tulis eyebrow all-caps ber-tracking. Eyebrow Carbon sentence case di 14px.

---

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Max | 1584px | Carbon max grid; gutter melebar |
| Desktop-XL | 1312px | Layout desktop default (wrapper konten Clasnet) |
| Desktop | 1056px | Card grid 4-up dipertahankan |
| Tablet | 672px | Card grid 4-up → 2-up; nav jadi hamburger |
| Mobile | 320px | Single-column; display-xl 76px → ~32px |

### Touch Targets
- Spec Carbon: minimum tap target 48px. Button & input tahan 48px di viewport touch.
- Link top-nav tumbuh dari 36px ke 48px tap height di touch.
- Baris tab strip tahan 48px tap height.

### Collapsing Strategy
- **Top nav**: link collapse ke hamburger overlay di bawah 672px. Logomark + icon search tetap di bar.
- **Utility bar**: sembunyi di bawah 672px untuk menghemat ruang vertikal.
- **Card grid**: 4-up → 2-up di 1056px → 1-up di bawah 672px.
- **Display type**: `{typography.display-xl}` 76px turun ke ~42px di mobile sambil mempertahankan weight-300.
- **Footer**: 6-column link grid → 3-column di tablet → 1-column di mobile.

### Image Behavior
- Logo vendor di marquee mempertahankan aspect ratio, boleh collapse ke 2-row scroll di bawah 672px.
- Ilustrasi hero scale proporsional; di bawah 672px boleh menumpuk di atas headline.

---

## Iteration Guide
1. Fokus pada SATU komponen sekaligus dan rujuk dengan nama token `components:`-nya.
2. Default body ke `{typography.body}` weight 400 dengan `letter-spacing: 0.16px`. Jangan hapus tracking.
3. Saat menambah section baru, putuskan apakah ia di `{colors.canvas}` (default) atau `{colors.surface-1}` (alternate band). Ritme dua-surface adalah ritmenya.
4. Tambahkan varian baru sebagai entri komponen terpisah (`button-primary-pressed`, `text-input-error`, `text-input-focused`).
5. Perlakukan Clasnet Blue sebagai langka: link, primary CTA, CTA banner, focus underline. Lebih dari itu = drift.
6. Tolak rounded corner. Jika ada dorongan rounding 4px, brand sedang bergeser dari Carbon.

---

## Implementation (Struktur File)

Situs dibangun **multi-page** (bukan single-page) — satu file HTML per entri nav, dengan
header/footer bersama yang di-inject via `js/layout.js`.

```
webclasnet/
├── design.md              ← dokumen ini (single source of truth)
├── server.js              ← Node static file server (preview lokal, port 8080)
├── index.html             ← Home          (hero, fact band, teaser Tentang/Layanan/Program/Testimoni, client band)
├── profil.html            ← Profil        (Tentang Kami penuh + stats, Keunggulan, Tim dengan foto asli)
├── program.html           ← Program       (tab strip 4 program dalam .frame)
├── produk.html            ← Produk        (Layanan, Paket Harga 3 tier, Platform Lain)
├── edukasi.html           ← Edukasi       (4 edu-card + Cara Bergabung 3 langkah)
├── portofolio.html        ← Portofolio    (filter-bar + grid JS-render, Testimoni, vendor marquee)
├── portofolio-detail.html ← Detail Proyek (per-item, ?id=X; hero + spesifikasi + prev/next + proyek terkait)
├── kontak.html            ← Kontak        (form quote + info + Google Maps embed)
├── page.html              ← Halaman CMS   (renderer generik halaman custom, ?slug=X)
├── css/style.css          ← design token + komponen Carbon + komponen multi-page
├── js/
│   ├── layout.js          ← ClasnetLayout.header(active) + footer() (string template, inject sinkron)
│   ├── content.js         ← window.CLASNET_CONTENT {site, menu}  (digenerate CMS — jangan edit manual)
│   ├── portfolio-data.js  ← PORTFOLIO[] 21 proyek + PORTFOLIO_CATEGORIES (digenerate CMS — jangan edit manual)
│   ├── pages.js           ← window.CLASNET_PAGES halaman published (digenerate CMS — jangan edit manual)
│   └── main.js            ← nav toggle, tabs, counter, reveal, marquee, portfolio render+filter+detail, form
├── assets/
│   ├── logo.png           ← globe mark Clasnet (512×444, PNG transparan; header/footer/admin/favicon)
│   ├── logo-wordmark.png  ← cadangan: wordmark lama (200×52)
│   ├── hero.jpg           ← foto hero (2088×1267) — TIDAK dipakai; hero pakai ilustrasi SVG
│   ├── crew/*.png         ← 6 foto tim asli
│   ├── img/*.jpg          ← foto konten asli (about/program/edukasi/testimoni/vendor)
│   └── portfolio/*.{jpg,png}  ← 21 screenshot proyek
├── admin/
│   ├── index.html         ← dasbor CMS (login + app shell, meta noindex)
│   ├── admin.css          ← styling Carbon untuk dasbor
│   └── admin.js           ← CRUD Halaman / Menu / Portofolio / Konten Situs
├── data/
│   ├── config.json        ← adminPassword (default "clasnet")
│   ├── site.json          ← identitas, kontak, sosial, SEO, footer
│   ├── menu.json          ← item navigasi (label, href, order, visible)
│   ├── pages.json         ← halaman system + custom
│   ├── portfolio.json     ← 21 proyek
│   └── backup/            ← snapshot otomatis sebelum tiap tulis
└── _old_site.html         ← arsip HTML situs lama (referensi konten)
```

### Pemetaan Halaman ↔ Nav
| `data-page` | File | Section utama |
|-------------|------|---------------|
| `home` | index.html | Hero · Fact band · Tentang teaser · Keunggulan · Layanan teaser · Program teaser · Testimoni teaser · CTA · Client band |
| `profil` | profil.html | Tentang Kami penuh + stats · Keunggulan · Tim (foto asli) |
| `program` | program.html | Tab strip: e-Government · Desa Pintar · UMKM · Sekolah Unggul |
| `produk` | produk.html | Layanan (5) · Paket Harga (3 tier) · Platform Lain |
| `edukasi` | edukasi.html | Edukasi (4) · Cara Bergabung (3 langkah) |
| `portofolio` | portofolio.html | Filter + grid (21 proyek) · Testimoni · Vendor marquee |
| `kontak` | kontak.html | Form quote · Info kontak · Google Maps · Client band |

### Catatan Implementasi
- IBM Plex Sans dimuat via Google Fonts (weight 300, 400, 600).
- Semua token warna/spacing didefinisikan sebagai CSS custom properties di `:root`.
- Header/footer **tidak** diduplikasi per halaman — hidup di `js/layout.js` sebagai template string,
  di-inject **sinkron** via inline script di mount point (`#site-header`/`#site-footer`) sehingga tanpa
  FOUC dan tetap jalan di `file://` maupun `http://`. Nav aktif ditentukan dari `<body data-page="...">`.
- Foto tim/vendor/konten memakai **gambar asli** hasil mirror HTTrack (`I:\My Web Sites\clasnet`) —
  frame 0px, hairline 1px, aspect-ratio dijaga via `.frame`/`.portfolio-thumb`.
- Data portofolio (21 proyek) diekstrak dari SQLite `I:\portfolio` (via `node:sqlite`) → `js/portfolio-data.js`;
  grid di-render client-side + filter kategori (ARIA `aria-pressed`).
- Tiap kartu portofolio menaut ke **halaman detail per-item** `portofolio-detail.html?id=X` — di-render
  client-side dari `PORTFOLIO` (hero + breadcrumb, screenshot, spesifikasi, prev/next, proyek terkait).
  Judul tab & meta description di-set dinamis per proyek; `?id` tak valid fallback ke proyek pertama.
- Ilustrasi hero tetap inline SVG geometris datar (mesh/dotted) — tanpa dependensi eksternal.
- Tidak ada drop shadow di seluruh permukaan marketing.
- Preview lokal: `node server.js` → http://localhost:8080/ (clean-URL `.html` fallback, no-store cache).

---

## CMS — Dasbor Manajemen Konten

Dasbor lokal untuk mengelola konten tanpa menyentuh kode. Akses: **http://localhost:8080/admin/**
(password default `clasnet` — ubah di `data/config.json` atau env `ADMIN_PASSWORD`).

**Arsitektur (JSON-backed, tanpa dependensi):**
- Sumber kebenaran: `data/*.json` — `site.json` (identitas/kontak/sosial/footer/SEO), `menu.json`
  (navigasi), `pages.json` (halaman), `portfolio.json` (proyek), `config.json` (password).
  Folder `/data` TIDAK disajikan publik (403).
- `server.js` = static server + REST API `/api/*` (login, data, CRUD site/menu/pages/portfolio,
  upload gambar base64). Auth via header `x-admin-token`. Setiap tulis membuat backup +
  **men-generate ulang** file publik sinkron: `js/content.js` (site+menu → `layout.js`),
  `js/portfolio-data.js` (portfolio → `portofolio.html`/`main.js`), `js/pages.js` (→ `page.html`).
- `layout.js` membaca `window.CLASNET_CONTENT` (nav/kontak/sosial/footer) dengan **fallback** ke
  nilai bawaan bila `content.js` tak ada → situs tak pernah rusak. `content.js` dimuat sebelum
  `layout.js` di setiap halaman.
- Halaman baru dari dasbor = tipe `custom`, dirender `page.html?slug=X` (bodyHtml). 7 halaman
  bawaan = tipe `system` (konten visual tetap di file .html; dasbor kelola metadata + menu).
- Dasbor (`admin/`) memakai token Carbon yang sama (`/css/style.css`) + `admin.css`.

**CRUD tersedia:** Halaman (tambah/edit/hapus + konten HTML untuk halaman kustom), Menu
(urutan/label/tautan/tampil), Portofolio (semua field + unggah screenshot), Konten Situs
(identitas, kontak, sosial, footer kolom/legal, SEO, password).

## Known Gaps
- Permukaan produk Clasnet (billing/SID/academy) punya pemakaian komponen Carbon yang lebih
  kaya (data table, breadcrumb, contextual menu) yang tidak ada di halaman marketing — komponen
  itu hidup di dokumentasi Carbon, bukan di ekstraksi marketing ini.
- Styling error/validasi form-field terdokumentasi di Carbon docs; halaman lama tidak merender error state.
- Dark mode (Gray-100 theme Carbon) tidak diekspos di halaman marketing — hanya footer yang membalik.
- Sub-domain (billing/desa-s/academy) memakai chrome platform berbeda yang mendekati Carbon
  tapi tidak ketat — sistem terdokumentasi ini berlaku untuk clasnet.co.id proper.
