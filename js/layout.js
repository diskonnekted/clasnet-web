/* ============================================================
   CLASNET — layout.js
   Header & footer bersama untuk semua halaman (multi-page).
   Di-inject sinkron di tiap halaman agar tanpa FOUC & tetap
   jalan via file:// maupun http://.
   Active nav ditentukan dari <body data-page="...">.
   ------------------------------------------------------------
   Konten (menu, kontak, sosial, footer) dibaca dari
   window.CLASNET_CONTENT (js/content.js, digenerate CMS).
   Bila tidak ada → fallback ke nilai bawaan (situs tetap jalan).
   ============================================================ */
var ClasnetLayout = (function () {
  "use strict";

  var C = (typeof window !== "undefined" && window.CLASNET_CONTENT) || {};
  var SITE = C.site || {};
  var BRAND = SITE.brand || {};
  var CONTACT = SITE.contact || {};
  var SOCIAL = SITE.social || {};
  var CLIENT = SITE.clientArea || {};
  var FOOTER = SITE.footer || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* --- Nav: dari menu CMS (visible, urut order) atau fallback --- */
  var NAV_FALLBACK = [
    { key: "home", href: "index.html", label: "Beranda" },
    { key: "profil", href: "profil.html", label: "Profil" },
    { key: "program", href: "program.html", label: "Program" },
    { key: "produk", href: "produk.html", label: "Produk" },
    { key: "edukasi", href: "edukasi.html", label: "Edukasi" },
    { key: "portofolio", href: "portofolio.html", label: "Portofolio" },
    { key: "kontak", href: "kontak.html", label: "Kontak" }
  ];
  var NAV = (function () {
    if (C.menu && C.menu.length) {
      return C.menu.filter(function (m) { return m && m.visible !== false; })
        .slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); })
        .map(function (m) { return { key: m.key || m.slug || m.id || m.label, href: m.href || "#", label: m.label || "" }; });
    }
    return NAV_FALLBACK;
  })();

  /* --- Nilai konten (dengan fallback) --- */
  var B_NAME = BRAND.name || "CLAS";
  var B_ACCENT = BRAND.accent || "NET";
  var B_SUB = BRAND.sub || "Software House";
  var ADDRESS = CONTACT.address || "Jl. Seruling Mas No.32 Wangon, Banjarnegara, Jawa Tengah";
  var PHONE = CONTACT.phone || "+62 851-1704-1846";
  var PHONE_HREF = CONTACT.phoneHref || "tel:+6285117041846";
  var EMAIL = CONTACT.email || "info@clasnet.co.id";
  var S_FB = SOCIAL.facebook || "#";
  var S_TW = SOCIAL.twitter || "#";
  var S_IG = SOCIAL.instagram || "#";
  var S_LI = SOCIAL.linkedin || "#";
  var CTA_LABEL = CLIENT.label || "Client Area";
  var CTA_HREF = CLIENT.href || "https://billing.clasnet.co.id/login";
  var F_ABOUT = FOOTER.about || "Perusahaan pengembangan IT yang berkomitmen memberikan solusi teknologi informasi terbaik untuk instansi, desa, UMKM, dan sekolah di seluruh Indonesia.";
  var F_BOTTOM = FOOTER.bottom || "© Clasnet Group. All Rights Reserved. Dibangun dengan Carbon Design System.";
  var F_LEGAL = FOOTER.legal || [{ label: "Syarat & Ketentuan", href: "syarat-ketentuan.html" }, { label: "Kebijakan Privasi", href: "kebijakan-privasi.html" }];
  var F_COLUMNS = FOOTER.columns || [
    { title: "Program", links: [{ label: "e-Government", href: "program.html" }, { label: "Desa Pintar", href: "program.html" }, { label: "UMKM Mandiri", href: "program.html" }, { label: "Sekolah Unggul", href: "program.html" }] },
    { title: "Edukasi", links: [{ label: "Kelas Industri", href: "https://kelasindustri.clasnet.co.id/", external: true }, { label: "Magang / Internship", href: "https://internship.clasnet.id/", external: true }, { label: "PKL", href: "https://prakerin.clasnet.id/", external: true }, { label: "Unison Academy", href: "https://academy.unison.id/", external: true }] },
    { title: "Produk", links: [{ label: "Paket Harga", href: "produk.html" }, { label: "CCTV", href: "https://cctv.clasnet.id/harga-paket-4-camera/", external: true }, { label: "Permintaan Penawaran", href: "produk.html" }, { label: "Client Area", href: "https://billing.clasnet.co.id/login", external: true }] },
    { title: "Perusahaan", links: [{ label: "Tentang Kami", href: "profil.html" }, { label: "Portofolio", href: "portofolio.html" }, { label: "Anggota Tim", href: "profil.html#tim" }, { label: "Kontak", href: "kontak.html" }] }
  ];

  /* --- Icon SVG (Feather-style, stroke) --- */
  var I = {
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    fb: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    tw: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
    ig: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    li: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
  };

  function brandBlock() {
    return '<a href="index.html" class="brand" aria-label="' + esc(B_NAME + B_ACCENT) + '">' +
      '<img src="assets/logo.png" alt="Logo Clasnet">' +
      '<span class="brand-text">' +
      '<span class="brand-name">' + esc(B_NAME) + '<span>' + esc(B_ACCENT) + '</span></span>' +
      '<span class="brand-sub">' + esc(B_SUB) + '</span>' +
      '</span></a>';
  }

  function socialLinks(cls) {
    return '<div class="' + cls + '">' +
      '<a href="' + esc(S_FB) + '" aria-label="Facebook"' + (S_FB !== "#" ? ' target="_blank" rel="noopener"' : "") + '>' + I.fb + '</a>' +
      '<a href="' + esc(S_TW) + '" aria-label="Twitter"' + (S_TW !== "#" ? ' target="_blank" rel="noopener"' : "") + '>' + I.tw + '</a>' +
      '<a href="' + esc(S_IG) + '" aria-label="Instagram"' + (S_IG !== "#" ? ' target="_blank" rel="noopener"' : "") + '>' + I.ig + '</a>' +
      '<a href="' + esc(S_LI) + '" aria-label="LinkedIn"' + (S_LI !== "#" ? ' target="_blank" rel="noopener"' : "") + '>' + I.li + '</a>' +
    '</div>';
  }

  function header(active) {
    var links = NAV.map(function (n) {
      return '<a href="' + esc(n.href) + '"' + (n.key === active ? ' class="active"' : '') + '>' + esc(n.label) + '</a>';
    }).join("");

    return '' +
    '<!-- UTILITY BAR -->' +
    '<div class="utility-bar"><div class="container">' +
      '<div class="utility-info">' +
        '<span class="utility-item">' + I.pin + ' ' + esc(ADDRESS) + '</span>' +
        '<span class="utility-item">' + I.phone + ' ' + esc(PHONE) + '</span>' +
        '<span class="utility-item">' + I.mail + ' ' + esc(EMAIL) + '</span>' +
      '</div>' +
      socialLinks("utility-social") +
    '</div></div>' +
    '<!-- TOP NAV -->' +
    '<nav class="top-nav" id="topnav"><div class="container">' +
      brandBlock() +
      '<div class="nav-links" id="navLinks">' + links + '</div>' +
      '<div class="nav-cta"><a class="btn btn-primary" href="' + esc(CTA_HREF) + '" target="_blank" rel="noopener">' + esc(CTA_LABEL) + '</a></div>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-expanded="false" aria-controls="navLinks">' + I.menu + '</button>' +
    '</div></nav>';
  }

  function footerColumns() {
    return F_COLUMNS.map(function (col) {
      var lis = (col.links || []).map(function (l) {
        return '<li><a href="' + esc(l.href) + '"' + (l.external ? ' target="_blank" rel="noopener"' : "") + '>' + esc(l.label) + '</a></li>';
      }).join("");
      return '<div class="footer-col"><h4>' + esc(col.title) + '</h4><ul>' + lis + '</ul></div>';
    }).join("");
  }

  function footer() {
    var legal = F_LEGAL.map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>';
    }).join("");

    return '' +
    '<footer class="footer"><div class="container">' +
      '<div class="footer-top">' +
        '<div class="footer-brand">' +
          '<div class="logo-wrap">' +
            '<img src="assets/logo.png" alt="Logo Clasnet">' +
            '<span class="brand-text"><span class="brand-name">' + esc(B_NAME) + '<span>' + esc(B_ACCENT) + '</span></span><span class="brand-sub">' + esc(B_SUB) + '</span></span>' +
          '</div>' +
          '<p>' + esc(F_ABOUT) + '</p>' +
          '<div class="footer-contact">' +
            '<span>' + I.pin + ' ' + esc(ADDRESS) + '</span>' +
            '<a href="' + esc(PHONE_HREF) + '">' + I.phone + ' ' + esc(PHONE) + '</a>' +
            '<a href="mailto:' + esc(EMAIL) + '">' + I.mail + ' ' + esc(EMAIL) + '</a>' +
          '</div>' +
          socialLinks("footer-social") +
        '</div>' +
        footerColumns() +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span class="caption">' + esc(F_BOTTOM) + '</span>' +
        '<div class="footer-legal">' + legal + '</div>' +
      '</div>' +
    '</div></footer>' +
    '<button class="to-top" id="toTop" aria-label="Kembali ke atas">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>' +
    '</button>';
  }

  return { header: header, footer: footer };
})();
