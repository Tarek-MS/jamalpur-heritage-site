/* ============================================================
   জামালপুর ঐতিহ্য হাট — editor.js  (এডিট / ছবি আপলোড / প্রকাশ)
   ------------------------------------------------------------
   কীভাবে কাজ করে:
     ১) ফুটারের "অ্যাডমিন" → কোড দিন (script.js-এর SITE.adminPin)
     ২) পণ্য / লেখা / ছবি / ফোন বদলান — পরিবর্তন আগে এই ব্রাউজারে
        "ড্রাফট" হিসেবে জমা হয় (শুধু আপনি দেখেন)
     ৩) "প্রকাশ করুন" ট্যাবে বাটন চাপলে ছবি ও লেখা GitHub-এ চলে যায়
        এবং সবার জন্য ওয়েবসাইট আপডেট হয় (১–২ মিনিট লাগে)
   প্রকাশিত কনটেন্ট থাকে: data/content.json  আর  images/uploads/
   ============================================================ */
"use strict";

const DRAFT_KEY = "jph_draft";
const GH_KEY = "jph_gh";
const CONTENT_URL = "data/content.json";

let draftActive = false;     // অপ্রকাশিত ড্রাফট আছে কি না
let uploadedMap = {};        // এই সেশনে যে ছবি আপলোড হয়েছে (dataURL → পাথ)
let formDraft = null;        // পণ্য এডিট ফর্মের কাজের কপি
let formIsNew = false;

/* ---------- ছোট সাহায্যকারী ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// সাইটের HTML ভেঙে যাওয়া আটকাতে < > " বাদ/বদল
const clean = (s) => String(s == null ? "" : s).replace(/[<>]/g, "").replace(/"/g, "”").trim();
const isData = (s) => typeof s === "string" && s.startsWith("data:");
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

function toIntl(phone) {
  const d = String(phone).replace(/\D/g, "");
  if (d.startsWith("880")) return d;
  if (d.startsWith("0")) return "880" + d.slice(1);
  return d;
}

function normalizeProduct(p) {
  return {
    id: p.id || ("p" + Date.now().toString(36)),
    name: p.name || "",
    altNames: Array.isArray(p.altNames) ? p.altNames : [],
    category: p.category || "food",
    unit: p.unit || "",
    price: p.price === "" || p.price == null ? null : Number(p.price),
    priceMax: p.priceMax === "" || p.priceMax == null ? null : Number(p.priceMax),
    image: p.image || "",
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    short: p.short || "",
    history: p.history || "",
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
  };
}

/** ছবি ছোট করে (সর্বোচ্চ max px) JPEG dataURL বানায় — আপলোড দ্রুত ও হালকা হয় */
function fileToDataURL(file, max = 1200) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth, h = img.naturalHeight;
      const k = Math.min(1, max / Math.max(w, h));
      w = Math.round(w * k); h = Math.round(h * k);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d");
      x.fillStyle = "#fff"; x.fillRect(0, 0, w, h);
      x.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("ছবি পড়া যায়নি")); };
    img.src = url;
  });
}

/* ============================================================
   কনটেন্ট: তোলা (snapshot) ও বসানো (apply)
   ============================================================ */
function snapshot() {
  const texts = {};
  document.querySelectorAll("[data-edit]").forEach((el) => { texts[el.dataset.edit] = el.textContent.trim(); });
  const hero = document.querySelector("[data-hero-img]");
  return {
    version: 1,
    updated: new Date().toISOString(),
    site: { phone: SITE.phone, address: SITE.address, orderForm: SITE.orderForm, formTemplate: SITE.formTemplate },
    texts,
    heroImage: hero ? hero.getAttribute("src") : "",
    products: JSON.parse(JSON.stringify(PRODUCTS)),
  };
}

function applySiteToDOM() {
  document.querySelectorAll('[data-site="tel"]').forEach((a) => { a.href = "tel:+" + SITE.phoneIntl; });
  document.querySelectorAll('[data-site="wa"]').forEach((a) => { a.href = "https://wa.me/" + SITE.phoneIntl; });
  document.querySelectorAll('[data-site="phone-en"]').forEach((e) => { e.textContent = SITE.phone; });
  document.querySelectorAll('[data-site="phone-bn"]').forEach((e) => { e.textContent = toBn(SITE.phone); });
  document.querySelectorAll('[data-site="address"]').forEach((e) => { e.textContent = SITE.address; });
}

function applyContent(c) {
  if (c.site) {
    if (c.site.phone) { SITE.phone = c.site.phone; SITE.phoneIntl = toIntl(c.site.phone); }
    if (c.site.address) SITE.address = c.site.address;
    if ("orderForm" in c.site) SITE.orderForm = c.site.orderForm || "";
    if ("formTemplate" in c.site) SITE.formTemplate = c.site.formTemplate || "";
    applySiteToDOM();
  }
  if (c.texts) {
    Object.keys(c.texts).forEach((k) => {
      const el = document.querySelector('[data-edit="' + k + '"]');
      if (el && c.texts[k]) el.textContent = c.texts[k];
    });
  }
  const hero = document.querySelector("[data-hero-img]");
  if (hero && c.heroImage) hero.src = c.heroImage;
  if (Array.isArray(c.products) && c.products.length) {
    PRODUCTS.splice(0, PRODUCTS.length, ...c.products.map(normalizeProduct));
  }
}

/** পেজ লোডের সময় (script.js থেকে ডাকা হয়) */
async function loadContent() {
  let c = null;
  try {
    const d = localStorage.getItem(DRAFT_KEY);
    if (d) { c = JSON.parse(d); draftActive = true; }
  } catch (e) {}
  if (!c) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3000);
      const r = await fetch(CONTENT_URL + "?_=" + Date.now(), { signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      if (r.ok) c = await r.json();
    } catch (e) { /* ফাইল না থাকলে বা নেট না থাকলে ডিফল্ট কনটেন্টই চলবে */ }
  }
  if (c) applyContent(c);
}

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot()));
    draftActive = true;
  } catch (e) {
    toast("ড্রাফট সেভ হয়নি (জায়গা শেষ) — আগে 'প্রকাশ করুন' দিন");
  }
  updateDraftBar();
}
const saveDraftSoon = debounce(saveDraft, 400);

function refreshSite() {
  renderProducts();
  renderMilaniFeature();
}

function updateDraftBar() {
  const b = $("aDraftBar");
  if (!b) return;
  if (draftActive) {
    b.style.display = "";
    b.innerHTML = "⚠ অপ্রকাশিত পরিবর্তন আছে — শুধু আপনার ব্রাউজারে দেখা যাচ্ছে। সবার জন্য দিতে <b>“প্রকাশ করুন”</b> ট্যাবে যান।";
  } else {
    b.style.display = "none";
  }
}

/* ============================================================
   প্যানেল খোলা ও ট্যাব
   ============================================================ */
function editorOpen() {
  formDraft = null;
  renderProductsTab();
  renderTextsTab();
  renderSiteTab();
  renderPublishTab();
  updateDraftBar();
  showTab("products");
}

function showTab(name) {
  document.querySelectorAll("#aTabs .atab").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".atab-body").forEach((d) => { d.style.display = d.id === "tab-" + name ? "" : "none"; });
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("#aTabs .atab");
  if (b) showTab(b.dataset.tab);
});

/* ============================================================
   ট্যাব ১: পণ্য
   ============================================================ */
function renderProductsTab() {
  const box = $("tab-products");
  const rows = PRODUCTS.map((p, i) => `
    <div class="prow">
      <img src="${esc(p.image)}" alt="">
      <div class="pinfo">
        <b>${esc(p.name)}</b>
        <small>${esc(catLabel(p.category))} · ${esc(priceText(p))}${p.unit ? " / " + esc(p.unit) : ""}</small>
      </div>
      <div class="pbtns">
        <button class="btn btn-ghost btn-sm" title="ওপরে" onclick="pMove(${i},-1)">↑</button>
        <button class="btn btn-ghost btn-sm" title="নিচে" onclick="pMove(${i},1)">↓</button>
        <button class="btn btn-outline btn-sm" onclick="pEdit('${esc(p.id)}')">এডিট</button>
        ${p.id === "milani" ? "" : `<button class="btn btn-danger btn-sm" onclick="pDelete('${esc(p.id)}')">মুছুন</button>`}
      </div>
    </div>`).join("");
  box.innerHTML = `
    <div class="admin-bar">
      <span>মোট ${toBn(PRODUCTS.length)}টি পণ্য</span>
      <button class="btn btn-primary btn-sm" onclick="pNew()">＋ নতুন পণ্য</button>
    </div>
    <div class="plist">${rows}</div>`;
}

function pMove(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= PRODUCTS.length) return;
  [PRODUCTS[i], PRODUCTS[j]] = [PRODUCTS[j], PRODUCTS[i]];
  saveDraft(); refreshSite(); renderProductsTab();
}

function pDelete(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p || !confirm("“" + p.name + "” পণ্যটি মুছে ফেলবেন?")) return;
  PRODUCTS.splice(PRODUCTS.indexOf(p), 1);
  saveDraft(); refreshSite(); renderProductsTab();
}

function pNew() {
  formIsNew = true;
  formDraft = normalizeProduct({ id: "p" + Date.now().toString(36), category: "food", unit: "প্রতি পিস", image: "" });
  renderProductForm();
}

function pEdit(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  formIsNew = false;
  formDraft = JSON.parse(JSON.stringify(p));
  renderProductForm();
}

function renderProductForm() {
  const p = formDraft;
  const catOpts = CATEGORIES.filter((c) => c.key !== "all")
    .map((c) => `<option value="${c.key}" ${p.category === c.key ? "selected" : ""}>${esc(c.label)}</option>`).join("");
  $("tab-products").innerHTML = `
    <h3 class="pf-title">${formIsNew ? "নতুন পণ্য যোগ করুন" : "পণ্য এডিট: " + esc(p.name)}</h3>
    <div class="pf-grid">
      <label class="field"><span>পণ্যের নাম *</span><input id="pf-name" value="${esc(p.name)}"></label>
      <label class="field"><span>প্রচলিত অন্য নাম (কমা দিয়ে আলাদা করুন)</span><input id="pf-alt" value="${esc(p.altNames.join(", "))}"></label>
      <label class="field"><span>ক্যাটাগরি</span><select id="pf-cat">${catOpts}</select></label>
      <label class="field"><span>বিক্রির একক (যেমন প্রতি কেজি)</span><input id="pf-unit" value="${esc(p.unit)}"></label>
      <label class="field"><span>দাম (টাকা) — ফাঁকা রাখলে “যোগাযোগ” দেখাবে</span><input id="pf-price" type="number" min="0" value="${p.price == null ? "" : p.price}"></label>
      <label class="field"><span>সর্বোচ্চ দাম (দামের পরিসর থাকলে, না থাকলে ফাঁকা)</span><input id="pf-pmax" type="number" min="0" value="${p.priceMax == null ? "" : p.priceMax}"></label>
    </div>
    <label class="field"><span>কার্ডে দেখানোর ছোট বিবরণ (১–২ লাইন)</span><textarea id="pf-short" rows="2">${esc(p.short)}</textarea></label>
    <label class="field"><span>ঐতিহ্য / ইতিহাস</span><textarea id="pf-history" rows="5">${esc(p.history)}</textarea></label>
    <label class="field"><span>উপকরণ (প্রতি লাইনে একটি)</span><textarea id="pf-ing" rows="4">${esc(p.ingredients.join("\n"))}</textarea></label>
    <div id="pf-images"></div>
    <p class="form-error" id="pf-err"></p>
    <div class="pf-actions">
      <button class="btn btn-primary" onclick="pSave()">সংরক্ষণ করুন</button>
      <button class="btn btn-ghost" onclick="pCancel()">বাতিল</button>
    </div>`;
  renderPfImages();
}

function renderPfImages() {
  const p = formDraft;
  const gal = p.gallery.map((src, i) => `
    <div class="gthumb"><img src="${esc(src)}" alt=""><button type="button" title="সরান" onclick="pfRemoveGal(${i})">✕</button></div>`).join("");
  $("pf-images").innerHTML = `
    <div class="pf-imgblock">
      <span class="lbl">মূল ছবি (কার্ডে দেখায়)</span>
      <div class="pf-main">
        ${p.image ? `<img src="${esc(p.image)}" alt="">` : `<div class="noimg">ছবি নেই</div>`}
        <label class="btn btn-outline btn-sm filebtn">ছবি বাছাই করুন
          <input type="file" accept="image/*" id="pf-main-file" hidden>
        </label>
      </div>
    </div>
    <div class="pf-imgblock">
      <span class="lbl">অতিরিক্ত ছবি (বিস্তারিত পপআপে দেখায়)${formDraft.id === "milani" ? " — প্রথম ছবিটি মিল্লি সেকশনের বড় ব্যানার" : ""}</span>
      <div class="gal-row">${gal}</div>
      <label class="btn btn-outline btn-sm filebtn">＋ আরও ছবি যোগ করুন
        <input type="file" accept="image/*" multiple id="pf-gal-file" hidden>
      </label>
    </div>`;
  $("pf-main-file").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { formDraft.image = await fileToDataURL(f); keepTyped(); renderPfImages(); }
    catch (err) { toast(err.message); }
  };
  $("pf-gal-file").onchange = async (e) => {
    for (const f of e.target.files) {
      try { formDraft.gallery.push(await fileToDataURL(f)); } catch (err) { toast(err.message); }
    }
    keepTyped(); renderPfImages();
  };
}

function pfRemoveGal(i) { keepTyped(); formDraft.gallery.splice(i, 1); renderPfImages(); }

/** ছবি বদলানোর আগে ফর্মে লেখা তথ্য formDraft-এ রেখে দেওয়া */
function keepTyped() {
  const g = (id) => ($(id) ? $(id).value : "");
  const p = formDraft;
  p.name = g("pf-name"); p.altNames = g("pf-alt").split(/[,،]/).map((x) => x.trim()).filter(Boolean);
  p.category = g("pf-cat") || p.category; p.unit = g("pf-unit");
  p.price = g("pf-price"); p.priceMax = g("pf-pmax");
  p.short = g("pf-short"); p.history = g("pf-history");
  p.ingredients = g("pf-ing").split("\n").map((x) => x.trim()).filter(Boolean);
}

function pSave() {
  keepTyped();
  const p = formDraft;
  const err = $("pf-err");
  if (clean(p.name).length < 2) { err.textContent = "পণ্যের নাম লিখুন।"; return; }
  if (!p.image) { err.textContent = "একটি মূল ছবি দিন।"; return; }
  const out = normalizeProduct({
    ...p,
    name: clean(p.name),
    altNames: p.altNames.map(clean).filter(Boolean),
    unit: clean(p.unit),
    short: clean(p.short),
    history: clean(p.history),
    ingredients: p.ingredients.map(clean).filter(Boolean),
  });
  if (out.priceMax != null && out.price != null && out.priceMax <= out.price) out.priceMax = null;
  if (formIsNew) PRODUCTS.push(out);
  else { const i = PRODUCTS.findIndex((x) => x.id === out.id); if (i >= 0) PRODUCTS[i] = out; }
  formDraft = null;
  saveDraft(); refreshSite(); renderProductsTab();
  toast("সংরক্ষিত — সবার জন্য দিতে “প্রকাশ করুন” চাপুন");
}

function pCancel() { formDraft = null; renderProductsTab(); }

/* ============================================================
   ট্যাব ২: পেজের লেখা ও হিরো ছবি
   ============================================================ */
function renderTextsTab() {
  const hero = document.querySelector("[data-hero-img]");
  const fields = [...document.querySelectorAll("[data-edit]")].map((el) => {
    const v = el.textContent.trim();
    const long = v.length > 70;
    return `<label class="field"><span>${esc(el.dataset.label || el.dataset.edit)}</span>
      ${long ? `<textarea rows="3" data-key="${esc(el.dataset.edit)}">${esc(v)}</textarea>` : `<input data-key="${esc(el.dataset.edit)}" value="${esc(v)}">`}</label>`;
  }).join("");
  $("tab-texts").innerHTML = `
    <div class="pf-imgblock">
      <span class="lbl">হিরো (প্রথম পাতার বড়) ছবি</span>
      <div class="pf-main">
        ${hero ? `<img id="heroPrev" src="${esc(hero.getAttribute("src"))}" alt="">` : ""}
        <label class="btn btn-outline btn-sm filebtn">ছবি বদলান
          <input type="file" accept="image/*" id="hero-file" hidden>
        </label>
      </div>
    </div>
    <div class="texts-grid">${fields}</div>
    <p class="form-hint">লেখা বদলালেই সাইটে সঙ্গে সঙ্গে দেখা যায়। সবার জন্য দিতে “প্রকাশ করুন” ট্যাবে যান।</p>`;
  $("hero-file").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const d = await fileToDataURL(f, 1800);
      document.querySelector("[data-hero-img]").src = d;
      $("heroPrev").src = d;
      saveDraft();
    } catch (err) { toast(err.message); }
  };
}
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.key && t.closest("#tab-texts")) {
    const el = document.querySelector('[data-edit="' + t.dataset.key + '"]');
    if (el) { el.textContent = clean(t.value); saveDraftSoon(); }
  }
});

/* ============================================================
   ট্যাব ৩: যোগাযোগ ও অর্ডার ফর্ম লিংক
   ============================================================ */
function renderSiteTab() {
  $("tab-site").innerHTML = `
    <label class="field"><span>ফোন / হোয়াটসঅ্যাপ নম্বর</span><input id="st-phone" inputmode="tel" value="${esc(SITE.phone)}"></label>
    <label class="field"><span>ঠিকানা</span><input id="st-address" value="${esc(SITE.address)}"></label>
    <label class="field"><span>গুগল ফর্মের লিংক (পুরো …/viewform লিংক দিন — forms.gle ছোট লিংক পপআপে এমবেড হয় না, নতুন ট্যাবে খোলে)</span><input id="st-form" value="${esc(SITE.orderForm || "")}"></label>
    <label class="field"><span>(ঐচ্ছিক) প্রি-ফিলড লিংক — ফর্মে ক্রেতার তথ্য নিজে থেকে বসাতে</span><textarea id="st-tpl" rows="3" placeholder="https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.111=NAME&entry.222=PHONE...">${esc(SITE.formTemplate || "")}</textarea></label>
    <details class="tpl-help"><summary>প্রি-ফিলড লিংক কীভাবে বানাবেন?</summary>
      <ol>
        <li>গুগল ফর্ম এডিটরে ওপরে ⋮ (তিন ডট) → <b>Get pre-filled link</b></li>
        <li>প্রতিটি প্রশ্নে এই শব্দগুলো লিখুন: <b>NAME, PHONE, ADDRESS, PRODUCT, QTY, TOTAL, ORDERNO, NOTE</b> (যে প্রশ্ন আছে শুধু সেগুলো)</li>
        <li><b>Get link</b> → <b>Copy link</b> করে এখানে বসান</li>
      </ol>
      ক্রেতা অর্ডার দিলে ওই শব্দের জায়গায় তার আসল তথ্য ও অর্ডার নম্বর বসে যাবে। ফাঁকা রাখলে ওপরের সাধারণ লিংক খুলবে।
    </details>
    <p class="form-hint">ক্রেতা আগে নাম/মোবাইল/ঠিকানা দেবে → গুগল ফর্ম খুলবে → ফর্ম জমা দিয়ে ফিরে “রসিদ নিন” চাপলে রসিদ পাবে। দুটো লিংকই ফাঁকা থাকলে সরাসরি রসিদ দেবে।</p>`;
  const upd = () => {
    const ph = $("st-phone").value.trim();
    if (/^\+?\d[\d\s-]{8,}$/.test(ph)) { SITE.phone = ph; SITE.phoneIntl = toIntl(ph); }
    SITE.address = clean($("st-address").value) || SITE.address;
    SITE.orderForm = $("st-form").value.trim();
    SITE.formTemplate = $("st-tpl").value.trim();
    applySiteToDOM(); saveDraftSoon();
  };
  ["st-phone", "st-address", "st-form", "st-tpl"].forEach((id) => $(id).addEventListener("input", upd));
}

/* ============================================================
   ট্যাব ৪: প্রকাশ (GitHub-এ পাঠানো)
   ============================================================ */
function loadGh() { try { return JSON.parse(localStorage.getItem(GH_KEY)) || {}; } catch (e) { return {}; } }

function renderPublishTab() {
  const g = loadGh();
  $("tab-publish").innerHTML = `
    <p class="pub-note">এখানে “প্রকাশ করুন” চাপলে আপনার সব পরিবর্তন ও নতুন ছবি আপনার GitHub রিপোজিটরিতে চলে যাবে, আর ১–২ মিনিট পর ওয়েবসাইটে সবাই দেখতে পাবে।</p>
    <div class="pf-grid">
      <label class="field"><span>GitHub ইউজারনেম</span><input id="gh-owner" value="${esc(g.owner || "")}" placeholder="যেমন rahim123"></label>
      <label class="field"><span>রিপোজিটরির নাম</span><input id="gh-repo" value="${esc(g.repo || "")}" placeholder="যেমন jamalpur-heritage"></label>
      <label class="field"><span>ব্রাঞ্চ</span><input id="gh-branch" value="${esc(g.branch || "main")}"></label>
      <label class="field"><span>GitHub টোকেন</span><input id="gh-token" type="password" value="${esc(g.token || "")}" placeholder="github_pat_..."></label>
    </div>
    <p class="form-hint" style="text-align:left">টোকেন শুধু এই ব্রাউজারে জমা থাকে। কাউকে দেবেন না, অন্যের কম্পিউটারে সেভ করবেন না।</p>
    <div class="pf-actions">
      <button class="btn btn-primary" id="pubBtn" onclick="publishSite()">🚀 প্রকাশ করুন</button>
      <button class="btn btn-outline btn-sm" onclick="downloadBackup()">ব্যাকআপ (JSON) ডাউনলোড</button>
      <button class="btn btn-ghost btn-sm" onclick="discardDraft()">ড্রাফট বাতিল</button>
      <button class="btn btn-ghost btn-sm" onclick="clearGh()">টোকেন মুছুন</button>
    </div>
    <pre class="pub-log" id="pubLog"></pre>`;
}

function pubLog(msg, append) {
  const l = $("pubLog"); if (!l) return;
  l.style.display = "block";
  l.textContent = append ? l.textContent + "\n" + msg : msg;
}

function clearGh() { localStorage.removeItem(GH_KEY); renderPublishTab(); toast("টোকেন মুছে ফেলা হয়েছে"); }

function discardDraft() {
  if (!confirm("ড্রাফটের সব অপ্রকাশিত পরিবর্তন মুছে প্রকাশিত অবস্থায় ফিরবেন?")) return;
  localStorage.removeItem(DRAFT_KEY);
  location.reload();
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "content-backup.json"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = ""; bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

async function ghPut(gh, path, b64, message) {
  const url = `https://api.github.com/repos/${encodeURIComponent(gh.owner)}/${encodeURIComponent(gh.repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const headers = { Authorization: "Bearer " + gh.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  let sha;
  const g = await fetch(url + "?ref=" + encodeURIComponent(gh.branch), { headers, cache: "no-store" });
  if (g.ok) sha = (await g.json()).sha;
  else if (g.status === 401 || g.status === 403) throw new Error("টোকেন ঠিক নয় বা অনুমতি নেই (Contents → Read and write দিতে হবে)");
  else if (g.status !== 404) throw new Error("GitHub সমস্যা: " + g.status);
  const body = { message, content: b64, branch: gh.branch };
  if (sha) body.sha = sha;
  const r = await fetch(url, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) {
    if (r.status === 404) throw new Error("রিপোজিটরি পাওয়া যায়নি — ইউজারনেম, রিপোর নাম ও টোকেনের অ্যাক্সেস মিলিয়ে দেখুন");
    if (r.status === 401 || r.status === 403) throw new Error("টোকেনের লেখার অনুমতি নেই");
    throw new Error("আপলোড ব্যর্থ: " + r.status);
  }
}

async function publishSite() {
  const gh = {
    owner: $("gh-owner").value.trim(), repo: $("gh-repo").value.trim(),
    branch: $("gh-branch").value.trim() || "main", token: $("gh-token").value.trim(),
  };
  if (!gh.owner || !gh.repo || !gh.token) { pubLog("⚠ ইউজারনেম, রিপোজিটরির নাম ও টোকেন তিনটিই দিন।"); return; }
  try { localStorage.setItem(GH_KEY, JSON.stringify(gh)); } catch (e) {}

  const btn = $("pubBtn"); btn.disabled = true;
  try {
    pubLog("শুরু হচ্ছে…");
    const snap = snapshot();
    const imgs = new Set();
    snap.products.forEach((p) => { if (isData(p.image)) imgs.add(p.image); (p.gallery || []).forEach((g) => { if (isData(g)) imgs.add(g); }); });
    if (isData(snap.heroImage)) imgs.add(snap.heroImage);

    let n = 0;
    for (const d of imgs) {
      n++;
      if (uploadedMap[d]) continue;
      const path = `images/uploads/${Date.now().toString(36)}-${n}-${Math.random().toString(36).slice(2, 6)}.jpg`;
      pubLog(`ছবি আপলোড হচ্ছে (${n}/${imgs.size})…`, true);
      await ghPut(gh, path, d.split(",")[1], "Upload image");
      uploadedMap[d] = path;
    }
    const sub = (s) => (isData(s) ? uploadedMap[s] : s);
    snap.products.forEach((p) => { p.image = sub(p.image); p.gallery = (p.gallery || []).map(sub); });
    snap.heroImage = sub(snap.heroImage);

    pubLog("কনটেন্ট ফাইল সেভ হচ্ছে…", true);
    await ghPut(gh, CONTENT_URL, b64utf8(JSON.stringify(snap, null, 2)), "Update site content");

    localStorage.removeItem(DRAFT_KEY);
    draftActive = false; updateDraftBar();
    pubLog("✅ প্রকাশ হয়েছে! GitHub Pages আপডেট হতে ১–২ মিনিট লাগে, তারপর পেজ রিফ্রেশ করুন।", true);
    toast("প্রকাশ হয়েছে");
  } catch (e) {
    pubLog("❌ " + (e && e.message ? e.message : "কিছু একটা ভুল হয়েছে") + "\nআপনার পরিবর্তন ড্রাফটে নিরাপদ আছে — ঠিক করে আবার চেষ্টা করুন।", true);
  } finally {
    btn.disabled = false;
  }
}
