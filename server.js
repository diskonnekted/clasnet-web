/* ============================================================
   Clasnet — server (static preview + CMS API, Node, no deps)
   Jalankan: node server.js   →  http://localhost:8080/
   Dasbor CMS:                  http://localhost:8080/admin/
   ------------------------------------------------------------
   • Static file server (MIME benar + clean-URL .html)
   • REST API /api/* — CRUD: site, menu, pages, portfolio + upload
   • Data JSON di /data (TIDAK disajikan publik). Setiap tulis
     men-generate ulang file publik sinkron:
       js/content.js        (site + menu  → layout.js)
       js/portfolio-data.js (portfolio    → portofolio.html)
       js/pages.js          (pages publik → page.html)
   • Auth: header x-admin-token == password.
     Default 'clasnet' — ubah via data/config.json / env ADMIN_PASSWORD.
   ============================================================ */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;
const HOST = "127.0.0.1";
const DATA_DIR = path.join(ROOT, "data");
const BACKUP_DIR = path.join(DATA_DIR, "backup");
const JS_DIR = path.join(ROOT, "js");
const ASSETS_DIR = path.join(ROOT, "assets");
const MAX_BODY = 8 * 1024 * 1024; // 8MB (cukup untuk upload gambar base64)

const MIME = {
  ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".webp": "image/webp",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8",
};

/* ============================ util ============================ */
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function readJson(file, fb) { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { return fb; } }
function writeJson(file, obj) { const tmp = file + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), "utf8"); fs.renameSync(tmp, file); }
function backup(file) { try { if (fs.existsSync(file)) { ensureDir(BACKUP_DIR); fs.copyFileSync(file, path.join(BACKUP_DIR, path.basename(file) + "." + Date.now() + ".bak")); } } catch (e) {} }
function send(res, code, headers, body) { res.writeHead(code, headers); res.end(body); }
function sendJson(res, code, obj) { res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(JSON.stringify(obj)); }
function readBody(req, cb) {
  let size = 0; const chunks = [];
  req.on("data", (c) => { size += c.length; if (size > MAX_BODY) { req.destroy(); return; } chunks.push(c); });
  req.on("end", () => { if (size > MAX_BODY) return cb(new Error("body too large")); cb(null, Buffer.concat(chunks).toString("utf8")); });
  req.on("error", cb);
}
function parseJson(body) { try { return JSON.parse(body); } catch (e) { return null; } }

/* ============================ static ============================ */
function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-store, must-revalidate" });
  fs.createReadStream(filePath).pipe(res);
}
function serveStatic(urlPath, res) {
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const resolved = path.resolve(ROOT, "." + urlPath);
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) return send(res, 403, { "Content-Type": "text/plain" }, "Forbidden");
  fs.stat(resolved, (err, stat) => {
    if (!err && stat.isFile()) return serveFile(resolved, res);
    if (!err && stat.isDirectory()) {
      const idx = path.join(resolved, "index.html");
      return fs.stat(idx, (e2, s2) => { if (!e2 && s2.isFile()) return serveFile(idx, res); return send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "404 Not Found"); });
    }
    fs.stat(resolved + ".html", (e3, s3) => { if (!e3 && s3.isFile()) return serveFile(resolved + ".html", res); return send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "404 Not Found: " + urlPath); });
  });
}

/* ============================ data defaults ============================ */
const F = {
  site: path.join(DATA_DIR, "site.json"),
  menu: path.join(DATA_DIR, "menu.json"),
  pages: path.join(DATA_DIR, "pages.json"),
  portfolio: path.join(DATA_DIR, "portfolio.json"),
  config: path.join(DATA_DIR, "config.json"),
};

function defaultSite() {
  return {
    brand: { name: "CLAS", accent: "NET", sub: "Software House" },
    contact: {
      address: "Jl. Seruling Mas No.32 Wangon, Banjarnegara, Jawa Tengah",
      phone: "+62 851-1704-1846", phoneHref: "tel:+6285117041846",
      email: "info@clasnet.co.id",
    },
    social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
    clientArea: { label: "Client Area", href: "https://billing.clasnet.co.id/login" },
    footer: {
      about: "Perusahaan pengembangan IT yang berkomitmen memberikan solusi teknologi informasi terbaik untuk instansi, desa, UMKM, dan sekolah di seluruh Indonesia.",
      columns: [
        { title: "Program", links: [
          { label: "e-Government", href: "program.html" }, { label: "Desa Pintar", href: "program.html" },
          { label: "UMKM Mandiri", href: "program.html" }, { label: "Sekolah Unggul", href: "program.html" } ] },
        { title: "Edukasi", links: [
          { label: "Kelas Industri", href: "https://kelasindustri.clasnet.co.id/", external: true },
          { label: "Magang / Internship", href: "https://internship.clasnet.id/", external: true },
          { label: "PKL", href: "https://prakerin.clasnet.id/", external: true },
          { label: "Unison Academy", href: "https://academy.unison.id/", external: true } ] },
        { title: "Produk", links: [
          { label: "Paket Harga", href: "produk.html" }, { label: "CCTV", href: "https://cctv.clasnet.id/harga-paket-4-camera/", external: true },
          { label: "Permintaan Penawaran", href: "produk.html" }, { label: "Client Area", href: "https://billing.clasnet.co.id/login", external: true } ] },
        { title: "Perusahaan", links: [
          { label: "Tentang Kami", href: "profil.html" }, { label: "Portofolio", href: "portofolio.html" },
          { label: "Anggota Tim", href: "profil.html#tim" }, { label: "Kontak", href: "kontak.html" } ] },
      ],
      bottom: "© Clasnet Group. All Rights Reserved. Dibangun dengan Carbon Design System.",
      legal: [ { label: "Syarat & Ketentuan", href: "#" }, { label: "Kebijakan Privasi", href: "#" } ],
    },
    seo: { defaultTitle: "Clasnet Group — Software House & Developer IT", defaultDescription: "Perusahaan pengembangan IT untuk instansi, desa, UMKM, dan sekolah di seluruh Indonesia." },
  };
}
function defaultMenu() {
  return { items: [
    { id: "home", key: "home", label: "Beranda", href: "index.html", order: 1, visible: true },
    { id: "profil", key: "profil", label: "Profil", href: "profil.html", order: 2, visible: true },
    { id: "program", key: "program", label: "Program", href: "program.html", order: 3, visible: true },
    { id: "produk", key: "produk", label: "Produk", href: "produk.html", order: 4, visible: true },
    { id: "edukasi", key: "edukasi", label: "Edukasi", href: "edukasi.html", order: 5, visible: true },
    { id: "portofolio", key: "portofolio", label: "Portofolio", href: "portofolio.html", order: 6, visible: true },
    { id: "kontak", key: "kontak", label: "Kontak", href: "kontak.html", order: 7, visible: true },
  ] };
}
function defaultPages() {
  const sys = [
    ["index", "index.html", "Beranda", "Clasnet Group — Software House & Developer IT"],
    ["profil", "profil.html", "Profil Perusahaan", "Tentang Clasnet Group, keunggulan, dan tim"],
    ["program", "program.html", "Program", "Program e-Government, Desa Pintar, UMKM, Sekolah Unggul"],
    ["produk", "produk.html", "Produk & Layanan", "Layanan pengembangan perangkat lunak dan paket harga"],
    ["edukasi", "edukasi.html", "Edukasi", "Kelas Industri, Magang, PKL, dan Academy"],
    ["portofolio", "portofolio.html", "Portofolio", "Portofolio proyek sistem informasi Clasnet Group"],
    ["kontak", "kontak.html", "Kontak", "Hubungi Clasnet Group"],
  ];
  return { items: sys.map((s, i) => ({
    id: s[0], slug: s[0], title: s[2], navLabel: s[2], metaDescription: s[3],
    type: "system", file: s[1], order: i + 1, published: true, bodyHtml: "",
  })) };
}
function seedPortfolio() {
  try {
    const code = fs.readFileSync(path.join(JS_DIR, "portfolio-data.js"), "utf8");
    const fn = new Function(code + "\n;return {P: typeof PORTFOLIO!=='undefined'?PORTFOLIO:[]};");
    const r = fn();
    return { items: Array.isArray(r.P) ? r.P : [] };
  } catch (e) { return { items: [] }; }
}

/* ============================ regenerate public files ============================ */
function regenContent() {
  const site = readJson(F.site, defaultSite());
  const menu = readJson(F.menu, defaultMenu());
  const out = "/* Generated by Clasnet CMS — JANGAN edit manual. */\n" +
    "window.CLASNET_CONTENT = " + JSON.stringify({ site: site, menu: menu.items || [] }, null, 2) + ";\n";
  fs.writeFileSync(path.join(JS_DIR, "content.js"), out, "utf8");
}
function regenPortfolio() {
  const items = (readJson(F.portfolio, { items: [] }).items) || [];
  const out = "/* Generated by Clasnet CMS — data portofolio. JANGAN edit manual. */\n" +
    "var PORTFOLIO = " + JSON.stringify(items, null, 2) + ";\n\n" +
    "var PORTFOLIO_CATEGORIES = (function () {\n" +
    "  var counts = {};\n" +
    "  PORTFOLIO.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });\n" +
    "  return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });\n" +
    "})();\n";
  fs.writeFileSync(path.join(JS_DIR, "portfolio-data.js"), out, "utf8");
}
function regenPages() {
  const items = (readJson(F.pages, defaultPages()).items) || [];
  const pub = items.filter((p) => p.published !== false);
  const out = "/* Generated by Clasnet CMS — data halaman publik. JANGAN edit manual. */\n" +
    "window.CLASNET_PAGES = " + JSON.stringify(pub, null, 2) + ";\n";
  fs.writeFileSync(path.join(JS_DIR, "pages.js"), out, "utf8");
}
function regenAll() { regenContent(); regenPortfolio(); regenPages(); }

function ensureData() {
  ensureDir(DATA_DIR);
  if (!fs.existsSync(F.config)) writeJson(F.config, { adminPassword: process.env.ADMIN_PASSWORD || "clasnet" });
  if (!fs.existsSync(F.site)) writeJson(F.site, defaultSite());
  if (!fs.existsSync(F.menu)) writeJson(F.menu, defaultMenu());
  if (!fs.existsSync(F.pages)) writeJson(F.pages, defaultPages());
  if (!fs.existsSync(F.portfolio)) writeJson(F.portfolio, seedPortfolio());
  regenAll();
}

/* ============================ auth ============================ */
function authorized(req) {
  const cfg = readJson(F.config, { adminPassword: "clasnet" });
  return (req.headers["x-admin-token"] || "") === cfg.adminPassword;
}

/* ============================ CRUD helpers ============================ */
function nextPortfolioId(items) { return items.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1; }

function pagesCrud(req, res, method, id) {
  const store = readJson(F.pages, defaultPages());
  const items = store.items || [];
  if (method === "GET" && !id) return sendJson(res, 200, { items: items });
  if (method === "POST" && !id) return readBody(req, (e, body) => {
    if (e) return sendJson(res, 400, { error: "bad body" });
    const v = parseJson(body); if (!v) return sendJson(res, 400, { error: "bad json" });
    const slug = String(v.slug || v.title || "page").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || ("page-" + Date.now());
    if (items.some((p) => p.id === slug)) return sendJson(res, 409, { error: "slug sudah dipakai" });
    const page = Object.assign({ id: slug, slug: slug, title: "", navLabel: "", metaDescription: "", type: "custom", file: null, order: items.length + 1, published: true, bodyHtml: "" }, v, { id: slug, slug: slug, type: "custom", file: null });
    items.push(page); backup(F.pages); writeJson(F.pages, { items: items }); regenPages();
    sendJson(res, 201, { ok: true, item: page });
  });
  if (id && (method === "PUT" || method === "PATCH")) return readBody(req, (e, body) => {
    if (e) return sendJson(res, 400, { error: "bad body" });
    const v = parseJson(body); if (!v) return sendJson(res, 400, { error: "bad json" });
    const i = items.findIndex((p) => p.id === id); if (i < 0) return sendJson(res, 404, { error: "not found" });
    items[i] = Object.assign({}, items[i], v, { id: items[i].id });
    backup(F.pages); writeJson(F.pages, { items: items }); regenPages();
    sendJson(res, 200, { ok: true, item: items[i] });
  });
  if (id && method === "DELETE") {
    const i = items.findIndex((p) => p.id === id); if (i < 0) return sendJson(res, 404, { error: "not found" });
    items.splice(i, 1); backup(F.pages); writeJson(F.pages, { items: items }); regenPages();
    return sendJson(res, 200, { ok: true });
  }
  return sendJson(res, 405, { error: "method not allowed" });
}

function portfolioCrud(req, res, method, id) {
  const store = readJson(F.portfolio, { items: [] });
  const items = store.items || [];
  if (method === "GET" && !id) return sendJson(res, 200, { items: items });
  if (method === "POST" && !id) return readBody(req, (e, body) => {
    if (e) return sendJson(res, 400, { error: "bad body" });
    const v = parseJson(body); if (!v) return sendJson(res, 400, { error: "bad json" });
    const item = Object.assign({ id: nextPortfolioId(items), title: "", cat: "", cats: [], type: "", langs: [], price: "", img: "", url: "", desc: "" }, v);
    item.id = Number(item.id) || nextPortfolioId(items);
    items.push(item); backup(F.portfolio); writeJson(F.portfolio, { items: items }); regenPortfolio();
    sendJson(res, 201, { ok: true, item: item });
  });
  if (id && (method === "PUT" || method === "PATCH")) return readBody(req, (e, body) => {
    if (e) return sendJson(res, 400, { error: "bad body" });
    const v = parseJson(body); if (!v) return sendJson(res, 400, { error: "bad json" });
    const i = items.findIndex((p) => String(p.id) === String(id)); if (i < 0) return sendJson(res, 404, { error: "not found" });
    items[i] = Object.assign({}, items[i], v, { id: items[i].id });
    backup(F.portfolio); writeJson(F.portfolio, { items: items }); regenPortfolio();
    sendJson(res, 200, { ok: true, item: items[i] });
  });
  if (id && method === "DELETE") {
    const i = items.findIndex((p) => String(p.id) === String(id)); if (i < 0) return sendJson(res, 404, { error: "not found" });
    items.splice(i, 1); backup(F.portfolio); writeJson(F.portfolio, { items: items }); regenPortfolio();
    return sendJson(res, 200, { ok: true });
  }
  return sendJson(res, 405, { error: "method not allowed" });
}

function handleUpload(req, res) {
  return readBody(req, (e, body) => {
    if (e) return sendJson(res, 400, { error: "body too large" });
    const v = parseJson(body); if (!v || !v.dataBase64) return sendJson(res, 400, { error: "bad json" });
    const allow = { portfolio: "portfolio", img: "img", crew: "crew" };
    const folder = allow[v.folder]; if (!folder) return sendJson(res, 400, { error: "folder tidak diizinkan" });
    let name = path.basename(String(v.name || "")).replace(/[^a-zA-Z0-9._-]+/g, "_");
    const ext = path.extname(name).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext)) return sendJson(res, 400, { error: "tipe file tidak diizinkan" });
    if (!name) name = "upload-" + Date.now() + ext;
    const dir = path.join(ASSETS_DIR, folder); ensureDir(dir);
    const rel = "assets/" + folder + "/" + name;
    try {
      fs.writeFileSync(path.join(dir, name), Buffer.from(v.dataBase64, "base64"));
      sendJson(res, 201, { ok: true, path: rel });
    } catch (err) { sendJson(res, 500, { error: "gagal menyimpan" }); }
  });
}

/* ============================ API router ============================ */
function handleApi(req, res, urlPath) {
  const parts = urlPath.split("/").filter(Boolean); // ['api', resource, id?]
  const resource = parts[1];
  const id = parts[2] ? decodeURIComponent(parts[2]) : null;
  const method = req.method;

  if (resource === "login" && method === "POST") return readBody(req, (e, body) => {
    const v = e ? null : parseJson(body);
    const cfg = readJson(F.config, { adminPassword: "clasnet" });
    if (v && v.password === cfg.adminPassword) return sendJson(res, 200, { ok: true, token: cfg.adminPassword });
    return sendJson(res, 401, { error: "Password salah" });
  });

  if (!authorized(req)) return sendJson(res, 401, { error: "Tidak terautentikasi. Masuk dulu." });

  if (resource === "data" && method === "GET") return sendJson(res, 200, {
    site: readJson(F.site, defaultSite()),
    menu: (readJson(F.menu, defaultMenu()).items) || [],
    pages: (readJson(F.pages, defaultPages()).items) || [],
    portfolio: (readJson(F.portfolio, { items: [] }).items) || [],
  });

  if (resource === "site" && method === "PUT") return readBody(req, (e, body) => {
    const v = e ? null : parseJson(body); if (!v) return sendJson(res, 400, { error: "bad json" });
    backup(F.site); writeJson(F.site, v); regenContent(); sendJson(res, 200, { ok: true });
  });

  if (resource === "menu" && method === "PUT") return readBody(req, (e, body) => {
    const v = e ? null : parseJson(body); if (!v) return sendJson(res, 400, { error: "bad json" });
    const items = Array.isArray(v) ? v : (v.items || []);
    backup(F.menu); writeJson(F.menu, { items: items }); regenContent(); sendJson(res, 200, { ok: true });
  });

  if (resource === "config" && method === "PUT") return readBody(req, (e, body) => {
    const v = e ? null : parseJson(body); if (!v || !v.adminPassword) return sendJson(res, 400, { error: "adminPassword diperlukan" });
    backup(F.config); writeJson(F.config, { adminPassword: String(v.adminPassword) }); sendJson(res, 200, { ok: true });
  });

  if (resource === "pages") return pagesCrud(req, res, method, id);
  if (resource === "portfolio") return portfolioCrud(req, res, method, id);
  if (resource === "upload" && method === "POST") return handleUpload(req, res);

  return sendJson(res, 404, { error: "endpoint tidak dikenal" });
}

/* ============================ server ============================ */
ensureData();

const server = http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split("?")[0]); }
  catch (e) { return send(res, 400, { "Content-Type": "text/plain" }, "Bad Request"); }

  // API
  if (urlPath === "/api" || urlPath.startsWith("/api/")) return handleApi(req, res, urlPath);

  // /data tidak disajikan publik (berisi config/password)
  if (urlPath === "/data" || urlPath.startsWith("/data/")) return send(res, 403, { "Content-Type": "text/plain" }, "Forbidden");

  // OPTIONS (CORS preflight, untuk kenyamanan dev)
  if (req.method === "OPTIONS") { res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,x-admin-token" }); return res.end(); }

  return serveStatic(urlPath, res);
});

server.listen(PORT, HOST, () => {
  console.log("Clasnet server: http://localhost:" + PORT + "/");
  console.log("Dasbor CMS    : http://localhost:" + PORT + "/admin/  (password default: clasnet)");
});
