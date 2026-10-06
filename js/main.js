/* ============================================================
   CLASNET — main.js (multi-page)
   Interaksi: nav toggle, tabs Program, counter, reveal,
   marquee loop, back-to-top, validasi form, render+filter portofolio.
   Active nav diatur statis oleh layout.js (body[data-page]).
   Menghormati prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Program tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".product-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));
  function selectTab(tab) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
    panels.forEach(function (p) { p.classList.remove("is-active"); });
    tab.setAttribute("aria-selected", "true");
    var panel = document.getElementById(tab.getAttribute("aria-controls"));
    if (panel) panel.classList.add("is-active");
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var idx = null;
      if (e.key === "ArrowRight") idx = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") idx = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") idx = 0;
      else if (e.key === "End") idx = tabs.length - 1;
      if (idx !== null) { e.preventDefault(); tabs[idx].focus(); selectTab(tabs[idx]); }
    });
  });

  /* ---------- Counter animation ---------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString("id-ID"); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("id-ID");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("id-ID");
    }
    requestAnimationFrame(step);
  }
  function triggerCounters(scope) {
    scope.querySelectorAll(".counter").forEach(function (c) {
      if (!c.dataset.done) { c.dataset.done = "1"; animateCounter(c); }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          triggerCounters(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // counter di fact band (bila tidak berada dalam .reveal)
    document.querySelectorAll(".fact-band, .about-stats").forEach(function (band) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { triggerCounters(entry.target); io2.unobserve(entry.target); }
        });
      }, { threshold: 0.3 });
      io2.observe(band);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    document.querySelectorAll(".counter").forEach(function (c) {
      c.textContent = (parseInt(c.getAttribute("data-target"), 10) || 0).toLocaleString("id-ID");
    });
  }

  /* ---------- Marquee seamless loop ---------- */
  var track = document.getElementById("marqueeTrack");
  if (track && !reduceMotion) { track.innerHTML = track.innerHTML + track.innerHTML; }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Form validation ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    function setFieldState(input, ok) {
      var field = input.closest(".field");
      if (!field) return;
      field.classList.toggle("has-error", !ok);
      input.classList.toggle("is-error", !ok);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var valid = true;

      var nameOk = name.value.trim().length > 0;
      setFieldState(name, nameOk); if (!nameOk) valid = false;

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setFieldState(email, emailOk); if (!emailOk) valid = false;

      if (!valid) {
        var firstErr = form.querySelector(".field.has-error input");
        if (firstErr) firstErr.focus();
        return;
      }
      var subject = encodeURIComponent("Permintaan Penawaran — " + name.value.trim());
      var body = encodeURIComponent(
        "Nama: " + name.value.trim() + "\nEmail: " + email.value.trim() +
        "\n\nPesan:\n" + (form.querySelector("#message").value || "-")
      );
      window.location.href = "mailto:info@clasnet.co.id?subject=" + subject + "&body=" + body;
      form.reset();
    });
    form.querySelectorAll(".text-input, .text-area").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
        input.classList.remove("is-error");
      });
    });
  }

  /* ---------- Portfolio helpers (dipakai grid + halaman detail) ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function cardHTML(p) {
    var chips = "";
    if (p.type) chips += '<span class="chip chip--accent">' + esc(p.type) + "</span>";
    (p.langs || []).forEach(function (l) { chips += '<span class="chip">' + esc(l) + "</span>"; });
    var price = p.price ? '<span class="portfolio-price">' + esc(p.price) + "</span>" : '<span class="portfolio-price">Custom</span>';
    var href = "portofolio-detail.html?id=" + p.id;
    return '' +
      '<article class="portfolio-card" data-cat="' + esc(p.cat) + '">' +
        '<a class="portfolio-thumb" href="' + href + '" aria-label="Lihat detail ' + esc(p.title) + '"><img src="' + p.img + '" alt="Screenshot ' + esc(p.title) + '" loading="lazy"></a>' +
        '<div class="portfolio-body">' +
          '<span class="eyebrow">' + esc(p.cat) + "</span>" +
          '<h3 class="card-title"><a href="' + href + '">' + esc(p.title) + "</a></h3>" +
          "<p>" + esc(p.desc) + "</p>" +
          (chips ? '<div class="portfolio-meta">' + chips + "</div>" : "") +
          '<div class="portfolio-foot">' + price +
            '<a class="link-arrow" href="' + href + '">Detail ' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>' +
            "</a>" +
          "</div>" +
        "</div>" +
      "</article>";
  }

  /* ---------- Portfolio render + filter ---------- */
  var grid = document.getElementById("portfolioGrid");
  if (grid && typeof PORTFOLIO !== "undefined") {
    var filterBar = document.getElementById("portfolioFilter");
    var countEl = document.getElementById("portfolioCount");
    var current = "Semua";

    function render() {
      var items = PORTFOLIO.filter(function (p) { return current === "Semua" || p.cat === current; });
      grid.innerHTML = items.map(cardHTML).join("");
      if (countEl) countEl.textContent = items.length + " proyek ditampilkan";
    }
    if (filterBar && typeof PORTFOLIO_CATEGORIES !== "undefined") {
      var cats = ["Semua"].concat(PORTFOLIO_CATEGORIES);
      filterBar.innerHTML = cats.map(function (c) {
        return '<button class="filter-btn" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === "Semua" ? "true" : "false") + '">' + esc(c) + "</button>";
      }).join("");
      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (!btn) return;
        current = btn.getAttribute("data-cat");
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        render();
      });
    }
    render();
  }

  /* ---------- Portfolio detail page (portofolio-detail.html?id=X) ---------- */
  var detailRoot = document.getElementById("detailRoot");
  if (detailRoot && typeof PORTFOLIO !== "undefined") {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get("id"), 10);
    var proj = null, idx = 0;
    for (var d = 0; d < PORTFOLIO.length; d++) {
      if (PORTFOLIO[d].id === id) { proj = PORTFOLIO[d]; idx = d; break; }
    }
    if (!proj) proj = PORTFOLIO[0];

    var prev = PORTFOLIO[(idx - 1 + PORTFOLIO.length) % PORTFOLIO.length];
    var next = PORTFOLIO[(idx + 1) % PORTFOLIO.length];

    // Proyek terkait: kategori sama dulu, lalu sisanya, maks 3
    var related = [], k;
    for (k = 0; k < PORTFOLIO.length && related.length < 3; k++) {
      var it = PORTFOLIO[k];
      if (it.id === proj.id) continue;
      if (it.cat === proj.cat || (proj.cats && proj.cats.indexOf(it.cat) > -1) || (it.cats && it.cats.indexOf(proj.cat) > -1)) related.push(it);
    }
    for (k = 0; k < PORTFOLIO.length && related.length < 3; k++) {
      if (PORTFOLIO[k].id !== proj.id && related.indexOf(PORTFOLIO[k]) === -1) related.push(PORTFOLIO[k]);
    }

    // Judul tab + meta description dinamis
    document.title = proj.title + " · Portofolio Clasnet";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", proj.desc);

    var domain = proj.url;
    try { domain = new URL(proj.url).hostname.replace(/^www\./, ""); } catch (e) {}

    var EXT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

    var h = "";
    // Hero
    h += '<section class="page-hero"><div class="container">';
    h += '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Beranda</a><span class="sep">/</span><a href="portofolio.html">Portofolio</a><span class="sep">/</span><span class="current">' + esc(proj.title) + "</span></nav>";
    h += '<span class="eyebrow">' + esc(proj.cat) + "</span>";
    h += '<h1 class="display-md">' + esc(proj.title) + "</h1>";
    h += '<p class="lead">' + esc(proj.desc) + "</p>";
    h += "</div></section>";

    // Media + spesifikasi
    h += '<section class="section"><div class="container"><div class="split split--text-wide">';
    h += '<div class="detail-media reveal"><div class="frame"><img src="' + proj.img + '" alt="Screenshot ' + esc(proj.title) + '"></div></div>';
    h += '<aside class="detail-side reveal">';
    h += '<h2 class="headline detail-side-title">Spesifikasi Proyek</h2>';
    h += '<ul class="spec-list">';
    h += '<li class="spec-row"><span class="spec-label">Kategori</span><span class="spec-value">' + esc(proj.cat) + "</span></li>";
    if (proj.type) h += '<li class="spec-row"><span class="spec-label">Tipe</span><span class="spec-value">' + esc(proj.type) + "</span></li>";
    h += '<li class="spec-row"><span class="spec-label">Teknologi</span><span class="spec-value spec-chips">' + (proj.langs || []).map(function (l) { return '<span class="chip">' + esc(l) + "</span>"; }).join("") + "</span></li>";
    h += '<li class="spec-row"><span class="spec-label">Investasi</span><span class="spec-value spec-price">' + esc(proj.price) + "</span></li>";
    h += '<li class="spec-row"><span class="spec-label">Situs</span><span class="spec-value"><a href="' + proj.url + '" target="_blank" rel="noopener">' + esc(domain) + " ↗</a></span></li>";
    h += "</ul>";
    h += '<div class="detail-actions">';
    h += '<a class="btn btn-primary" href="' + proj.url + '" target="_blank" rel="noopener">Kunjungi Situs ' + EXT + "</a>";
    h += '<a class="btn btn-tertiary" href="kontak.html">Diskusikan Proyek</a>';
    h += "</div>";
    h += "</aside>";
    h += "</div></div></section>";

    // Tentang proyek
    h += '<section class="section section--surface"><div class="container">';
    h += '<div class="section-head"><span class="eyebrow">Tentang Proyek</span><h2 class="display-md">' + esc(proj.title) + "</h2></div>";
    h += '<div class="detail-desc"><p>' + esc(proj.desc) + "</p></div>";
    h += "</div></section>";

    // Prev / Next
    h += '<nav class="prevnext" aria-label="Navigasi proyek"><div class="container">';
    h += '<a class="prevnext-link" href="portofolio-detail.html?id=' + prev.id + '"><span class="prevnext-dir">← Sebelumnya</span><span class="prevnext-name">' + esc(prev.title) + "</span></a>";
    h += '<a class="prevnext-link prevnext-link--next" href="portofolio-detail.html?id=' + next.id + '"><span class="prevnext-dir">Berikutnya →</span><span class="prevnext-name">' + esc(next.title) + "</span></a>";
    h += "</div></nav>";

    // Proyek terkait
    h += '<section class="section"><div class="container">';
    h += '<div class="section-head"><span class="eyebrow">Proyek Terkait</span><h2 class="display-md">Proyek Serupa</h2></div>';
    h += '<div class="portfolio-grid">' + related.map(cardHTML).join("") + "</div>";
    h += '<div class="detail-more"><a class="btn btn-tertiary" href="portofolio.html">Lihat Semua Portofolio</a></div>';
    h += "</div></section>";

    detailRoot.innerHTML = h;

    // observe .reveal yang dibuat setelah init
    var dReveal = detailRoot.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); dio.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      Array.prototype.forEach.call(dReveal, function (el) { dio.observe(el); });
    } else {
      Array.prototype.forEach.call(dReveal, function (el) { el.classList.add("is-visible"); });
    }
  }
})();
