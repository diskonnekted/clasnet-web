/* ============================================================
   Clasnet CMS — admin.js
   Dasbor manajemen konten: Halaman, Menu, Portofolio, Konten Situs.
   Vanilla JS, tanpa dependensi. API: /api/* (header x-admin-token).
   ============================================================ */
(function () {
  "use strict";

  var TOKEN_KEY = "clasnet_admin_token";
  var token = localStorage.getItem(TOKEN_KEY) || "";
  var DATA = { site: null, menu: [], pages: [], portfolio: [] };
  var route = "pages";
  var menuDraft = [];

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function val(id) { var e = document.getElementById(id); return e ? e.value : ""; }
  function checked(id) { var e = document.getElementById(id); return e ? e.checked : false; }
  function deep(o) { return JSON.parse(JSON.stringify(o)); }
  function field(label, control, span) { return '<div class="field' + (span ? " span-2" : "") + '"><label class="label">' + label + "</label>" + control + "</div>"; }
  function setPath(obj, path, v) { var ks = path.split("."), o = obj; for (var i = 0; i < ks.length - 1; i++) { o = o[ks[i]]; } o[ks[ks.length - 1]] = v; }

  /* ---------- api ---------- */
  function api(method, path, body) {
    var opts = { method: method, headers: { "Content-Type": "application/json" } };
    if (token) opts.headers["x-admin-token"] = token;
    if (body !== undefined) opts.body = JSON.stringify(body);
    return fetch(path, opts).then(function (r) {
      if (r.status === 401) { logout(); throw new Error("Sesi berakhir — silakan masuk lagi."); }
      return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || ("HTTP " + r.status)); return j; });
    });
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg, isErr) {
    var t = $("#toast"); t.textContent = msg; t.className = "toast" + (isErr ? " err" : ""); t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3400);
  }

  /* ---------- modal ---------- */
  function openModal(title, bodyHtml, footHtml) {
    var m = $("#modal");
    m.innerHTML = '<div class="modal"><div class="modal-head"><h2>' + esc(title) + '</h2><button class="modal-close" type="button" aria-label="Tutup">&times;</button></div><div class="modal-body">' + bodyHtml + '</div>' + (footHtml ? '<div class="modal-foot">' + footHtml + "</div>" : "") + "</div>";
    m.hidden = false;
    $(".modal-close", m).addEventListener("click", closeModal);
    m.onclick = function (e) { if (e.target === m) closeModal(); };
    return m;
  }
  function closeModal() { var m = $("#modal"); m.hidden = true; m.innerHTML = ""; m.onclick = null; }

  /* ---------- auth ---------- */
  function showLogin() { $("#app").hidden = true; $("#login").hidden = false; setTimeout(function () { var p = $("#loginPass"); if (p) p.focus(); }, 50); }
  function showApp() { $("#login").hidden = true; $("#app").hidden = false; }
  function logout() { token = ""; localStorage.removeItem(TOKEN_KEY); showLogin(); }

  /* ---------- data ---------- */
  function loadData() {
    return api("GET", "/api/data").then(function (d) {
      DATA.site = d.site; DATA.menu = d.menu || []; DATA.pages = d.pages || []; DATA.portfolio = d.portfolio || [];
    });
  }

  /* ---------- router ---------- */
  function setActions(html) { $("#topbarActions").innerHTML = html || ""; }
  function currentRoute() { var h = (location.hash || "#/pages").replace("#/", ""); return ["pages", "menu", "portfolio", "content"].indexOf(h) >= 0 ? h : "pages"; }
  function render() {
    route = currentRoute();
    $$("#sideLinks a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-route") === route); });
    var T = { pages: ["Halaman", "Kelola halaman & konten halaman."], menu: ["Menu", "Atur navigasi utama: urutan, label, tautan, tampil."], portfolio: ["Portofolio", "Kelola proyek portofolio."], content: ["Konten Situs", "Identitas, kontak, sosial, footer, SEO, dan password."] };
    $("#viewTitle").textContent = T[route][0]; $("#viewSub").textContent = T[route][1];
    if (route === "pages") renderPages(); else if (route === "menu") renderMenu(); else if (route === "portfolio") renderPortfolio(); else renderContent();
  }

  /* ================= PAGES ================= */
  function findPage(id) { for (var i = 0; i < DATA.pages.length; i++) if (DATA.pages[i].id === id) return DATA.pages[i]; return null; }
  function renderPages() {
    setActions('<button class="btn btn-primary" id="addPage">+ Tambah Halaman</button>');
    var rows = DATA.pages.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (p) {
      var isSys = p.type === "system";
      var viewHref = isSys ? "/" + (p.file || "index.html") : "/page.html?slug=" + encodeURIComponent(p.slug);
      return "<tr>" +
        '<td><div class="cell-title">' + esc(p.title) + '</div><div class="cell-sub">/' + esc(p.slug) + "</div></td>" +
        '<td><span class="badge ' + (isSys ? "accent" : "") + '">' + (isSys ? "Sistem" : "Kustom") + "</span></td>" +
        "<td>" + esc(p.navLabel || "—") + "</td><td>" + (p.order || 0) + "</td>" +
        '<td><span class="badge ' + (p.published === false ? "warn" : "ok") + '">' + (p.published === false ? "Draft" : "Tayang") + "</span></td>" +
        '<td class="col-actions"><div class="btn-row" style="justify-content:flex-end">' +
        '<a class="icon-btn" href="' + viewHref + '" target="_blank" rel="noopener">Lihat</a>' +
        '<button class="icon-btn" data-edit="' + esc(p.id) + '">Edit</button>' +
        (isSys ? "" : '<button class="icon-btn danger" data-del="' + esc(p.id) + '">Hapus</button>') +
        "</div></td></tr>";
    }).join("");
    $("#view").innerHTML = '<div class="panel"><div class="table-wrap"><table class="data"><thead><tr><th>Judul</th><th>Tipe</th><th>Label Nav</th><th>Urut</th><th>Status</th><th></th></tr></thead><tbody>' + (rows || '<tr><td colspan="6" class="empty">Belum ada halaman.</td></tr>') + "</tbody></table></div></div>";
    $("#addPage").addEventListener("click", function () { pageEditor(null); });
    $$("[data-edit]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { pageEditor(findPage(b.getAttribute("data-edit"))); }); });
    $$("[data-del]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { delPage(b.getAttribute("data-del")); }); });
  }
  function pageEditor(p) {
    var isNew = !p;
    p = p || { id: "", slug: "", title: "", navLabel: "", metaDescription: "", order: DATA.pages.length + 1, published: true, type: "custom", file: null, bodyHtml: "" };
    var isSys = p.type === "system";
    var body = '<div class="form-grid">' +
      field("Judul", '<input class="text-input" id="pf_title" value="' + esc(p.title) + '">') +
      field("Slug (URL)", '<input class="text-input" id="pf_slug" value="' + esc(p.slug) + '"' + (isNew ? "" : " readonly") + ">" + (isNew ? '<div class="help">huruf kecil, angka, tanda hubung</div>' : "")) +
      field("Label Nav", '<input class="text-input" id="pf_nav" value="' + esc(p.navLabel) + '">') +
      field("Urutan", '<input class="text-input" id="pf_order" type="number" value="' + (p.order || 1) + '">') +
      field("Meta Description", '<input class="text-input" id="pf_meta" value="' + esc(p.metaDescription) + '">', true) +
      '<div class="span-2"><label class="check-row"><input type="checkbox" id="pf_pub"' + (p.published === false ? "" : " checked") + "> Tayangkan halaman ini</label></div>" +
      "</div>" +
      (isSys
        ? '<p class="section-note" style="margin-top:var(--lg)">Halaman sistem: konten visual berada di file <code>' + esc(p.file) + "</code>. Dasbor mengelola metadata & menu-nya.</p>"
        : '<div class="field" style="margin-top:var(--lg)"><label class="label" for="pf_body">Konten HTML</label><textarea class="text-area" id="pf_body" rows="14" style="font-family:\'IBM Plex Mono\',monospace;font-size:13px">' + esc(p.bodyHtml) + '</textarea><div class="help">HTML dirender apa adanya di dalam container halaman.</div></div>');
    openModal(isNew ? "Tambah Halaman" : "Edit Halaman", body, '<button class="btn btn-tertiary" id="pf_cancel">Batal</button><button class="btn btn-primary" id="pf_save">Simpan</button>');
    $("#pf_cancel").addEventListener("click", closeModal);
    $("#pf_save").addEventListener("click", function () {
      var obj = { title: val("pf_title"), slug: val("pf_slug"), navLabel: val("pf_nav"), order: Number(val("pf_order")) || 1, metaDescription: val("pf_meta"), published: checked("pf_pub") };
      if (!isSys) obj.bodyHtml = val("pf_body");
      var req = isNew ? api("POST", "/api/pages", obj) : api("PUT", "/api/pages/" + encodeURIComponent(p.id), obj);
      if (isNew && !obj.slug) { toast("Slug wajib diisi", true); return; }
      req.then(closeModal).then(loadData).then(function () { renderPages(); toast(isNew ? "Halaman ditambahkan" : "Perubahan disimpan"); }).catch(function (e) { toast(e.message, true); });
    });
  }
  function delPage(id) {
    var p = findPage(id); if (!p) return;
    if (!confirm('Hapus halaman "' + p.title + '"?')) return;
    api("DELETE", "/api/pages/" + encodeURIComponent(id)).then(loadData).then(function () { renderPages(); toast("Halaman dihapus"); }).catch(function (e) { toast(e.message, true); });
  }

  /* ================= MENU ================= */
  function renderMenu() {
    setActions('<button class="btn btn-primary" id="saveMenu">Simpan Menu</button>');
    menuDraft = DATA.menu.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).map(function (m) { return deep(m); });
    drawMenu();
    $("#saveMenu").addEventListener("click", saveMenu);
  }
  function drawMenu() {
    var html = '<div class="panel"><div class="panel-head"><h2>Item Navigasi</h2><button class="icon-btn" id="addMenu">+ Tambah Item</button></div><div class="panel-body"><p class="section-note">Urutan = posisi di navigasi. Hilangkan centang "Tampil" untuk menyembunyikan. Perubahan tersimpan setelah menekan <b>Simpan Menu</b>.</p><ul class="menu-list" id="menuList">';
    menuDraft.forEach(function (m, i) {
      html += '<li class="menu-item' + (m.visible === false ? " hidden-item" : "") + '">' +
        '<span class="grip">' + (i + 1) + "</span>" +
        '<input class="text-input" data-f="label" value="' + esc(m.label) + '" placeholder="Label">' +
        '<input class="text-input" data-f="href" value="' + esc(m.href) + '" placeholder="href (mis. produk.html)">' +
        '<label class="check-row"><input type="checkbox" data-f="visible"' + (m.visible === false ? "" : " checked") + '> Tampil</label>' +
        '<div class="btn-row"><button class="icon-btn" data-up="' + i + '"' + (i === 0 ? " disabled" : "") + '>↑</button><button class="icon-btn" data-down="' + i + '"' + (i === menuDraft.length - 1 ? " disabled" : "") + '>↓</button><button class="icon-btn danger" data-rm="' + i + '">✕</button></div>' +
        "</li>";
    });
    html += "</ul></div></div>";
    $("#view").innerHTML = html;
    $("#addMenu").addEventListener("click", function () { menuDraft.push({ id: "item-" + Date.now(), key: "", label: "Item Baru", href: "index.html", order: menuDraft.length + 1, visible: true }); drawMenu(); });
    $$("#menuList .menu-item").forEach(function (li, i) {
      $$("[data-f]", li).forEach(function (inp) {
        inp.addEventListener("change", function () {
          var f = inp.getAttribute("data-f");
          menuDraft[i][f] = (f === "visible") ? inp.checked : inp.value;
          if (f === "visible") li.classList.toggle("hidden-item", !inp.checked);
        });
      });
    });
    $$("[data-up]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { var i = +b.getAttribute("data-up"); if (i > 0) { var t = menuDraft[i - 1]; menuDraft[i - 1] = menuDraft[i]; menuDraft[i] = t; drawMenu(); } }); });
    $$("[data-down]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { var i = +b.getAttribute("data-down"); if (i < menuDraft.length - 1) { var t = menuDraft[i + 1]; menuDraft[i + 1] = menuDraft[i]; menuDraft[i] = t; drawMenu(); } }); });
    $$("[data-rm]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { menuDraft.splice(+b.getAttribute("data-rm"), 1); drawMenu(); }); });
  }
  function saveMenu() {
    menuDraft.forEach(function (m, i) { m.order = i + 1; if (!m.key) m.key = (m.href || m.label || "item").replace(/[^a-z0-9]+/gi, "-").toLowerCase(); });
    api("PUT", "/api/menu", { items: menuDraft }).then(loadData).then(function () { renderMenu(); toast("Menu disimpan"); }).catch(function (e) { toast(e.message, true); });
  }

  /* ================= PORTFOLIO ================= */
  function findPort(id) { for (var i = 0; i < DATA.portfolio.length; i++) if (String(DATA.portfolio[i].id) === String(id)) return DATA.portfolio[i]; return null; }
  function renderPortfolio() {
    setActions('<button class="btn btn-primary" id="addPort">+ Tambah Proyek</button>');
    var rows = DATA.portfolio.map(function (p) {
      return "<tr>" +
        '<td>' + (p.img ? '<img class="thumb-sm" src="/' + esc(p.img) + '" alt="" onerror="this.style.visibility=\'hidden\'">' : '<span class="thumb-sm"></span>') + "</td>" +
        '<td><div class="cell-title">' + esc(p.title) + '</div><div class="cell-sub">' + esc((p.langs || []).join(", ")) + "</div></td>" +
        "<td>" + esc(p.cat) + "</td><td>" + esc(p.type || "—") + "</td><td>" + esc(p.price || "—") + "</td>" +
        '<td class="col-actions"><div class="btn-row" style="justify-content:flex-end">' +
        '<a class="icon-btn" href="/portofolio-detail.html?id=' + encodeURIComponent(p.id) + '" target="_blank" rel="noopener">Lihat</a>' +
        '<button class="icon-btn" data-edit="' + esc(p.id) + '">Edit</button>' +
        '<button class="icon-btn danger" data-del="' + esc(p.id) + '">Hapus</button>' +
        "</div></td></tr>";
    }).join("");
    $("#view").innerHTML = '<div class="panel"><div class="table-wrap"><table class="data"><thead><tr><th></th><th>Judul</th><th>Kategori</th><th>Tipe</th><th>Harga</th><th></th></tr></thead><tbody>' + (rows || '<tr><td colspan="6" class="empty">Belum ada proyek.</td></tr>') + "</tbody></table></div></div>";
    $("#addPort").addEventListener("click", function () { portEditor(null); });
    $$("[data-edit]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { portEditor(findPort(b.getAttribute("data-edit"))); }); });
    $$("[data-del]", $("#view")).forEach(function (b) { b.addEventListener("click", function () { delPort(b.getAttribute("data-del")); }); });
  }
  function portEditor(p) {
    var isNew = !p;
    p = p || { id: "", title: "", cat: "", cats: [], type: "", langs: [], price: "", img: "", url: "", desc: "" };
    var body = '<div class="form-grid">' +
      field("Judul", '<input class="text-input" id="q_title" value="' + esc(p.title) + '">', true) +
      field("Kategori Utama", '<input class="text-input" id="q_cat" value="' + esc(p.cat) + '" list="catList"><datalist id="catList">' + catsOptions() + "</datalist>") +
      field("Tipe", '<input class="text-input" id="q_type" value="' + esc(p.type) + '" placeholder="mis. Web App">') +
      field("Kategori Tambahan (pisahkan koma)", '<input class="text-input" id="q_cats" value="' + esc((p.cats || []).join(", ")) + '">', true) +
      field("Teknologi / Bahasa (pisahkan koma)", '<input class="text-input" id="q_langs" value="' + esc((p.langs || []).join(", ")) + '">', true) +
      field("Harga", '<input class="text-input" id="q_price" value="' + esc(p.price) + '" placeholder="Rp60.000.000">') +
      field("URL Situs", '<input class="text-input" id="q_url" value="' + esc(p.url) + '" placeholder="https://…">') +
      '<div class="span-2"><label class="label">Gambar (screenshot)</label><div class="img-picker">' +
        '<img class="img-preview" id="q_img_prev" src="' + (p.img ? "/" + esc(p.img) : "") + '"' + (p.img ? "" : " hidden") + ">" +
        '<div style="flex:1"><input class="text-input" id="q_img" value="' + esc(p.img) + '" placeholder="assets/portfolio/nama.jpg">' +
        '<div class="btn-row" style="margin-top:var(--sm)"><label class="icon-btn" style="cursor:pointer">Unggah Gambar<input type="file" id="q_img_file" accept="image/*" hidden></label></div>' +
        '<div class="help">Unggah file atau ketik path (assets/portfolio/…).</div></div></div></div>' +
      field("Deskripsi", '<textarea class="text-area" id="q_desc" rows="5">' + esc(p.desc) + "</textarea>", true) +
      "</div>";
    openModal(isNew ? "Tambah Proyek" : "Edit Proyek", body, '<button class="btn btn-tertiary" id="q_cancel">Batal</button><button class="btn btn-primary" id="q_save">Simpan</button>');
    $("#q_cancel").addEventListener("click", closeModal);
    $("#q_img").addEventListener("change", function () { var v = val("q_img"); var pv = $("#q_img_prev"); if (v) { pv.src = "/" + v; pv.hidden = false; } else pv.hidden = true; });
    $("#q_img_file").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      toast("Mengunggah…");
      uploadImage(f, "portfolio").then(function (r) { $("#q_img").value = r.path; var pv = $("#q_img_prev"); pv.src = "/" + r.path; pv.hidden = false; toast("Gambar diunggah: " + r.path); }).catch(function (err) { toast(err.message, true); });
    });
    $("#q_save").addEventListener("click", function () {
      var obj = {
        title: val("q_title"), cat: val("q_cat"), type: val("q_type"),
        cats: splitList(val("q_cats")), langs: splitList(val("q_langs")),
        price: val("q_price"), url: val("q_url"), img: val("q_img"), desc: val("q_desc")
      };
      if (!obj.title) { toast("Judul wajib diisi", true); return; }
      var req = isNew ? api("POST", "/api/portfolio", obj) : api("PUT", "/api/portfolio/" + encodeURIComponent(p.id), obj);
      req.then(closeModal).then(loadData).then(function () { renderPortfolio(); toast(isNew ? "Proyek ditambahkan" : "Perubahan disimpan"); }).catch(function (e) { toast(e.message, true); });
    });
  }
  function catsOptions() {
    var set = {}; DATA.portfolio.forEach(function (p) { if (p.cat) set[p.cat] = 1; (p.cats || []).forEach(function (c) { if (c) set[c] = 1; }); });
    return Object.keys(set).map(function (c) { return '<option value="' + esc(c) + '">'; }).join("");
  }
  function splitList(s) { return String(s || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean); }
  function delPort(id) {
    var p = findPort(id); if (!p) return;
    if (!confirm('Hapus proyek "' + p.title + '"?')) return;
    api("DELETE", "/api/portfolio/" + encodeURIComponent(id)).then(loadData).then(function () { renderPortfolio(); toast("Proyek dihapus"); }).catch(function (e) { toast(e.message, true); });
  }
  function uploadImage(file, folder) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () {
        var b64 = String(fr.result).split(",")[1] || "";
        fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ folder: folder, name: file.name, dataBase64: b64 }) })
          .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "gagal unggah"); return j; }); })
          .then(resolve).catch(reject);
      };
      fr.onerror = function () { reject(new Error("gagal membaca file")); };
      fr.readAsDataURL(file);
    });
  }

  /* ================= CONTENT (site) ================= */
  function renderContent() {
    setActions('<button class="btn btn-primary" id="saveSite">Simpan Konten</button>');
    var s = DATA.site || {};
    var b = s.brand || {}, c = s.contact || {}, so = s.social || {}, cl = s.clientArea || {}, f = s.footer || {}, seo = s.seo || {};
    var html = "";
    html += '<div class="panel"><div class="panel-body">';
    // Brand
    html += '<fieldset class="fieldset"><legend>Identitas</legend><div class="form-grid">' +
      cfield("brand.name", "Nama (bagian 1)", b.name) + cfield("brand.accent", "Nama (aksen)", b.accent) + cfield("brand.sub", "Subjudul", b.sub) + "</div></fieldset>";
    // Kontak
    html += '<fieldset class="fieldset"><legend>Kontak</legend><div class="form-grid">' +
      cfield("contact.address", "Alamat", c.address, true) + cfield("contact.phone", "Telepon (tampilan)", c.phone) + cfield("contact.phoneHref", "Telepon (href)", c.phoneHref) + cfield("contact.email", "Email", c.email) + "</div></fieldset>";
    // Sosial
    html += '<fieldset class="fieldset"><legend>Sosial Media</legend><div class="form-grid">' +
      cfield("social.facebook", "Facebook", so.facebook) + cfield("social.twitter", "Twitter / X", so.twitter) + cfield("social.instagram", "Instagram", so.instagram) + cfield("social.linkedin", "LinkedIn", so.linkedin) + "</div></fieldset>";
    // Client area
    html += '<fieldset class="fieldset"><legend>Tombol Client Area</legend><div class="form-grid">' +
      cfield("clientArea.label", "Label", cl.label) + cfield("clientArea.href", "URL", cl.href) + "</div></fieldset>";
    // SEO
    html += '<fieldset class="fieldset"><legend>SEO Default</legend><div class="form-grid">' +
      cfield("seo.defaultTitle", "Judul default", seo.defaultTitle, true) + cfield("seo.defaultDescription", "Deskripsi default", seo.defaultDescription, true) + "</div></fieldset>";
    // Footer
    html += '<fieldset class="fieldset"><legend>Footer</legend>' +
      field("Tentang (footer)", '<textarea class="text-area" data-path="footer.about" rows="3">' + esc(f.about) + "</textarea>", true) +
      '<div style="height:var(--md)"></div>' +
      field("Teks hak cipta", '<input class="text-input" data-path="footer.bottom" value="' + esc(f.bottom) + '">', true) +
      '<div style="height:var(--md)"></div><label class="label">Kolom Footer</label><div id="colsWrap">' + colsHtml(f.columns || []) + '</div><button class="icon-btn" id="addCol" type="button">+ Tambah Kolom</button>' +
      '<div style="height:var(--lg)"></div><label class="label">Tautan Legal</label><div id="legalWrap">' + legalHtml(f.legal || []) + '</div><button class="icon-btn" id="addLegal" type="button">+ Tambah Tautan</button>' +
      "</fieldset>";
    html += "</div></div>";
    // Password
    html += '<div class="panel"><div class="panel-head"><h2>Keamanan</h2></div><div class="panel-body"><div class="form-grid">' +
      '<div class="field"><label class="label">Password Baru</label><input class="text-input" id="cfg_pass" type="password" autocomplete="new-password"><div class="help">Ganti password dasbor. Anda akan diminta masuk ulang.</div></div>' +
      '<div class="field" style="align-self:end"><button class="btn btn-tertiary" id="savePass" type="button">Ganti Password</button></div>' +
      "</div></div></div>";

    $("#view").innerHTML = html;
    $("#saveSite").addEventListener("click", saveSite);
    $("#savePass").addEventListener("click", savePass);
    wireNested();
  }
  function cfield(path, label, value, span) { return '<div class="field' + (span ? " span-2" : "") + '"><label class="label">' + label + '</label><input class="text-input" data-path="' + path + '" value="' + esc(value) + '"></div>'; }
  function colsHtml(cols) {
    return cols.map(function (col) {
      var links = (col.links || []).map(function (l) {
        return '<div class="link-row"><input class="text-input lk-label" value="' + esc(l.label) + '" placeholder="Label"><input class="text-input lk-href" value="' + esc(l.href) + '" placeholder="href"><label class="check-row"><input type="checkbox" class="lk-ext"' + (l.external ? " checked" : "") + '> Eksternal</label><button class="icon-btn danger rm-link" type="button">✕</button></div>';
      }).join("");
      return '<div class="nested-card col-card"><div class="nested-head"><input class="text-input col-title" value="' + esc(col.title) + '" placeholder="Judul kolom"><button class="icon-btn danger rm-col" type="button">Hapus Kolom</button></div><div class="links-wrap">' + links + '</div><button class="icon-btn add-link" type="button">+ Tambah Link</button></div>';
    }).join("");
  }
  function legalHtml(legal) {
    return legal.map(function (l) {
      return '<div class="link-row legal-row"><input class="text-input lg-label" value="' + esc(l.label) + '" placeholder="Label"><input class="text-input lg-href" value="' + esc(l.href) + '" placeholder="href"><button class="icon-btn danger rm-legal" type="button">✕</button></div>';
    }).join("");
  }
  function linkRowHtml() { return '<div class="link-row"><input class="text-input lk-label" placeholder="Label"><input class="text-input lk-href" placeholder="href"><label class="check-row"><input type="checkbox" class="lk-ext"> Eksternal</label><button class="icon-btn danger rm-link" type="button">✕</button></div>'; }
  function wireNested() {
    $("#view").addEventListener("click", function (e) {
      var t = e.target;
      if (t.classList.contains("rm-link")) t.closest(".link-row").remove();
      else if (t.classList.contains("add-link")) t.previousElementSibling.insertAdjacentHTML("beforeend", linkRowHtml());
      else if (t.classList.contains("rm-col")) t.closest(".col-card").remove();
      else if (t.classList.contains("rm-legal")) t.closest(".legal-row").remove();
      else if (t.id === "addCol") $("#colsWrap").insertAdjacentHTML("beforeend", '<div class="nested-card col-card"><div class="nested-head"><input class="text-input col-title" placeholder="Judul kolom"><button class="icon-btn danger rm-col" type="button">Hapus Kolom</button></div><div class="links-wrap"></div><button class="icon-btn add-link" type="button">+ Tambah Link</button></div>');
      else if (t.id === "addLegal") $("#legalWrap").insertAdjacentHTML("beforeend", '<div class="link-row legal-row"><input class="text-input lg-label" placeholder="Label"><input class="text-input lg-href" placeholder="href"><button class="icon-btn danger rm-legal" type="button">✕</button></div>');
    });
  }
  function saveSite() {
    var out = deep(DATA.site);
    $$("[data-path]", $("#view")).forEach(function (inp) { setPath(out, inp.getAttribute("data-path"), inp.value); });
    // columns
    out.footer = out.footer || {};
    out.footer.columns = $$("#colsWrap .col-card").map(function (card) {
      return { title: $(".col-title", card).value, links: $$(".link-row", card).map(function (r) { return { label: $(".lk-label", r).value, href: $(".lk-href", r).value, external: $(".lk-ext", r).checked }; }) };
    });
    out.footer.legal = $$("#legalWrap .legal-row").map(function (r) { return { label: $(".lg-label", r).value, href: $(".lg-href", r).value }; });
    api("PUT", "/api/site", out).then(loadData).then(function () { toast("Konten situs disimpan"); }).catch(function (e) { toast(e.message, true); });
  }
  function savePass() {
    var p = val("cfg_pass"); if (!p) { toast("Password kosong", true); return; }
    api("PUT", "/api/config", { adminPassword: p }).then(function () { token = p; localStorage.setItem(TOKEN_KEY, p); toast("Password diganti"); }).catch(function (e) { toast(e.message, true); });
  }

  /* ---------- init ---------- */
  function boot() {
    $("#loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var err = $("#loginError"); err.hidden = true;
      fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: val("loginPass") }) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Gagal masuk"); return j; }); })
        .then(function (j) { token = j.token; localStorage.setItem(TOKEN_KEY, token); $("#loginPass").value = ""; return loadData(); })
        .then(function () { showApp(); render(); })
        .catch(function (ex) { err.textContent = ex.message; err.hidden = false; });
    });
    $("#logoutBtn").addEventListener("click", logout);
    window.addEventListener("hashchange", render);
    if (token) { loadData().then(function () { showApp(); render(); }).catch(function () { showLogin(); }); }
    else showLogin();
  }
  boot();
})();
