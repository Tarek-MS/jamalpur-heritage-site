/* ============================================================
   জামালপুর ঐতিহ্য হাট — script.js
   ------------------------------------------------------------
   এই ফাইলে ওয়েবসাইটের সব "কাজ" নিয়ন্ত্রিত হয়:
     ১) পণ্যের ডাটা দেখানো (কার্ড + বিস্তারিত) — কোনো দাম নেই
     ২) ক্যাটাগরি (সেকশন) ফিল্টার
     ৩) প্রি-অর্ডার পপআপ (ফোন নম্বর + গুগল ফর্ম নতুন ট্যাবে)
     ৪) ইন্টারেস্টেড ফর্ম (নাম, মোবাইল বাধ্যতামূলক; ছাত্র আইডি ঐচ্ছিক; পরিমাণ)
     ৫) আগ্রহের রসিদ — ছবি (PNG) হিসেবে ডাউনলোড + হোয়াটসঅ্যাপ
     ★ ভাষা বদল: ন্যাভবারে "বাংলা | English" বাটন — ইংরেজি বেছে নিলে
       মেনু, বাটন, ফর্ম, রসিদ, ফোন নম্বর ও পণ্যের ইতিহাস-উপকরণ সব
       ইংরেজিতে দেখাবে। পছন্দ localStorage-এ (jph_lang) মনে থাকে।
     ৬) অ্যাডমিন প্যানেল (পিন: ৭৮৯৪৫৬) — সম্পূর্ণ CRUD:
        • পণ্য: যোগ / এডিট / মুছুন / ওপরে-নিচে সাজানো
        • সেকশন (ক্যাটাগরি): যোগ / এডিট / মুছুন
        • হোমপেজের সব লেখা বদলানো + হিরো ছবি আপলোড
        • সাইট সেটিংস: দোকানের নাম, ফোন, ঠিকানা, গুগল ফর্ম
        • আগ্রহীদের তালিকা: হোয়াটসঅ্যাপ / মুছুন / CSV
        • ব্যাকআপ: JSON ডাউনলোড / ফিরিয়ে আনা / রিসেট
   ★ গুরুত্বপূর্ণ: এই সাইটে কোথাও কোনো দাম/মূল্য দেখানো হয় না।
   ★ সব পরিবর্তন ব্রাউজারের localStorage-এ সেভ হয় —
     "ব্যাকআপ" ট্যাব থেকে JSON ফাইল ডাউনলোড করে রাখুন।
   প্রতিটি অংশের শুরুতে বড় কমেন্ট আছে — সহজে খুঁজে পাবেন।
   ============================================================ */

"use strict"; // জাভাস্ক্রিপ্টকে কঠোর নিয়মে চালানো (ভুল ধরা সহজ হয়)

/* ============================================================
   ১) সাইট কনফিগ — অ্যাডমিন প্যানেল থেকেও এগুলো বদলানো যায়
   ============================================================ */
let SITE = {
  nameBn: "জামালপুর ঐতিহ্য হাট",            // দোকানের নাম (বাংলা)
  nameEn: "Jamalpur Heritage Market",        // দোকানের নাম (ইংরেজি)
  phone: "01304542204",                      // ফোন নম্বর (দেশি ফরম্যাট)
  phoneIntl: "8801304542204",                // আন্তর্জাতিক ফরম্যাট (হোয়াটসঅ্যাপে লাগে)
  address: "জামালপুর, ময়মনসিংহ বিভাগ, বাংলাদেশ",
  adminPin: "789456",                        // ★ অ্যাডমিন পিন — সবসময় এটাই থাকবে (অ্যাডমিন প্যানেল থেকে বদলানো যায় না)
  googleFormUrl: "https://docs.google.com/forms/d/1XoYf8avbDvanpdrsLoyz1PZA2KkV8rNjdS9AnLYoIzk/viewform",
  featuredId: "milani",                      // হোমপেজের বিশেষ পণ্য (মিলি অংশ) — অ্যাডমিন থেকে বদলানো যায়
};

/* ============================================================
   ১.১) ভাষা বদল (বাংলা / English)
   ------------------------------------------------------------
   ন্যাভবারে "বাংলা | English" পিল-বাটন আছে। ইংরেজি বেছে নিলে:
     • মেনু, বাটন, ফর্ম লেবেল, রসিদ, টোস্ট — সব UI লেখা ইংরেজিতে
     • পণ্যের নাম, ইতিহাস, উপকরণ, একক — ইংরেজি অনুবাদ দেখায়
       (পণ্যের En ফিল্ডে অনুবাদ না থাকলে বাংলা লেখাই দেখায়)
     • ফোন নম্বর ও তারিখ ইংরেজি অঙ্কে দেখায়
   পছন্দ localStorage-এ সেভ হয় (jph_lang) — পরের ভিজিটেও থাকে।
   ============================================================ */
const LS_LANG = "jph_lang";
let LANG = "bn"; // "bn" = বাংলা (ডিফল্ট), "en" = English

/* UI লেখার অভিধান — প্রতিটি লেখার বাংলা (bn) ও ইংরেজি (en) রূপ।
   HTML-এ data-i18n="কী" দেওয়া ঘরে এই লেখাগুলো বসে (applyLang)। */
const I18N = {
  /* ---- ন্যাভবার / ফুটার ---- */
  navProducts:   { bn: "পণ্য",        en: "Products" },
  navMilani:     { bn: "মিলি",        en: "Milli" },
  navHeritage:   { bn: "আমাদের গল্প", en: "Our Story" },
  navContact:    { bn: "যোগাযোগ",     en: "Contact" },
  adminBtn:      { bn: "অ্যাডমিন",    en: "Admin" },
  /* ---- হিরো ---- */
  heroBtnProducts: { bn: "পণ্য দেখুন",  en: "View Products" },
  heroBtnMilani:   { bn: "মিলির গল্প",  en: "Milli's Story" },
  /* ---- পণ্যের কার্ড ও বাটন ---- */
  detailsBtn:      { bn: "বিস্তারিত",        en: "Details" },
  preOrderShort:   { bn: "প্রি-অর্ডার",       en: "Pre-order" },
  interestedShort: { bn: "ইন্টারেস্টেড",     en: "Interested" },
  preOrderBtn:     { bn: "প্রি-অর্ডার করুন",  en: "Pre-order Now" },
  interestedBtn:   { bn: "ইন্টারেস্টেড",     en: "Interested" },
  callBtn:         { bn: "ফোন করুন",        en: "Call Now" },
  alsoKnown:       { bn: "প্রচলিত নাম:",     en: "Also known as:" },
  emptyCat:        { bn: "এই সেকশনে এখনো কোনো পণ্য নেই।", en: "No products in this section yet." },
  /* ---- প্রি-অর্ডার পপআপ ---- */
  poTitle:  { bn: "প্রি-অর্ডার",                  en: "Pre-order" },
  waMsgBtn: { bn: "হোয়াটসঅ্যাপে মেসেজ করুন",     en: "Message on WhatsApp" },
  gfBtn:    { bn: "গুগল ফর্মে প্রি-অর্ডার করুন", en: "Pre-order via Google Form" },
  extHint:  { bn: "↗ গুগল ফর্মটি ওয়েবসাইটের বাইরে নতুন ট্যাবে খুলবে", en: "↗ The Google Form opens in a new tab, outside this website" },
  /* ---- ইন্টারেস্টেড ফর্ম ---- */
  imTitle:    { bn: "ইন্টারেস্টেড — আগ্রহ জানান", en: "Interested — Express Your Interest" },
  fldName:    { bn: "আপনার নাম",              en: "Your Name" },
  fldPhone:   { bn: "মোবাইল নম্বর",           en: "Mobile Number" },
  fldStudent: { bn: "ছাত্র আইডি (Student ID)", en: "Student ID" },
  optionalTag:{ bn: "ঐচ্ছিক — না দিলেও হবে",   en: "Optional" },
  fldQty:     { bn: "কাঙ্ক্ষিত পরিমাণ",         en: "Desired Quantity" },
  imSubmit:   { bn: "আগ্রহ নিশ্চিত করুন",       en: "Confirm Interest" },
  phName:     { bn: "যেমন: মোঃ রফিকুল ইসলাম",  en: "e.g. Md. Rafiqul Islam" },
  phStudent:  { bn: "যেমন: JPS-2026-045",      en: "e.g. JPS-2026-045" },
  errName:    { bn: "অনুগ্রহ করে আপনার নাম লিখুন।", en: "Please enter your name." },
  errPhone:   { bn: "মোবাইল নম্বর ঠিক নয় — ১১ ডিজিটের নম্বর (01XXXXXXXXX) লিখুন।", en: "Invalid mobile number — please enter an 11-digit number (01XXXXXXXXX)." },
  errStudent: { bn: "ছাত্র আইডি ঠিক নয় — অন্তত ২ অক্ষরের আইডি লিখুন।", en: "Student ID looks too short — please enter at least 2 characters." },
  /* ---- রসিদ ---- */
  rcptNo:      { bn: "রসিদ নং",   en: "Receipt No" },
  rcptDate:    { bn: "তারিখ",     en: "Date" },
  rcptName:    { bn: "নাম",       en: "Name" },
  rcptMobile:  { bn: "মোবাইল",    en: "Mobile" },
  rcptStudent: { bn: "ছাত্র আইডি", en: "Student ID" },
  rcptProduct: { bn: "পণ্য:",     en: "Product:" },
  rcptQty:     { bn: "পরিমাণ:",   en: "Quantity:" },
  phonePrefix: { bn: "ফোন:",      en: "Phone:" },
  rcptThanks:  { bn: "আমাদের ঐতিহ্যে আগ্রহ দেখানোর জন্য ধন্যবাদ!", en: "Thank you for your interest in our heritage!" },
  rcptBtnDl:    { bn: "ছবি হিসেবে ডাউনলোড", en: "Download as Image" },
  rcptBtnWa:    { bn: "হোয়াটসঅ্যাপে পাঠান",  en: "Send via WhatsApp" },
  rcptBtnClose: { bn: "বন্ধ",               en: "Close" },
  rcptHint:  { bn: "প্রথমে \"ছবি হিসেবে ডাউনলোড\" চেপে ছবিটি সেভ করুন, তারপর \"হোয়াটসঅ্যাপে পাঠান\" চেপে ছবিটি মেসেজে সংযুক্ত (attach) করে পাঠান।",
               en: "First tap \"Download as Image\" to save the picture, then tap \"Send via WhatsApp\" and attach the image to your message." },
  rcptNote:  { bn: "✦ এই রসিদ আপনার আগ্রহ নিশ্চিত করার প্রমাণ। ছবিটি ডাউনলোড করে আমাদের হোয়াটসঅ্যাপে ({phone}) পাঠান — আমরা দ্রুত আপনার সাথে যোগাযোগ করব।",
               en: "✦ This receipt confirms your interest. Please download the image and send it to our WhatsApp ({phone}) — we will contact you soon." },
  /* ---- টোস্ট মেসেজ ---- */
  toastInterestOk: { bn: "আগ্রহ নিশ্চিত হয়েছে — রসিদের ছবি ডাউনলোড করুন", en: "Interest confirmed — please download the receipt image" },
  toastReceiptDl:  { bn: "রসিদের ছবি ডাউনলোড হয়েছে — এখন হোয়াটসঅ্যাপে পাঠান", en: "Receipt image downloaded — now send it on WhatsApp" },
  toastStorage:    { bn: "স্টোরেজ ভরে গেছে! ছবি ছোট করুন বা কিছু ছবি বাদ দিন, তারপর আবার সেভ করুন।", en: "Storage is full! Use smaller images or remove some, then save again." },
  /* ---- ইংরেজি মোডে ঠিকানা (SITE.address বাংলায় এডিট করা, তাই ইংরেজি নিজস্ব) ---- */
  addressFixed: { bn: null, en: "Jamalpur, Mymensingh Division, Bangladesh" },
};

/* data-edit (অ্যাডমিন-এডিটেবল) লেখাগুলোর ইংরেজি রূপ।
   বাংলা মোডে এগুলোর জায়গায় TEXTS (অ্যাডমিন বদলানো বাংলা লেখা) বসে,
   ইংরেজি মোডে এই অনুবাদগুলো বসে। null = ইংরেজিতে অপরিবর্তিত থাকবে। */
const EN_EDIT = {
  brandNameBn: null, brandNameEn: null,          // লোগোর দুই নামই সবসময় দেখায়
  heroTaglineEn: null,                            // ইংরেজি মোডে এই লাইন লুকায় (CSS)
  headerPhoneShort: "Call",
  heroBadge: "An online hat of century-old heritage",
  heroTitle: "Jamalpur Heritage Market",
  heroTagline: "The scent of clay, the taste of pithas, the art of hands — all in one address",
  heroFeat1: "Fresh homemade food",
  heroFeat2: "Handicrafts by local artisans",
  heroFeat3: "Locally sourced ingredients",
  milaniOverline: "Special feature",
  milaniTag: "A century-old tradition",
  milaniIngTitle: "Ingredients",
  milaniAlt: "(Milani)",
  productsOverline: "Interest & Pre-order",
  productsTitle: "All Products",
  productsSub: "Tap a product for its story, heritage and ingredients — pre-order it or simply show your interest",
  heritageOverline: "Our Story",
  heritageTitle: "The Heritage of Jamalpur",
  story1Num: "100+",
  story1Title: "Years of heritage",
  story1Text: "From Milli or Pithali to Chanar Payesh — every product carries a century-old living story of love, hospitality and social bonding from the charlands of Jamalpur.",
  story2Num: "500+",
  story2Title: "Women entrepreneurs",
  story2Text: "With the needle and thread of Nakshi Kantha, more than five hundred women entrepreneurs of the district are now self-reliant — every kantha is a living memory embroidered with motherly love.",
  story3Num: "16",
  story3Title: "GI & local products",
  story3Text: "From GI-certified Chanar Payesh and Nakshi Kantha to bell metal, pottery, bamboo-cane and golden-fibre jute goods — everything under one roof.",
  contactOverline: "Contact",
  contactTitle: "Pre-order or Enquiry",
  contactSub: "Call us directly for pre-order, delivery or bulk orders of any product",
  contactPhoneTitle: "Call Us",
  contactWaTitle: "WhatsApp",
  contactAddrTitle: "Address",
  footerText: "Jamalpur Heritage Market — the scent of clay, the taste of pithas, the art of hands",
  detailAltLabel: "Also known as:",
  detailHistoryTitle: "Heritage / History",
  detailIngTitle: "Ingredients",
  preOrderGuide: () => "To pre-order, please contact us directly at " + SITE.phone + ".",
  preOrderGuideSub: "All product details will be shared over the phone and your pre-order will be confirmed.",
  interestGuideTitle: "Are you interested?",
  interestReason1: "I want to buy this product",
  interestReason2: "I want to know more details directly",
  interestReason3: "Not pre-ordering now, but I want to buy on hat days",
  interestGuideSub: "Whatever the reason — let us know through the form below and we will contact you.",
  interestFormHint: "Confirming will create your interest receipt — you can download it as an image and send it to us on WhatsApp.",
};

/** চালু ভাষায় লেখা: T("key") → I18N[key][LANG] (না পেলে বাংলা) */
function T(key) {
  const s = I18N[key];
  if (!s) return key;
  return (s[LANG] != null) ? s[LANG] : s.bn;
}

/** T()-এর সাথে {phone} জায়গায় চালু ভাষার অঙ্কে ফোন নম্বর বসানো */
function Tf(key) { return T(key).replace("{phone}", num(SITE.phone)); }

/** চালু ভাষা অনুযায়ী অঙ্ক: বাংলায় ০১২৩…, ইংরেজিতে 0123… */
function num(v) { return (LANG === "en") ? String(v) : toBn(v); }

/** পণ্যের ঘর চালু ভাষায়: L(p,"history") → ইংরেজি থাকলে p.historyEn, না থাকলে বাংলা */
function L(p, field) {
  if (!p) return "";
  if (LANG === "en") {
    const en = p[field + "En"];
    // খালি স্ট্রিং/খালি অ্যারে হলে বাংলা লেখাতেই ফিরে যাওয়া (ফলব্যাক)
    if (en != null && en !== "" && !(Array.isArray(en) && !en.length)) return en;
  }
  return p[field];
}

/** চালু ভাষায় তারিখ: বাংলায় ১৫ নভেম্বর ২০২৬, দুপুর ০২:৩০ — ইংরেজিতে 15 November 2026, 02:30 PM */
const EN_MONTHS = ["January","February","March","April","May","June",
                   "July","August","September","October","November","December"];
function fmtDate(d) {
  if (LANG === "en") {
    const h24 = d.getHours();
    const part = h24 < 12 ? "AM" : "PM";
    let h = h24 % 12; if (h === 0) h = 12;
    const mm = String(d.getMinutes()).padStart(2, "0");
    return d.getDate() + " " + EN_MONTHS[d.getMonth()] + " " + d.getFullYear() +
           ", " + h + ":" + mm + " " + part;
  }
  return bnDate(d);
}

/** data-edit লেখা চালু ভাষায় (EDT):
    বাংলা মোডে TEXTS (অ্যাডমিনের বদলানো বা ডিফল্ট বাংলা লেখা),
    ইংরেজি মোডে EN_EDIT অনুবাদ। কিছু না পেলে null (HTML লেখা থাকে)। */
function EDT(key) {
  if (LANG === "en") {
    const e = EN_EDIT[key];
    if (e == null) return null;
    return (typeof e === "function") ? e() : e;
  }
  return (TEXTS[key] != null) ? TEXTS[key] : null;
}

/** ভাষা বদলানো — পছন্দ মনে রাখা + সাইটের সব লেখা নতুন করে বসানো */
function setLang(lang) {
  LANG = (lang === "en") ? "en" : "bn";
  try { localStorage.setItem(LS_LANG, LANG); } catch (e) {}
  // চালু ভাষার বাটন হাইলাইট করা
  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === LANG));
  applyLang();
}

/** চালু ভাষা অনুযায়ী সাইটের সব লেখা বসানো:
    ১) data-i18n ঘর (ফিক্সড UI লেখা)   ২) data-i18n-ph ঘর (placeholder)
    ৩) data-edit ঘর (অ্যাডমিন-এডিটেবল লেখা)   ৪) ফোন/ঠিকানা
    ৫) JS-এ আঁকা অংশ (ফিল্টার, পণ্য, মিলি)   ৬) অঙ্ক (বছর, পরিমাণ) */
function applyLang() {
  document.documentElement.lang = LANG;
  document.body.classList.toggle("lang-en", LANG === "en");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const s = I18N[el.dataset.i18n];
    if (s) el.textContent = (s[LANG] != null) ? s[LANG] : s.bn;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const s = I18N[el.dataset.i18nPh];
    if (s) el.placeholder = (s[LANG] != null) ? s[LANG] : s.bn;
  });
  document.querySelectorAll("[data-edit]").forEach((el) => {
    const t = EDT(el.dataset.edit);
    if (t != null) el.textContent = t;
  });
  applySiteToDOM();
  setupFilters();
  renderProducts();
  renderMilaniFeature();
  const yr = document.getElementById("footYear");
  if (yr) yr.textContent = num(new Date().getFullYear());
  const q = document.getElementById("iQty");
  if (q && q.dataset.val) q.textContent = num(q.dataset.val);
  paintReceiptStaticTexts();
}

/* চালু পণ্যের তালিকা — পেজ খুললে localStorage (বা DEFAULT_PRODUCTS) থেকে বসে */
let PRODUCTS = [];

const DEFAULT_PRODUCTS = [
  {
    "id": "milani",
    "nameEn": "Milli / Pithali",
    "altNamesEn": ["Manda", "Milani"],
    "unitEn": "Per plate",
    "shortEn": "A symbol of Jamalpur's century-old love and social bonding — a traditional delicacy shared hot with steamed rice and mashkalai dal.",
    "historyEn": "Milli or Pithali is a symbol of the century-old love and social bonding of the Jamalpur region. Since ancient times, when settlements grew in the charlands, people would sit together at weddings, chollisha rituals or special gatherings and share this dish with steaming white rice and mashkalai dal on banana leaves. The meat's aroma, crafted by skilled bawarchis with special spice tempering and a magical mix of aromatic spices, and its tender taste are hard to forget once savoured. Every bite carries the warmth of rural Bengal's hospitality and an unmatched delight.",
    "ingredientsEn": [
      "Bones and fatty meat of beef, mutton or buffalo",
      "Rice flour",
      "Potato",
      "Onion",
      "Garlic",
      "Ginger",
      "Cumin",
      "Cardamom",
      "Cinnamon",
      "Bay leaf",
      "Various aromatic spices with oil"
    ],
    "name": "মিলি / পিঠালি",
    "altNames": [
      "ম্যান্দা",
      "মিলানি"
    ],
    "category": "food",
    "unit": "প্রতি প্লেট",
    "image": "images/milani-main.jpg",
    "gallery": [
      "images/milani-banner.jpg",
      "images/milani-2.jpg",
      "images/milani-3.jpg",
      "images/milani-4.jpg"
    ],
    "short": "জামালপুরের শতবর্ষের ভালোবাসা ও সামাজিক বন্ধনের প্রতীক — ধোঁয়া ওঠা ভাত ও মাষকলাই ডালের সাথে ভাগ করে খাওয়া ঐতিহ্যবাহী বিশেষ খাবার।",
    "history": "জামালপুর অঞ্চলের শতবর্ষের ভালোবাসা ও সামাজিক বন্ধনের প্রতীক এই মিলি বা পিঠালি। প্রাচীনকালে চরাঞ্চলে বসতি গড়ে ওঠার সময় থেকে বিয়ে, চল্লিশা বা বিশেষ মিলনমেলায় মানুষ একসাথে বসে কলাপাতায় ধোঁয়া ওঠা সাদা ভাত ও মাষকলাই ডালের সাথে এই খাবার ভাগ করে নিতেন। দক্ষ বাবুর্চিদের হাতের বিশেষ বাগাড় ও মসলার মায়াবী মিশ্রণে তৈরি এই মাংসের ঘ্রাণ আর মোলায়েম স্বাদ একবার মুখে নিলে সহজে ভোলা যায় না। প্রতিটি লোকমায় মিশে থাকে গ্রামবাংলার আতিথেয়তার উষ্ণতা ও অতুলনীয় স্বাদের তৃপ্তি।",
    "ingredients": [
      "গরু, খাসি বা মহিষের হাড় ও চর্বিযুক্ত মাংস",
      "চালের গুঁড়া",
      "আলু",
      "পেঁয়াজ",
      "রসুন",
      "আদা",
      "জিরা",
      "এলাচ",
      "দারুচিনি",
      "তেজপাতা",
      "তেলসহ বিভিন্ন সুগন্ধি মসলা"
    ]
  },
  {
    "id": "para-sandesh",
    "nameEn": "Para Sandesh",
    "altNamesEn": ["Para Sandesh", "Sweet of thickened milk"],
    "unitEn": "Per piece",
    "shortEn": "A nectar-like sweet made from thick khir of pure cow milk in a nearly 120-year-old tradition — the best gift for dear ones.",
    "historyEn": "Para Sandesh is a nectar-like sweet born of a century-old tradition and the utmost care of confectioners. From Naogaon to Sarishabari of Jamalpur, it is made with utmost affection from thick khir obtained by boiling pure cow milk, following a nearly 120-year-old method. Its melting light sweetness and the smooth aroma of pure milk have made it uniquely delicious. As it keeps well for days, it is the best sweet to carry home for dear ones or for the whole family.",
    "ingredientsEn": [
      "Pure cow milk (thick khir)",
      "Sugar (or date-palm nolen jaggery)",
      "A pinch of cardamom"
    ],
    "name": "প্যাড়া সন্দেশ",
    "altNames": [
      "প্যারা সন্দেশ",
      "ক্ষীরের সন্দেশ"
    ],
    "category": "food",
    "unit": "প্রতি পিস",
    "image": "images/para-sandesh-main.jpg",
    "gallery": [
      "images/para-sandesh-2.jpg",
      "images/para-sandesh-3.jpg"
    ],
    "short": "প্রায় ১২০ বছরের পুরোনো ধারায় খাঁটি গরুর দুধের ঘন ক্ষীর থেকে তৈরি অমৃতসম মিষ্টান্ন — উপহার হিসেবে সেরা।",
    "history": "প্রায় শতবর্ষের ঐতিহ্য আর কারিগরদের পরম যত্নে গড়ে ওঠা এক অমৃতসম মিষ্টান্ন হলো প্যাড়া সন্দেশ। নওগাঁ থেকে শুরু করে জামালপুরের সরিষাবাড়ীতে প্রায় ১২০ বছরের পুরোনো ধারায় খাঁটি গরুর দুধ জ্বাল দিয়ে ঘন ক্ষীর থেকে পরম মমতায় তৈরি হয় এই সন্দেশ। মুখে দিলেই মিলিয়ে যাওয়া হালকা মিষ্টি আর খাঁটি দুধের স্নিগ্ধ ঘ্রাণ একে করে তুলেছে অতুলনীয় সুস্বাদু। সহজে নষ্ট হয় না বলে প্রিয়জনদের জন্য উপহার হিসেবে বা বাড়ির সবার জন্য নিয়ে যাওয়ার সেরা একটি খাবার।",
    "ingredients": [
      "গরুর খাঁটি দুধ (ঘন ক্ষীর)",
      "চিনি (অথবা খেজুরের নলেন গুড়)",
      "সামান্য এলাচ"
    ]
  },
  {
    "id": "chanar-payesh",
    "nameEn": "Chanar Payesh",
    "altNamesEn": ["Chanar Poremno", "Chanar Payesh of Jamalpur & Sherpur"],
    "unitEn": "Per kg",
    "shortEn": "A GI-certified royal dessert — the thick, creamy texture of milk and fresh chana with the aroma of cardamom and nuts.",
    "historyEn": "This traditional Chanar Payesh is a blend of the affection of the mothers of Jamalpur and Sherpur and the delicate culinary art of confectioners. Whether welcoming guests or celebrating family festivals, this GI-certified royal dessert sits at the centre of every joy. The thick, creamy texture of milk and fresh chana, combined with the fragrance of cardamom and nuts, creates a heavenly and tempting taste. Hot or cold — a single spoonful soothes the heart and soul.",
    "ingredientsEn": [
      "Pure liquid milk",
      "Fresh chana (cottage cheese)",
      "Sugar or jaggery",
      "Cardamom",
      "Ghee",
      "Cashew and pistachio nuts",
      "Raisins"
    ],
    "name": "ছানার পায়েস",
    "altNames": [
      "ছানার পরমান্ন",
      "জামালপুর ও শেরপুরের ছানার পায়েস"
    ],
    "category": "food",
    "unit": "প্রতি কেজি",
    "image": "images/chanar-payesh-main.jpg",
    "gallery": [
      "images/chanar-payesh-2.jpg"
    ],
    "short": "জিআই স্বীকৃতিপ্রাপ্ত রাজকীয় মিষ্টান্ন — দুধ ও তাজা ছানার ঘন, ক্রিমি বুননে এলাচ-বাদামের সুবাস।",
    "history": "জামালপুর ও শেরপুর অঞ্চলের মায়েদের স্নেহ আর ময়রাদের সূক্ষ্ম রন্ধনশিল্পের মেলবন্ধন হলো এই ঐতিহ্যবাহী ছানার পায়েস। অতিথি আপ্যায়ন কিংবা ঘরোয়া উৎসব—সব আনন্দের কেন্দ্রবিন্দুতে থাকে জিআই স্বীকৃতিপ্রাপ্ত এই রাজকীয় মিষ্টান্ন। দুধ আর তাজা ছানার ঘন, ক্রিমি বুননের সাথে এলাচ ও বাদামের সুবাস মিলেমিশে তৈরি করে এক স্বর্গীয় ও লোভনীয় স্বাদ। ঠান্ডা বা গরম—যেকোনো অবস্থাতেই এর এক চামচ স্বাদ মন ও প্রাণ জুড়িয়ে দেয়।",
    "ingredients": [
      "খাঁটি তরল দুধ",
      "তাজা ছানা",
      "চিনি বা গুড়",
      "এলাচ",
      "ঘি",
      "কাজু-পেস্তা বাদাম",
      "কিশমিশ"
    ]
  },
  {
    "id": "chanar-polao",
    "nameEn": "Chanar Polao",
    "altNamesEn": ["Chanar Polao of Jamalpur", "Sweet polao of jhuri chana"],
    "unitEn": "Per kg",
    "shortEn": "A token of love at weddings and special feasts — jhuri chana fried in ghee and drenched in sweet syrup.",
    "historyEn": "Chanar Polao is a unique signature of Jamalpur's nearly century-old pride and tradition. As a token of love at weddings or special feasts, jhuri chana is fried in ghee and served drenched in sweet syrup, in the style of polao. Crafted by the deft hands of artisans, every grain delivers an extraordinary blend of pure ghee, cardamom and sweetness. Being different from ordinary sweets and incredibly tasty, its appeal to food lovers is timeless.",
    "ingredientsEn": [
      "Fresh chana (cottage cheese)",
      "Flour",
      "Ghee",
      "Oil for frying",
      "Sugar",
      "Water",
      "Cardamom",
      "Cinnamon",
      "Bay leaf"
    ],
    "name": "ছানার পোলাও",
    "altNames": [
      "জামালপুরের ছানার পোলাও",
      "ঝুরি ছানার মিষ্টি পোলাও"
    ],
    "category": "food",
    "unit": "প্রতি কেজি",
    "image": "images/chanar-polao-main.jpg",
    "gallery": [
      "images/chanar-polao-2.jpg",
      "images/chanar-polao-3.jpg"
    ],
    "short": "বিয়ে ও বিশেষ দাওয়াতের ভালোবাসার নিদর্শন — ঝুরি ছানা ঘিয়ে ভেজে মিষ্টি শিরায় ডুবিয়ে পরিবেশন।",
    "history": "জামালপুরের প্রায় শত বছরের পুরোনো গৌরব ও ঐতিহ্যের এক অনন্য স্বাক্ষর এই ছানার পোলাও। বিয়ে বা বিশেষ কোনো দাওয়াতে ভালোবাসার নিদর্শন হিসেবে পোলাওয়ের আদলে ঝুরি ছানা ঘিয়ে ভেজে ও মিষ্টি শিরায় ডুবিয়ে পরিবেশন করা হয়। কারিগরদের নিপুণ হাতের ছোঁয়ায় তৈরি প্রতিটি দানা মুখে নিলেই পাওয়া যায় খাঁটি ঘি, এলাচ আর মিষ্টির অসাধারণ মেলবন্ধন। সাধারণ মিষ্টির চেয়ে ভিন্নধর্মী ও অসম্ভব সুস্বাদু হওয়ায় ভোজনরসিকদের কাছে এর আকর্ষণ চিরন্তন।",
    "ingredients": [
      "তাজা ছানা",
      "ময়দা",
      "ঘি",
      "ভাজার জন্য তেল",
      "চিনি",
      "পানি",
      "এলাচ",
      "দারুচিনি",
      "তেজপাতা"
    ]
  },
  {
    "id": "jali-pitha",
    "nameEn": "Jali Pitha / Sirish Pitha",
    "altNamesEn": ["Kholaja Pitha", "Siris or syringe pitha"],
    "unitEn": "Per plate",
    "shortEn": "Pithas of the Nabanna festival and the loving hands of mothers and sisters — soft lacy jali pitha and crispy floral sirish pitha.",
    "historyEn": "The story of jali and sirish pitha is tied to rural Bengal's Nabanna festival and the loving touch of mothers and sisters. The soft lacy jali pitha, made through numerous perforations of a clay mould, tastes wonderful with any curry or jaggery; and sirish pitha, dried in the sun with floral patterns from a syringe or mould, becomes wonderfully crispy and delicious when fried. The women of the neighbourhood make these pithas together amid stories, laughter and joy, sending them to relatives' homes as gifts of love. Every bite carries the earthy scent of Bengal's soil and the taste of homely affection.",
    "ingredientsEn": [
      "Jali pitha: rice flour, egg, salt and hot water",
      "Sirish pitha: flour of atap or boiled rice, water, a pinch of salt",
      "Oil for frying"
    ],
    "name": "জালি পিঠা / সিরিশ পিঠা",
    "altNames": [
      "খোলাজা পিঠা",
      "সিরিজ বা সিরিঞ্জ পিঠা"
    ],
    "category": "food",
    "unit": "প্রতি প্লেট",
    "image": "images/jali-pitha-main.jpg",
    "gallery": [
      "images/jali-pitha-2.jpg",
      "images/jali-pitha-3.jpg"
    ],
    "short": "নবান্ন উৎসব আর মা-বোনদের স্নেহমাখা হাতের পিঠা — জালিদার নরম জালি পিঠা আর ফুলেল নকশার মচমচে সিরিশ পিঠা।",
    "history": "গ্রামীণ বাংলার নবান্ন উৎসব আর মা-বোনদের স্নেহমাখা হাতের পরশে জড়িয়ে আছে জালি ও সিরিশ পিঠার গল্প। মাটির খোলায় তৈরি অসংখ্য জালিদার ছিদ্রের নরম জালি পিঠা যেকোনো তরকারি বা গুড়ের সাথে খেতে যেমন দারুণ, তেমনি সিরিঞ্জ বা ছাঁচে ফুলেল নকশা করে রোদে শুকানো সিরিশ পিঠা ভাজলে হয় দারুণ মচমচে ও সুস্বাদু। পাড়ার নারীরা দলবেঁধে গল্প ও হাসি-আনন্দের মাঝে এই পিঠা বানিয়ে আত্মীয়স্বজনদের বাড়িতে ভালোবাসার উপহার হিসেবে পাঠান। প্রতিটি কামড়ে পাওয়া যায় বাংলার মাটির সোঁদা গন্ধ আর ঘরোয়া আদরের স্বাদ।",
    "ingredients": [
      "জালি পিঠায়: চালের গুঁড়া, ডিম, লবণ ও গরম পানি",
      "সিরিশ পিঠায়: আতপ বা সিদ্ধ চালের গুঁড়া, পানি, সামান্য লবণ",
      "ভাজার জন্য তেল"
    ]
  },
  {
    "id": "jamai-pitha",
    "nameEn": "Jamai Pitha",
    "altNamesEn": ["Jamai Aduri Pitha", "Pakon Pitha"],
    "unitEn": "Per piece",
    "shortEn": "A juicy sweet pitha born of the heart-touching care of mothers-in-law and housewives for the new son-in-law.",
    "historyEn": "In rural Bengal, this Jamai Pitha was born of the heart-touching care of mothers-in-law and housewives at the arrival of the new son-in-law and the wish for the daughter's happiness. At one time the brides of the neighbourhood would stay up all night, singing folk songs, shaping these pithas in various patterns with utmost love. When mugdal fried in ghee and rice-flour pitha is dipped in the juicy syrup of date jaggery or sugar, its crispy and juicy taste conquers everyone's heart. To bring smiles to the faces of dear family members, this sweet pitha has no rival.",
    "ingredientsEn": [
      "Rice flour",
      "Flour or fried mugdal (split mung beans)",
      "Egg",
      "Ghee",
      "Milk",
      "Coconut",
      "Date jaggery or sugar syrup",
      "Oil for frying"
    ],
    "name": "জামাই পিঠা",
    "altNames": [
      "জামাই আদুরি পিঠা",
      "পাকন পিঠা"
    ],
    "category": "food",
    "unit": "প্রতি পিস",
    "image": "images/jamai-pitha-main.jpg",
    "gallery": [
      "images/jamai-pitha-2.jpg"
    ],
    "short": "নতুন জামাইয়ের আগমনে শাশুড়ি ও গৃহিণীদের হৃদয় নিংড়ানো আদর-যত্ন থেকে জন্ম নেওয়া রসালো মিষ্টি পিঠা।",
    "history": "গ্রামবাংলায় নতুন জামাইয়ের আগমনে শাশুড়ি ও গৃহিণীদের হৃদয় নিংড়ানো আদর-যত্ন আর মেয়ের সুখের কামনা থেকে জন্ম নিয়েছে এই জামাই পিঠা। একসময় পাড়ার বউ-ঝিরা মিলে রাত জেগে লোকগানের সুরে নানা নকশায় পরম ভালোবাসায় এই পিঠা গড়তেন। ঘিয়ে ভাজা মুগডাল আর চালের গুঁড়ার পিঠা যখন খেজুরের গুড় বা চিনির রসালো শিরায় ডুবানো হয়, তখন তার মচমচে ও রসালো স্বাদ যে কারও মন জয় করে নেয়। পরিবারের প্রিয় মানুষদের মুখে হাসি ফোটাতে এই মিষ্টি পিঠার জুড়ি নেই।",
    "ingredients": [
      "চালের গুঁড়া",
      "ময়দা বা ভাজা মুগডাল",
      "ডিম",
      "ঘি",
      "দুধ",
      "নারকেল",
      "খেজুরের গুড় বা চিনির শিরা",
      "ভাজার জন্য তেল"
    ]
  },
  {
    "id": "nakshi-shilpo",
    "nameEn": "Nakshi Kantha (Embroidery Craft)",
    "altNamesEn": ["Nakshi Kantha", "Sujni"],
    "unitEn": "Per piece",
    "shortEn": "In every stitch of needle and thread is woven the love of mothers and grandmothers and stories of life — GI certified, the pride of over five hundred women entrepreneurs.",
    "historyEn": "In every stitch of needle and thread of Nakshi Kantha is embroidered the century-old love, patience and life stories of the mothers and grandmothers of Jamalpur. Sitting in the corners of their homes, rural women blend the musings of their hearts into vines, leaves and traditional alpana patterns, creating unique works of art. With the government's 'Nakshi Kanthar Desh' branding and GI product recognition, this craft has today made over five hundred women entrepreneurs of the district self-reliant. A Nakshi Kantha is not merely a household fabric — it is a living token of memory embroidered with utmost affection for dear ones.",
    "ingredientsEn": [
      "Old or new cotton fabric (than cloth)",
      "Coloured cotton thread",
      "Needle"
    ],
    "name": "নকশি শিল্প (নকশী কাঁথা)",
    "altNames": [
      "নকশী কাঁথা",
      "সুজনী"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "image": "images/nakshi-shilpo.jpg",
    "gallery": [],
    "short": "সুঁই-সুতার প্রতিটি ফোঁড়ে বোনা মা-দাদিদের ভালোবাসা ও জীবনের গল্প — জিআই স্বীকৃত, পাঁচ শতাধিক নারী উদ্যোক্তার গর্ব।",
    "history": "জামালপুরের মা-দাদিদের শত-দেড়শ বছরের ভালোবাসা, ধৈর্য আর জীবনের গল্প সুঁই-সুতার প্রতিটি ফোঁড়ে বোনা থাকে নকশী কাঁথায়। ঘরের কোণে বসে গ্রামীণ নারীরা নিজেদের মনের মাধুরী মিশিয়ে লতা-পাতা আর ঐতিহ্যবাহী আল্পনায় সাজিয়ে তোলেন একেকটি অনন্য শিল্পকর্ম। সরকারের 'নকশী কাঁথার দেশ' ব্র্যান্ডিং এবং জিআই পণ্যের স্বীকৃতি পাওয়া এই শিল্প আজ জেলার পাঁচ শতাধিক নারী উদ্যোক্তাকে স্বাবলম্বী করেছে। একটি নকশী কাঁথা কেবল ব্যবহার্য বস্ত্র নয়, বরং প্রিয়জনের জন্য পরম মমতায় বোনা এক জীবন্ত স্মৃতিচিহ্ন।",
    "ingredients": [
      "পুরোনো বা নতুন সুতি কাপড় (থান কাপড়)",
      "রঙিন সুতি সুতা",
      "সুঁচ"
    ]
  },
  {
    "id": "kasha-shilpo",
    "nameEn": "Kansa Craft (Bell Metal)",
    "altNamesEn": ["Kansa of Islampur", "Bell and brass craft"],
    "unitEn": "Per piece",
    "shortEn": "Traditional bell-metal ware forged in fire by the artisans of Islampur — a symbol of family hospitality and elegance.",
    "historyEn": "The Kansa craft, shaped by the sweat, devotion and traditional skill of the artisans of Islampur in Jamalpur, was once renowned across the world. Out of deep affection and love for the ancestral profession, even in this modern mechanical age about 20–25 families of Islampur still forge perfect bell-metal ware in the fire. Traditionally, bell-metal ware has been used as a symbol of elegance in family hospitality, weddings and religious rituals. Bringing home its golden glow and long-lasting form brings a unique traditional beauty.",
    "ingredientsEn": [
      "Alloy metal of copper and tin (rang) in a fixed ratio",
      "Clay moulds",
      "Coal"
    ],
    "name": "কাঁসা শিল্প",
    "altNames": [
      "ইসলামপুরের কাঁসা",
      "কাঁসা-পিতল শিল্প"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "image": "images/kasha-shilpo.jpg",
    "gallery": [],
    "short": "ইসলামপুরের কারিগরদের আগুনের আঁচে গড়া ঐতিহ্যবাহী কাঁসার সামগ্রী — পারিবারিক আতিথেয়তা ও আভিজাত্যের প্রতীক।",
    "history": "জামালপুরের ইসলামপুরের কারিগরদের ঘাম, নিষ্ঠা আর ঐতিহ্যবাহী দক্ষতায় গড়া কাঁসা শিল্প একসময় বিশ্বজুড়ে সমাদৃত ছিল। পৈতৃক পেশার প্রতি গভীর মায়া আর ভালোবাসা থেকে আধুনিক যান্ত্রিক যুগেও ইসলামপুরের প্রায় ২০-২৫টি পরিবার আজও আগুনের আঁচে নিখুঁত কাঁসার সামগ্রী তৈরি করে চলেছেন। ঐতিহ্যগতভাবে পারিবারিক আতিথেয়তা, বিয়ে ও ধর্মীয় আচারে কাঁসার সামগ্রী আভিজাত্যের প্রতীক হিসেবে ব্যবহৃত হয়ে আসছে। এর সোনালী আভা ও দীর্ঘস্থায়ী গড়ন ঘরে নিয়ে আসে এক অনন্য ঐতিহ্যবাহী সৌন্দর্য।",
    "ingredients": [
      "তামা ও টিনের (রাং) নির্দিষ্ট অনুপাতের সংকর ধাতু",
      "মাটির ছাঁচ",
      "কয়লা"
    ]
  },
  {
    "id": "mrithshilpo",
    "nameEn": "Pottery & Terracotta",
    "altNamesEn": ["Clay utensils", "Terracotta items"],
    "unitEn": "Per piece",
    "shortEn": "Eco-friendly clay pots and Tepa dolls shaped on the wheels of the Kumar community — a magical touch of native clay.",
    "historyEn": "Since ancient times, clay has come alive under the touch of Bengal's Kumar (potters) community and become an inseparable part of rural life. According to the 1901 census, as many as one and a half thousand Kumar families in Jamalpur practised this exquisite craft generation after generation. Even amid modern plastic and steel, clay pots and Tepa dolls retain their charm as eco-friendly and tasteful products. Every clay product carries the deep labour of the potters, closeness to nature and the magical touch of native clay.",
    "ingredientsEn": [
      "Clean and sticky etel (clayey) soil",
      "Water",
      "Wooden wheel",
      "Kiln for firing",
      "Natural colours"
    ],
    "name": "মৃৎশিল্পের সামগ্রী",
    "altNames": [
      "মাটির তৈজসপত্র",
      "পোড়ামাটির সামগ্রী"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "image": "images/mrithshilpo.jpg",
    "gallery": [],
    "short": "কুমার সম্প্রদায়ের চাকায় গড়া পরিবেশবান্ধব মাটির পাত্র ও টেপা পুতুল — দেশীয় মাটির মায়াবী ছোঁয়া।",
    "history": "প্রাচীনকাল থেকে বাংলার কুমার সম্প্রদায়ের হাতের স্পর্শে কাদামাটি প্রাণ পেয়েছে এবং হয়ে উঠেছে গ্রামীণ জীবনের অবিচ্ছেদ্য অংশ। ১৯০১ সালের হিসাব অনুযায়ী জামালপুরেই দেড় হাজার কুমার পরিবারের সদস্য বংশপরম্পরায় এই নিপুণ শিল্পের চর্চা করে গেছেন। আধুনিক প্লাস্টিক বা স্টিলের ভিড়েও পরিবেশবান্ধব ও শৌখিন পণ্য হিসেবে মাটির তৈরি পাত্র ও টেপা পুতুলের কদর আজও অমলিন। প্রতিটি মাটির পণ্যে লেগে থাকে কুমারদের গভীর শ্রম, প্রকৃতির সান্নিধ্য আর দেশীয় মাটির মায়াবী ছোঁয়া।",
    "ingredients": [
      "পরিষ্কার ও আঠালো এঁটেল মাটি",
      "পানি",
      "কাঠের চাকা",
      "পোড়ানোর চুল্লি",
      "প্রাকৃতিক রঙ"
    ]
  },
  {
    "id": "basher-ponno",
    "nameEn": "Bamboo Crafts (Basket / Kula / Chaluni)",
    "altNamesEn": ["Bamboo and cane handicrafts"],
    "unitEn": "Per piece",
    "shortEn": "Durable bamboo-cane crafts woven by hereditary artisans — now acclaimed in the markets of Europe, Japan and America.",
    "historyEn": "In the rural world of agrarian Bengal, from harvesting crops to everyday household chores, bamboo and cane products have been people's constant companion for ages. Hereditary rural artisans, with boundless patience and skill, weave these durable and eco-friendly crafts from bamboo strips. Covering nearly half of the country's total handicrafts, these products have now crossed village boundaries and are earning fame in the markets of Europe, Japan and America. Having such products at home as part of a natural and healthy lifestyle means cherishing the heritage of Bengal.",
    "ingredientsEn": [
      "Mature bamboo",
      "Cane",
      "Fine wire or thread",
      "Colour as needed"
    ],
    "name": "বাঁশের পণ্য (ঝুড়ি / কুলা / চালুনি)",
    "altNames": [
      "বাঁশ ও বেতের হস্তশিল্প"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "image": "images/basher-ponno.jpg",
    "gallery": [],
    "short": "বংশপরম্পরায় কারিগরদের বোনা টেকসই বাঁশ-বেতের সামগ্রী — এখন ইউরোপ, জাপান ও আমেরিকার বাজারেও সুনাম।",
    "history": "কৃষিপ্রধান বাংলার গ্রামীণ জনপদে ফসল তোলা থেকে শুরু করে সংসারের নিত্যদিনের কাজে বাঁশ ও বেতের পণ্য যুগ যুগ ধরে মানুষের পরম সঙ্গী। বংশপরম্পরায় গ্রামীণ কারিগররা অসীম ধৈর্য ও দক্ষতায় বাঁশের শলা বুনে তৈরি করেন এসব টেকসই ও পরিবেশবান্ধব শিল্পকর্ম। দেশের মোট হস্তশিল্পের প্রায় অর্ধেক অংশ জুড়ে থাকা এই পণ্যগুলো আজ গ্রামের গণ্ডি পেরিয়ে ইউরোপ, জাপান ও আমেরিকার বাজারেও সুনাম কুড়াচ্ছে। প্রাকৃতিক ও স্বাস্থ্যসম্মত জীবনযাপনের অংশ হিসেবে ঘরে এমন পণ্য থাকা মানেই বাংলার ঐতিহ্যকে আগলে রাখা।",
    "ingredients": [
      "পরিপক্ব বাঁশ",
      "বেত",
      "চিকন তার বা সুতা",
      "প্রয়োজনভেদে রঙ"
    ]
  },
  {
    "id": "sorishar-tel",
    "nameEn": "Mustard Oil",
    "altNamesEn": ["Pure ghani-pressed mustard oil"],
    "unitEn": "Per litre",
    "shortEn": "A tradition dating back to 3000 BC — pungent, unadulterated pure mustard oil slowly pressed in a wooden ghani.",
    "historyEn": "Pure mustard oil has been tied to Bengali kitchens, pickles and wellness since about 3000 BC in the subcontinent. Mustard is one of Jamalpur's principal crops — in fact, the upazila 'Sarishabari' itself was named after the memory of historic mustard cultivation. The pungent aroma of pure mustard oil slowly pressed in a wooden ghani brings an unbelievable and tempting taste to any bhorta, fry or fish curry. This unadulterated extract of nature not only multiplies the taste of food but also plays a unique role in caring for the body.",
    "ingredientsEn": [
      "Pure native mustard seeds (e.g. Shweti or Rai mustard)"
    ],
    "name": "সরিষার তেল",
    "altNames": [
      "ঘানি ভাঙা খাঁটি সরিষার তেল"
    ],
    "category": "craft",
    "unit": "প্রতি লিটার",
    "image": "images/sorishar-tel-main.jpg",
    "gallery": [
      "images/sorishar-tel-2.jpg",
      "images/sorishar-tel-3.jpg"
    ],
    "short": "খ্রিস্টপূর্ব ৩০০০ অব্দের ঐতিহ্য — কাঠের ঘানিতে ধীরে ভাঙা ঝাঁঝালো, ভেজালমুক্ত খাঁটি সরিষার তেল।",
    "history": "উপমহাদেশে প্রায় খ্রিস্টপূর্ব ৩০০০ অব্দ থেকে বাঙালির রান্নাঘর, আচার আর সুস্থতার সাথে জড়িয়ে আছে খাঁটি সরিষার তেল। জামালপুরের প্রধান ফসলগুলোর একটি সরিষা—এমনকি ঐতিহাসিক সরিষা চাষের স্মৃতি থেকেই 'সরিষাবাড়ী' উপজেলার নামকরণ হয়েছে। কাঠের ঘানিতে ধীরে ধীরে ভাঙানো খাঁটি সরিষার তেলের ঝাঁঝালো ঘ্রাণ যেকোনো ভর্তা, ভাজি বা মাছের রান্নায় এনে দেয় অবিশ্বাস্য ও লোভনীয় স্বাদ। ভেজালমুক্ত প্রকৃতির এই নির্যাস খাবারের স্বাদ যেমন বহুগুণ বাড়ায়, তেমনি শরীরের যত্নেও রাখে অনন্য ভূমিকা।",
    "ingredients": [
      "দেশি খাঁটি সরিষা দানা (যেমন শ্বেতী বা রাই সরিষা)"
    ]
  },
  {
    "id": "jute-craft",
    "nameEn": "Jute Products",
    "altNamesEn": ["Products of the golden fibre (jute bags, shika, carpets and mats)"],
    "unitEn": "Per piece",
    "shortEn": "The heritage of Sarishabari's jute warehouses — eco-friendly jute bags, shika and mats, at the top of handicraft exports.",
    "historyEn": "Our jute, the 'golden fibre', is an eternal symbol of Bengal's economy and love for nature. Since the British era, Sarishabari of Jamalpur was one of the subcontinent's foremost jute export centres, home to many traditional jute warehouses (patakuthi). Made with the utmost care of rural artisans without harming the environment, jute bags, shika and mats today stand at the top of Bangladesh's handicraft exports. These aesthetic and sustainable jute products will bring a sense of refinement and patriotism to your daily use.",
    "ingredientsEn": [
      "Raw jute fibre",
      "Jute yarn and rope",
      "Jute sticks (patakhari)",
      "Natural colours",
      "Cotton or leather in some cases"
    ],
    "name": "পাটজাত পণ্য",
    "altNames": [
      "সোনালী আঁশের পণ্য (পাটের ব্যাগ, শিকা, কার্পেট ও চট)"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "image": "images/jute-craft.jpg",
    "gallery": [],
    "short": "সরিষাবাড়ীর পাটকুঠির ঐতিহ্য — পরিবেশবান্ধব পাটের ব্যাগ, শিকা ও ম্যাট, হস্তশিল্প রপ্তানির শীর্ষে।",
    "history": "বাংলার অর্থনীতি ও প্রকৃতির প্রতি ভালোবাসার চিরন্তন প্রতীক হলো আমাদের 'সোনালী আঁশ' পাট। ব্রিটিশ আমল থেকেই জামালপুরের সরিষাবাড়ী ছিল উপমহাদেশের অন্যতম প্রধান পাট রপ্তানি কেন্দ্র, যেখানে বহু ঐতিহ্যবাহী পাটকুঠি গড়ে উঠেছিল। পরিবেশের কোনো ক্ষতি না করে গ্রামীণ কারিগরদের পরম যত্নে তৈরি পাটের ব্যাগ, শিকা ও ম্যাট আজ বিশ্ববাজারে বাংলাদেশের হস্তশিল্প রপ্তানির শীর্ষে রয়েছে। নান্দনিক ও টেকসই এই পাটজাত পণ্যগুলো আপনার দৈনন্দিন ব্যবহারে নিয়ে আসবে রুচিশীলতা ও দেশপ্রেমের অনুভূতি।",
    "ingredients": [
      "কাঁচা পাটের আঁশ",
      "পাটের সুতা ও দড়ি",
      "পাটখড়ি",
      "প্রাকৃতিক রঙ",
      "ক্ষেত্রবিশেষে তুলা বা চামড়া"
    ]
  },
  {
    "id": "dhaner-anti",
    "nameEn": "Sheaf of Paddy (Dhaner Anti)",
    "altNamesEn": ["Bundle of ripe paddy", "Muthi or Bira"],
    "unitEn": "Per sheaf",
    "shortEn": "The golden harvest of the farmer's sweat, dreams and love for the soil in Agrahayan's Nabanna — a symbol of abundance and roots.",
    "historyEn": "The sheaf of ripe paddy is the golden harvest of the farmer's year-long sweat, dreams and unfeigned love for the soil. During the Nabanna festival of Agrahayan, farmers bring this sheaf home from the field on their heads or in bullock carts — still a familiar scene in rural Jamalpur. The scent of new-rice pitha and payesh from this golden paddy fills Bengali homes, while paddy straw is used in rural household chores and folk art. A handful of paddy sheaf in home decoration or auspicious occasions means abundance, the greenery of Bengal and a pull toward one's roots.",
    "ingredientsEn": [
      "Ripe paddy plant (grain and straw)",
      "Straw or jute rope for tying the sheaf"
    ],
    "name": "ধানের আঁটি",
    "altNames": [
      "পাকা ধানের গোছা",
      "মুঠি বা বিড়া"
    ],
    "category": "processed",
    "unit": "প্রতি আঁটি",
    "image": "images/dhaner-anti.jpg",
    "gallery": [],
    "short": "অগ্রহায়ণের নবান্নে কৃষকের ঘাম, স্বপ্ন ও মাটির ভালোবাসার সোনালী ফসল — প্রাচুর্য আর শিকড়ের টানের প্রতীক।",
    "history": "কৃষকের সারা বছরের ঘাম, স্বপ্ন আর মাটির প্রতি অকৃত্রিম ভালোবাসার সোনালী ফসল হলো পাকা ধানের আঁটি। অগ্রহায়ণের নবান্ন উৎসবে কৃষকরা মাঠ থেকে এই আঁটি মাথায় বা গরুর গাড়িতে করে বাড়ির উঠানে তুলে আনেন, যা জামালপুরের গ্রামীণ জীবনে আজও এক চিরচেনা দৃশ্য। এই সোনালী ধানের নতুন চালের পিঠা-পায়েসের সুবাসেই ভরে ওঠে বাঙালির ঘর, আর ধানের খড় ব্যবহৃত হয় গ্রামীণ গৃহস্থালি ও লোকশিল্পে। ঘরের সাজে বা মাঙ্গলিক অনুষঙ্গে একমুঠো ধানের আঁটি মানেই প্রাচুর্য, শস্যশ্যামলা বাংলা আর শিকড়ের টান।",
    "ingredients": [
      "পাকা ধান গাছ (ধান ও খড়)",
      "আঁটি বাঁধার জন্য খড় বা পাটের দড়ি"
    ]
  },
  {
    "id": "jhuri-kula",
    "nameEn": "Basket / Kula / Chaluni (Winnow & Sieve)",
    "altNamesEn": ["Tukri", "Dhama", "Chalni", "Dali"],
    "unitEn": "Per piece",
    "shortEn": "The daily companion of rural mothers and aunts — kula and dali are also used in weddings and Nabanna's auspicious traditions.",
    "historyEn": "Baskets, kula and chaluni are the daily companions of rural mothers and aunts and the truest means of winnowing and sorting the harvest. Not just in household chores — the use of kula and dali in auspicious occasions like Bengali weddings and Nabanna survives as an affectionate tradition. Woven with the loving hands of artisans, these products are hundred percent safe for the environment and are now hugely popular in urban modern home decor. Using these handwoven products instead of plastic means putting smiles on the faces of rural artisans.",
    "ingredientsEn": [
      "Thinly sliced bamboo strips",
      "Cane",
      "Thread or fine wire for binding"
    ],
    "name": "ঝুড়ি / কুলা / চালুনি",
    "altNames": [
      "টুকরি",
      "ধামা",
      "চালনি",
      "ডালি"
    ],
    "category": "processed",
    "unit": "প্রতি পিস",
    "image": "images/jhuri-kula.jpg",
    "gallery": [],
    "short": "গ্রামবাংলার মা-চাচিদের সংসারের নিত্যসঙ্গী — বিয়ে-শাদি ও নবান্নের মাঙ্গলিক ঐতিহ্যেও কুলা-ডালির ব্যবহার।",
    "history": "গ্রামবাংলার মা-চাচিদের সংসারের নিত্যসঙ্গী ও ফসল ঝাড়াই-বাছাইয়ের অকৃত্রিম মাধ্যম হলো ঝুড়ি, কুলা ও চালুনি। কেবল গৃহস্থালি কাজেই নয়, বাঙালির বিয়ে-শাদি ও নবান্নের মতো মাঙ্গলিক অনুষ্ঠানেও কুলা ও ডালির ব্যবহার এক স্নেহময় ঐতিহ্য হিসেবে টিকে আছে। কারিগরদের হাতের মায়ায় বোনা এসব পণ্য পরিবেশের জন্য শতভাগ নিরাপদ এবং শহুরে আধুনিক অন্দরসজ্জায়ও এখন দারুণ জনপ্রিয়। প্লাস্টিকের বদলে এই হাতে বোনা পণ্যগুলো ব্যবহার করা মানেই গ্রামীণ কারিগরদের মুখে হাসি ফোটানো।",
    "ingredients": [
      "পাতলা করে চেরা বাঁশের শলা",
      "বেত",
      "বাঁধার জন্য সুতা বা চিকন তার"
    ]
  },
  {
    "id": "hari-kolosh",
    "nameEn": "Clay Pot & Pitcher (Hari & Kolosh)",
    "altNamesEn": ["Clay patil", "Koloshi", "Shokher Hari"],
    "unitEn": "Per piece",
    "shortEn": "The smooth taste of cooking in clay pots and the comfort of cool pitcher water — a peaceful way to stay close to nature.",
    "historyEn": "For time immemorial, the smooth taste of food cooked in clay pots and the comfort of cool water from a clay pitcher have been a unique feeling in rural Bengal's kitchens. Hari and kolosh crafted with the utmost care by the potters of Jamalpur once met people's daily needs across different parts of the country. Although use has somewhat declined amid metal pots, the traditional 'shokher hari' (decorative pot) and clay pitcher remain a unique part of Boishakhi fairs and home decoration. Cooking or storing water in clay pots is not merely tradition — it is a peaceful way to stay close to nature.",
    "ingredientsEn": [
      "Clean etel clay free of grit and stones",
      "Water",
      "Wooden wheel",
      "Natural or mineral colours"
    ],
    "name": "হাঁড়ি ও কলস",
    "altNames": [
      "মাটির পাতিল",
      "কলসি",
      "শখের হাঁড়ি"
    ],
    "category": "processed",
    "unit": "প্রতি পিস",
    "image": "images/hari-kolosh.jpg",
    "gallery": [],
    "short": "মাটির হাঁড়ির রান্নার স্নিগ্ধ স্বাদ আর কলসের শীতল পানির তৃপ্তি — প্রকৃতির কাছাকাছি থাকার প্রশান্তিময় উপায়।",
    "history": "আবহমান কাল ধরে গ্রামবাংলার রান্নাঘরে মাটির হাঁড়িতে রান্না করা খাবারের স্নিগ্ধ স্বাদ আর মাটির কলসের শীতল পানির তৃপ্তি এক অনন্য অনুভূতি। জামালপুরের কুমারদের পরম যত্নে গড়া হাঁড়ি ও কলস একসময় দেশের বিভিন্ন প্রান্তে মানুষের প্রতিদিনের প্রয়োজন মেটাত। ধাতব পাত্রের ভিড়ে ব্যবহার কিছুটা কমলেও ঐতিহ্যবাহী 'শখের হাঁড়ি' ও মাটির কলস আজও বৈশাখী মেলা ও ঘর সাজানোর অনন্য অনুষঙ্গ হয়ে আছে। মাটির পাত্রে রান্না বা পানি সংরক্ষণ কেবল ঐতিহ্যই নয়, বরং প্রকৃতির কাছাকাছি থাকার এক প্রশান্তিময় উপায়।",
    "ingredients": [
      "কাঁকর ও পাথরমুক্ত পরিষ্কার এঁটেল মাটি",
      "পানি",
      "কাঠের চাকা",
      "প্রাকৃতিক বা খনিজ রঙ"
    ]
  },
  {
    "id": "kasa",
    "nameEn": "Kansa (Bell Metal Utensils)",
    "altNamesEn": ["Bell metal ware", "Ghati-bati and plates"],
    "unitEn": "Per piece",
    "shortEn": "Bell metal plates, bowls, ghati, glasses and badna — shining tokens of hospitality and dignity, an invaluable heirloom of tradition.",
    "historyEn": "The traditional bell metal plates, bowls, ghati, glasses and badna of Islampur in Jamalpur are a shining token of Bengali hospitality and dignity. Once, from wedding gifts to serving food to special guests, eating on bell metal ware expressed deep respect and love. Eating from these sustainable metal utensils, which have survived generation after generation, is healthy, and their gleaming look fascinates anyone. Even today, having a piece of pure bell metal ware at home means preserving an invaluable heirloom of hereditary tradition.",
    "ingredientsEn": [
      "Alloy of copper and tin (fixed ratio of copper and rang)",
      "Clay moulds",
      "Coal"
    ],
    "name": "কাঁসা (কাঁসার তৈজসপত্র)",
    "altNames": [
      "কাঁসার বাসন",
      "ঘটি-বাটি ও থালা"
    ],
    "category": "processed",
    "unit": "প্রতি পিস",
    "image": "images/kasa.jpg",
    "gallery": [],
    "short": "আতিথেয়তা ও মর্যাদার উজ্জ্বল নিদর্শন কাঁসার থালা-বাটি, ঘটি, গ্লাস ও বদনা — বংশানুক্রমিক ঐতিহ্যের অমূল্য সম্পদ।",
    "history": "জামালপুরের ইসলামপুরের ঐতিহ্যবাহী কাঁসার থালা-বাটি, ঘটি, গ্লাস ও বদনা বাঙালির আতিথেয়তা ও মর্যাদার এক উজ্জ্বল নিদর্শন। একসময় বিয়ের উপহার থেকে শুরু করে বিশেষ অতিথির পাতে খাবার পরিবেশনে কাঁসার বাসন ব্যবহার করা ছিল গভীর সম্মান ও ভালোবাসার প্রকাশ। প্রজন্মের পর প্রজন্ম ধরে টিকে থাকা এই টেকসই ধাতব বাসনগুলোতে খাবার খাওয়া যেমন স্বাস্থ্যসম্মত, তেমনি এর ঝলমলে রূপ যে কাউকে মুগ্ধ করে। আজও একটি খাঁটি কাঁসার তৈজস ঘরে থাকা মানে বংশানুক্রমিক ঐতিহ্যের এক অমূল্য সম্পদ সংরক্ষণ করা।",
    "ingredients": [
      "তামা ও টিনের সংকর ধাতু (তামা ও রাং-এর নির্দিষ্ট অনুপাত)",
      "মাটির ছাঁচ",
      "কয়লা"
    ]
  }
];
/* ============================================================
   ৩) ক্যাটাগরি (সেকশন) — ফিল্টার বাটনে দেখাবে
   ------------------------------------------------------------
   "all" হলো ভার্চুয়াল সেকশন (সব পণ্য) — এটি কেউ মুছতে পারবে না।
   বাকি সেকশন অ্যাডমিন প্যানেল থেকে যোগ/বদল/মুছে ফেলা যায়।
   ============================================================ */
const DEFAULT_CATEGORIES = [
  { key: "food",      label: "খাদ্য",       labelEn: "Food" },
  { key: "craft",     label: "হস্তশিল্প",    labelEn: "Handicrafts" },
  { key: "processed", label: "প্রক্রিয়াজাত", labelEn: "Processed Goods" },
];
// চালু তালিকা — localStorage থেকে বসে (অ্যাডমিন বদলাতে পারে)
let CATEGORIES = [{ key: "all", label: "সব পণ্য", labelEn: "All Products" }, ...DEFAULT_CATEGORIES];

/* ============================================================
   ৪) সাহায্যকারী ছোট ফাংশন
   ============================================================ */

/** ইংরেজি অঙ্ক (0-9) কে বাংলা অঙ্কে (০-৯) রূপান্তর */
function toBn(num) {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bn[Number(d)]);
}

/** বাংলা তারিখ তৈরি: ১৫ নভেম্বর ২০২৬, দুপুর ০২:৩০ */
const BN_MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন",
                   "জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
function bnDate(d) {
  const h24 = d.getHours();
  const part = h24 < 5 ? "রাত" : h24 < 12 ? "সকাল" : h24 < 16 ? "দুপুর" : h24 < 19 ? "বিকাল" : "রাত";
  let h = h24 % 12; if (h === 0) h = 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return toBn(d.getDate()) + " " + BN_MONTHS[d.getMonth()] + " " + toBn(d.getFullYear()) +
         ", " + part + " " + toBn(h) + ":" + toBn(mm);
}

/** ছোট মেসেজ (টোস্ট) দেখানো — নিচে ডান কোণে ভেসে ওঠে */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4000);
}

/** HTML নিরাপদ করা — অ্যাডমিনের লেখা ভেতরে <script> জাতীয় কিছু থাকলেও সাইট না ভাঙে */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** ফোন নম্বরকে 880… ফরম্যাটে আনা (হোয়াটসঅ্যাপ লিংকে লাগে) */
function toIntl(phone) {
  const d = String(phone).replace(/\D/g, "");
  if (d.startsWith("880")) return d;
  if (d.startsWith("0")) return "880" + d.slice(1);
  return d;
}

/** কিছুক্ষণ পর পর একবার চালানো (টাইপ করার সময় বার বার সেভ আটকায়) */
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/** পণ্যের ডাটা ঠিকঠাক ফরম্যাটে আনা — যেটা রাখা হয়নি সেটা খালি ভরা হয় */
function normalizeProduct(p) {
  const catKeys = CATEGORIES.filter((c) => c.key !== "all").map((c) => c.key);
  return {
    id: p.id || ("p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)),
    name: p.name || "",
    // ইংরেজি অনুবাদের ঘর (অ্যাডমিন না দিলে খালি — সাইট তখন বাংলা লেখা দেখায়)
    nameEn: p.nameEn || "",
    altNamesEn: Array.isArray(p.altNamesEn) ? p.altNamesEn : [],
    unitEn: p.unitEn || "",
    shortEn: p.shortEn || "",
    historyEn: p.historyEn || "",
    ingredientsEn: Array.isArray(p.ingredientsEn) ? p.ingredientsEn.filter(Boolean) : [],
    altNames: Array.isArray(p.altNames) ? p.altNames : [],
    category: catKeys.includes(p.category) ? p.category : (catKeys[0] || "food"),
    unit: p.unit || "প্রতি পিস",
    image: p.image || "",
    gallery: Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : [],
    short: p.short || "",
    history: p.history || "",
    ingredients: Array.isArray(p.ingredients) ? p.ingredients.filter(Boolean) : [],
  };
}

/** ছবি না দিলে কার্ডে যে ছবিটা দেখাবে (মাটির হাঁড়ির আইকন) */
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'>` +
  `<rect width='640' height='400' fill='#f3e3cb'/>` +
  `<rect x='16' y='16' width='608' height='368' fill='none' stroke='#b04e26' stroke-width='5' rx='20'/>` +
  `<g fill='#b04e26'><rect x='252' y='128' width='136' height='20' rx='10'/>` +
  `<path d='M282 156h76v24c28 11 48 38 48 70v46c0 24-20 44-44 44h-84c-24 0-44-20-44-44v-46c0-32 20-59 48-70z'/></g>` +
  `<circle cx='206' cy='112' r='14' fill='#b04e26' opacity='0.55'/>` +
  `<circle cx='436' cy='96' r='9' fill='#b04e26' opacity='0.45'/></svg>`
);

/** ডিভাইস থেকে ছবি নিয়ে ছোট করে JPEG (dataURL) বানানো — আপলোড হালকা রাখতে */
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
   ৫) হোমপেজের লেখা — TEXTS ব্যবস্থা
   ------------------------------------------------------------
   index.html-এ যেসব লেখার ভেতরে data-edit="কী" আছে, সেগুলো
   অ্যাডমিন প্যানেলের "হোমপেজের লেখা" ট্যাব থেকে বদলানো যায়।
   DEFAULT_TEXTS = পেজ খুললে যা লেখা আছে (মূল ডিফল্ট)।
   TEXTS = চালু লেখা (localStorage-এ সেভ হয়)।
   ============================================================ */
const DEFAULT_TEXTS = {};   // পেজ খুললে ভরা হয় (harvestDefaults)
let TEXTS = {};             // চালু লেখা

/* JS দিয়ে আঁকা মিলি অংশের লেখাগুলোর ডিফল্ট (HTML-এ নেই, তাই এখানে) */
const JS_TEXT_DEFAULTS = {
  milaniOverline: "বিশেষ পরিচিতি",
  milaniTag: "শতবর্ষের ঐতিহ্য",
  milaniIngTitle: "উপকরণ",
  milaniAlt: "(মিলানি)",
};

/** পেজ খুললে HTML থেকে সব data-edit লেখার ডিফল্ট তুলে রাখা */
function harvestDefaults() {
  document.querySelectorAll("[data-edit]").forEach((el) => {
    const k = el.dataset.edit;
    if (!(k in DEFAULT_TEXTS)) DEFAULT_TEXTS[k] = el.textContent.trim();
  });
  Object.keys(JS_TEXT_DEFAULTS).forEach((k) => {
    if (!(k in DEFAULT_TEXTS)) DEFAULT_TEXTS[k] = JS_TEXT_DEFAULTS[k];
  });
  if (!TEXTS || !Object.keys(TEXTS).length) TEXTS = { ...DEFAULT_TEXTS };
}

/** HTML-এর data-edit ঘরগুলোতে সেভ করা লেখা বসানো (ডিফল্টের মতো হলে ছুঁই না) */
function renderStaticTexts() {
  document.querySelectorAll("[data-edit]").forEach((el) => {
    const k = el.dataset.edit;
    if (TEXTS[k] != null && TEXTS[k] !== DEFAULT_TEXTS[k]) el.textContent = TEXTS[k];
  });
}

/* ============================================================
   ৬) কনটেন্ট সেভ/লোড (localStorage)
   ------------------------------------------------------------
   সব পরিবর্তন এক জায়গায় (jph_content) সেভ হয়:
   সাইট সেটিংস + লেখা + হিরো ছবি + পণ্য + সেকশন।
   localStorage = ব্রাউজারের নিজের স্টোরেজ — নেট ছাড়াও কাজ করে,
   তবে শুধু যে ব্রাউজারে বদলানো হয় সেখানেই থাকে। তাই "ব্যাকআপ"
   ট্যাব থেকে JSON ফাইল ডাউনলোড করে রাখা ভালো।
   ============================================================ */
const LS_CONTENT = "jph_content"; // কনটেন্ট যে নামে সেভ হয়

/** এখনকার পুরো অবস্থার একটা কপি (সেভ/ব্যাকআপের জন্য) */
function snapshot() {
  const hero = document.querySelector("[data-hero-img]");
  return {
    version: 2,
    updated: new Date().toISOString(),
    site: {
      nameBn: SITE.nameBn, nameEn: SITE.nameEn,
      phone: SITE.phone, address: SITE.address,
      googleFormUrl: SITE.googleFormUrl, featuredId: SITE.featuredId,
    },
    texts: JSON.parse(JSON.stringify(TEXTS)),
    heroImage: hero ? hero.getAttribute("src") : "",
    products: JSON.parse(JSON.stringify(PRODUCTS)),
    categories: JSON.parse(JSON.stringify(CATEGORIES.filter((c) => c.key !== "all"))),
  };
}

/** সেভ করা কনটেন্ট সাইটে বসানো */
function applyContent(c) {
  if (c.site) {
    if (c.site.nameBn) SITE.nameBn = c.site.nameBn;
    if (c.site.nameEn) SITE.nameEn = c.site.nameEn;
    if (c.site.phone) { SITE.phone = c.site.phone; SITE.phoneIntl = toIntl(c.site.phone); }
    if (c.site.address) SITE.address = c.site.address;
    if ("googleFormUrl" in c.site) SITE.googleFormUrl = c.site.googleFormUrl || "";
    if ("featuredId" in c.site) SITE.featuredId = c.site.featuredId || "";
  }
  TEXTS = { ...DEFAULT_TEXTS, ...(c.texts || {}) };
  const hero = document.querySelector("[data-hero-img]");
  if (hero && c.heroImage) hero.src = c.heroImage;
  if (Array.isArray(c.products) && c.products.length) {
    PRODUCTS = c.products.map(normalizeProduct);
  }
  if (Array.isArray(c.categories)) {
    CATEGORIES = [{ key: "all", label: "সব পণ্য", labelEn: "All Products" },
                  ...c.categories.map((x) => ({ ...x, labelEn: x.labelEn || "" }))];
  }
}

/** localStorage থেকে কনটেন্ট তোলা — না থাকলে ডিফল্ট (আসল ডাটা) বসে */
function loadContent() {
  let c = null;
  try { c = JSON.parse(localStorage.getItem(LS_CONTENT) || "null"); } catch (e) { c = null; }
  if (c && Array.isArray(c.products) && c.products.length) {
    applyContent(c);
  } else {
    PRODUCTS = DEFAULT_PRODUCTS.map(normalizeProduct);
    CATEGORIES = [{ key: "all", label: "সব পণ্য", labelEn: "All Products" }, ...DEFAULT_CATEGORIES];
    TEXTS = { ...DEFAULT_TEXTS };
  }
}

/** কনটেন্ট সেভ — জায়গা শেষ হলে বাংলা মেসেজ */
function saveContent() {
  try {
    localStorage.setItem(LS_CONTENT, JSON.stringify(snapshot()));
    return true;
  } catch (e) {
    toast(T("toastStorage"));
    return false;
  }
}
const saveContentSoon = debounce(saveContent, 400);

/** ফোন নম্বর / ঠিকানা / নাম ইত্যাদি HTML-এর সব জায়গায় বসানো
    (অঙ্ক ও ঠিকানা চালু ভাষা অনুযায়ী — ইংরেজিতে 0130…, বাংলায় ০১৩০…) */
function applySiteToDOM() {
  document.querySelectorAll('[data-site="tel"]').forEach((a) => { a.href = "tel:+" + SITE.phoneIntl; });
  document.querySelectorAll('[data-site="wa"]').forEach((a) => { a.href = "https://wa.me/" + SITE.phoneIntl; });
  document.querySelectorAll('[data-site="phone-en"]').forEach((e) => { e.textContent = SITE.phone; });
  document.querySelectorAll('[data-site="phone-bn"]').forEach((e) => { e.textContent = num(SITE.phone); });
  document.querySelectorAll('[data-site="address"]').forEach((e) => {
    e.textContent = (LANG === "en" && I18N.addressFixed.en) ? I18N.addressFixed.en : SITE.address;
  });
  document.querySelectorAll('[data-site="name-bn"]').forEach((e) => { e.textContent = SITE.nameBn; });
  document.querySelectorAll('[data-site="name-en"]').forEach((e) => { e.textContent = SITE.nameEn; });
  const gf = document.getElementById("poGoogleForm");
  if (gf && SITE.googleFormUrl) gf.href = SITE.googleFormUrl;
}

/* ============================================================
   ৭) পণ্য দেখানো — কার্ড তৈরি ও গ্রিডে বসানো
   ------------------------------------------------------------
   প্রতিটি কার্ডের নিচে ৩টি বাটন:
     বিস্তারিত   → পণ্যের গল্প/উপকরণ দেখা (দাম নেই)
     প্রি-অর্ডার → ফোন নম্বর + গুগল ফর্ম
     ইন্টারেস্টেড → আগ্রহ জানানোর ফর্ম + রসিদ
   ============================================================ */

/** একটি পণ্যের কার্ডের HTML তৈরি করে (esc দিয়ে নিরাপদ, লেখা চালু ভাষায়) */
function productCardHTML(p) {
  const img = p.image || PLACEHOLDER_IMG;
  const alt = L(p, "altNames");
  return `
  <article class="product-card">
    <div class="product-thumb" onclick="openDetail('${esc(p.id)}')">
      <img src="${esc(img)}" alt="${esc(L(p, "name"))}" loading="lazy">
      <span class="cat-badge">${esc(catLabel(p.category))}</span>
    </div>
    <div class="product-body">
      <h3 class="product-name" onclick="openDetail('${esc(p.id)}')">${esc(L(p, "name"))}</h3>
      ${alt.length ? `<p class="alt-names">${T("alsoKnown")} ${esc(alt.join(", "))}</p>` : ""}
      <p class="product-short">${esc(L(p, "short"))}</p>
      <div class="product-foot">
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="openDetail('${esc(p.id)}')">${T("detailsBtn")}</button>
          <button class="btn btn-primary btn-sm" onclick="openPreOrder('${esc(p.id)}')">${T("preOrderShort")}</button>
          <button class="btn btn-green btn-sm" onclick="openInterested('${esc(p.id)}')">${T("interestedShort")}</button>
        </div>
      </div>
    </div>
  </article>`;
}

/** ক্যাটাগরি কোড থেকে নাম — চালু ভাষা অনুযায়ী (ইংরেজিতে labelEn) */
function catLabel(key) {
  const c = CATEGORIES.find((c) => c.key === key);
  if (!c) return key;
  return (LANG === "en" && c.labelEn) ? c.labelEn : c.label;
}

/** সব পণ্য গ্রিডে বসানো (ফিল্টার অনুযায়ী) */
let activeCat = "all"; // এখন কোন ক্যাটাগরি সিলেক্ট করা আছে
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat);
  grid.innerHTML = list.map(productCardHTML).join("");
  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#8a6b4f;padding:30px 0;">${T("emptyCat")}</p>`;
  }
}

/** ফিল্টার বাটন তৈরি ও ক্লিক হ্যান্ডলার */
function setupFilters() {
  const bar = document.getElementById("filterBar");
  bar.innerHTML = CATEGORIES.map((c) =>
    `<button class="filter-chip${c.key === activeCat ? " active" : ""}" data-cat="${esc(c.key)}">${esc(catLabel(c.key))}</button>`
  ).join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    bar.querySelectorAll(".filter-chip").forEach((b) => b.classList.toggle("active", b === btn));
    renderProducts();
  });
}

/* ============================================================
   ৮) হোমপেজের বিশেষ পণ্য অংশ (মিলি/মিলানি)
   ------------------------------------------------------------
   সাইট সেটিংসে যে পণ্য "বিশেষ পণ্য" দেওয়া আছে সেটা এখানে বড় করে
   দেখানো হয়। পণ্যটি মুছে ফেললে বা "নেই" দিলে পুরো অংশটি লুকায়।
   ============================================================ */
function renderMilaniFeature() {
  const box = document.getElementById("milaniSection");
  const section = document.getElementById("milani");
  const navLink = document.querySelector('.main-nav a[href="#milani"]');
  const p = PRODUCTS.find((x) => x.id === SITE.featuredId);
  if (!p) {
    box.innerHTML = "";
    if (section) section.classList.add("hidden-section");
    if (navLink) navLink.style.display = "none";
    return;
  }
  if (section) section.classList.remove("hidden-section");
  if (navLink) navLink.style.display = "";
  const banner = p.gallery[0] || p.image || PLACEHOLDER_IMG;
  box.innerHTML = `
    <div class="milani-grid">
      <div class="milani-photo">
        <img src="${esc(banner)}" alt="${esc(L(p, "name"))}">
        <span class="milani-tag" data-edit="milaniTag" data-label="বিশেষ অংশের ছোট ট্যাগ">${esc(EDT("milaniTag") || "")}</span>
      </div>
      <div class="milani-info">
        <p class="overline" data-edit="milaniOverline" data-label="বিশেষ অংশের ওপরের ছোট লেখা">${esc(EDT("milaniOverline") || "")}</p>
        <h2>${esc(L(p, "name"))} <span class="milani-alt" data-edit="milaniAlt" data-label="বিশেষ অংশের পাশের নাম">${esc(EDT("milaniAlt") || "")}</span></h2>
        <div class="alt-chips">${L(p, "altNames").map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</div>
        <p class="milani-history">${esc(L(p, "history"))}</p>
        <h4 class="ing-title" data-edit="milaniIngTitle" data-label="বিশেষ অংশে উপকরণের শিরোনাম">${esc(EDT("milaniIngTitle") || "")}</h4>
        <ul class="ing-list">${L(p, "ingredients").map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        <div class="milani-cta">
          <button class="btn btn-primary" onclick="openPreOrder('${esc(p.id)}')">${T("preOrderBtn")}</button>
          <button class="btn btn-green" onclick="openInterested('${esc(p.id)}')">${T("interestedBtn")}</button>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   ৯) পরিমাণ স্টেপার (− ১ +) — ইন্টারেস্টেড ফর্মে ব্যবহৃত হয়
   ============================================================ */
function setupStepper(root, displayEl) {
  displayEl.dataset.val = displayEl.dataset.val || "1";
  const paint = () => { displayEl.textContent = num(displayEl.dataset.val); };
  paint();
  root.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-step]");
    if (!b) return;
    let v = parseInt(displayEl.dataset.val, 10) + Number(b.dataset.step);
    v = Math.min(99, Math.max(1, v)); // ১ থেকে ৯৯ এর মধ্যে রাখা
    displayEl.dataset.val = String(v);
    paint();
  });
}

/* ============================================================
   ১০) পণ্য বিস্তারিত পপআপ (মডাল) — দাম ছাড়া
   ============================================================ */
function openDetail(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;

  // ছবি গ্যালারি: মূল ছবি + থাম্বনেইল (একাধিক ছবি থাকলে)
  const gal = [p.image || PLACEHOLDER_IMG].concat(p.gallery || []);
  document.getElementById("dMainImg").src = gal[0];
  document.getElementById("dMainImg").alt = p.name;
  document.getElementById("dThumbs").innerHTML = gal.length > 1
    ? gal.map((src, i) => `<img src="${esc(src)}" class="thumb${i === 0 ? " active" : ""}" data-src="${esc(src)}" alt="ছবি ${i + 1}">`).join("")
    : "";

  // লেখা অংশ (দাম দেখানো হয় না) — চালু ভাষায়
  document.getElementById("dCat").textContent = catLabel(p.category);
  document.getElementById("dName").textContent = L(p, "name");
  document.getElementById("dAltRow").style.display = L(p, "altNames").length ? "" : "none";
  document.getElementById("dAlt").textContent = L(p, "altNames").join(", ");
  document.getElementById("dHistory").textContent = L(p, "history");
  document.getElementById("dIngList").innerHTML = L(p, "ingredients").map((i) => `<li>${esc(i)}</li>`).join("");

  // নিচের বাটন: প্রি-অর্ডার + ইন্টারেস্টেড + ফোন
  document.getElementById("dActions").innerHTML = `
    <button class="btn btn-primary" onclick="openPreOrder('${esc(p.id)}')">${T("preOrderBtn")}</button>
    <button class="btn btn-green" onclick="openInterested('${esc(p.id)}')">${T("interestedBtn")}</button>
    <a class="btn btn-outline" href="tel:+${esc(SITE.phoneIntl)}">${T("callBtn")}</a>`;

  openModal("detailModal");
}

/** বিস্তারিত মডালের থাম্বনেইলে ক্লিক করলে মূল ছবি বদলায় (ইভেন্ট ডেলিগেশন) */
document.addEventListener("click", (e) => {
  const th = e.target.closest("#dThumbs .thumb");
  if (th) {
    document.getElementById("dMainImg").src = th.dataset.src;
    document.querySelectorAll("#dThumbs .thumb").forEach((t) => t.classList.toggle("active", t === th));
  }
});

/* ============================================================
   ১১) মডাল খোলা/বন্ধ করার সাধারণ ফাংশন
   ============================================================ */
function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.body.style.overflow = "hidden"; // পেছনের পেজ স্ক্রল বন্ধ
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.style.overflow = "";
}
// ব্যাকড্রপে ক্লিক করলে বন্ধ + Esc চাপলে বন্ধ
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) closeModal(e.target.id);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal-backdrop.open").forEach((m) => closeModal(m.id));
});

/* ============================================================
   ১২) প্রি-অর্ডার পপআপ
   ------------------------------------------------------------
   নির্দেশনা দেখায়: "প্রি অর্ডার করতে চাইলে সরাসরি ০১৩০৪৫৪২২০৪
   এই নাম্বারে যোগাযোগ করুন।"
   সাথে ফোন/হোয়াটসঅ্যাপ বাটন এবং গুগল ফর্মের লিংক —
   গুগল ফর্ম ওয়েবসাইটের বাইরে নতুন ট্যাবে (target="_blank") খোলে।
   ============================================================ */
let preProduct = null; // কোন পণ্য প্রি-অর্ডার করা হবে

function openPreOrder(id) {
  preProduct = PRODUCTS.find((x) => x.id === id);
  if (!preProduct) return;

  // পণ্যের নাম ও একক বসানো (চালু ভাষায়)
  document.getElementById("poName").textContent = L(preProduct, "name");
  document.getElementById("poUnit").textContent = L(preProduct, "unit") || "প্রতি পিস";

  // হোয়াটসঅ্যাপ মেসেজে পণ্যের নাম বসিয়ে লিংক তৈরি (চালু ভাষায়)
  const msg = (LANG === "en")
    ? `Assalamu alaikum. I would like to pre-order "${L(preProduct, "name")}".`
    : `আসসালামু আলাইকুম। আমি "${preProduct.name}" পণ্যটি প্রি-অর্ডার করতে চাই।`;
  document.getElementById("poWhatsapp").href =
    `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(msg)}`;

  // গুগল ফর্মের লিংক (সেটিংস থেকে নেওয়া — নতুন ট্যাবে খোলে)
  document.getElementById("poGoogleForm").href = SITE.googleFormUrl;

  // বিস্তারিত মডাল খোলা থাকলে সেটি বন্ধ করা
  closeModal("detailModal");
  openModal("preOrderModal");
}

/* ============================================================
   ১৩) ইন্টারেস্টেড (আগ্রহ) ফর্ম
   ------------------------------------------------------------
   নাম ও মোবাইল নম্বর (বাধ্যতামূলক) নিয়ে + ছাত্র আইডি (ঐচ্ছিক —
   না দিলেও হবে) + কাঙ্ক্ষিত পরিমাণ নির্বাচন করে আগ্রহ জানানো হয়।
   জমা দিলে আগ্রহের রসিদ তৈরি হয় (নিচের অংশে)।
   ============================================================ */
let interestProduct = null; // কোন পণ্যে আগ্রহ

function openInterested(id) {
  interestProduct = PRODUCTS.find((x) => x.id === id);
  if (!interestProduct) return;

  document.getElementById("iName").textContent = L(interestProduct, "name");
  document.getElementById("iUnit").textContent = L(interestProduct, "unit") || "প্রতি পিস";

  // পুরোনো লেখা মুছে ফেলা + পরিমাণ ১-এ ফেরানো
  document.getElementById("iForm").reset();
  document.getElementById("iError").textContent = "";
  const q = document.getElementById("iQty");
  q.dataset.val = "1";
  q.textContent = toBn("1");

  closeModal("detailModal"); // বিস্তারিত থেকে এলে সেটা বন্ধ
  openModal("interestModal");
}

// ইন্টারেস্টেড ফর্মের স্টেপার চালু করা (পেজ লোডের সময় একবার)
function setupInterestStepper() {
  setupStepper(document.getElementById("iStepper"), document.getElementById("iQty"));
}

/** মোবাইল নম্বর ঠিক করা: +880 / 880 দিয়ে শুরু হলে 0 ফরম্যাটে আনা */
function normalizePhone(raw) {
  let phone = raw.trim().replace(/[\s-]/g, "");
  if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
  else if (phone.startsWith("880")) phone = "0" + phone.slice(3);
  return phone;
}

/** ফর্ম জমা দেওয়া — যাচাই → সেভ → রসিদ দেখানো */
document.addEventListener("submit", (e) => {
  if (e.target.id !== "iForm") return;
  e.preventDefault(); // ব্রাউজারের সাধারণ সাবমিট থামানো (পেজ রিলোড যাবে না)

  const errEl = document.getElementById("iError");
  const name = document.getElementById("iUserName").value.trim();
  const phone = normalizePhone(document.getElementById("iUserPhone").value);
  const studentId = document.getElementById("iStudentId").value.trim();
  const qty = parseInt(document.getElementById("iQty").dataset.val || "1", 10);

  /* ---- যাচাই: নাম ও মোবাইল বাধ্যতামূলক; ছাত্র আইডি ঐচ্ছিক (দিলে ২ অক্ষরের বেশি হতে হবে) ---- */
  let err = "";
  if (name.length < 2) err = T("errName");
  else if (!/^01[3-9]\d{8}$/.test(phone)) err = T("errPhone");
  else if (studentId && studentId.length < 2) err = T("errStudent");
  if (err) { errEl.textContent = err; return; }

  /* ---- আগ্রহের রেকর্ড তৈরি ও সেভ ---- */
  const interest = createInterest({ name, phone, studentId, qty });
  saveInterest(interest);

  /* ---- ফর্ম বন্ধ করে রসিদ দেখানো ---- */
  closeModal("interestModal");
  showReceipt(interest);
  toast(T("toastInterestOk"));
});

/* ============================================================
   ১৪) রসিদ নম্বর ও সেভ ব্যবস্থা (localStorage)
   ------------------------------------------------------------
   রসিদ নম্বর হয়: INT-২০২৬১১১৫-০০১ (তারিখ + সেই দিনের ক্রম)
   localStorage = ব্রাউজারের নিজের স্টোরেজ — নেট ছাড়াও কাজ করে।
   ============================================================ */
const LS_KEY = "jph_interests"; // localStorage-এ আগ্রহ যে নামে জমা হয়

function getInterests() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function createInterest(info) {
  const list = getInterests();
  const today = new Date();
  const ymd = today.getFullYear() + String(today.getMonth() + 1).padStart(2, "0") +
              String(today.getDate()).padStart(2, "0");
  // আজকের আগ্রহ কয়টা আছে গুনে পরের ক্রম নম্বর
  const seq = list.filter((x) => x.date.startsWith(ymd)).length + 1;
  return {
    no: "INT-" + ymd + "-" + String(seq).padStart(3, "0"),
    date: today.toISOString(),
    productId: interestProduct.id,
    productName: interestProduct.name,
    unit: interestProduct.unit || "প্রতি পিস",
    qty: info.qty,
    name: info.name, phone: info.phone, studentId: info.studentId,
  };
}

function saveInterest(interest) {
  const list = getInterests();
  list.push(interest);
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
  catch (e) { /* স্টোরেজ ভরা থাকলেও রসিদ তো দেখানোই হবে */ }
}

/* ============================================================
   ১২) আগ্রহের রসিদ — প্রিভিউ + ছবি (PNG) ডাউনলোড + হোয়াটসঅ্যাপ
   ------------------------------------------------------------
   রসিদ দুইভাবে দেখা যায়:
     ক) স্ক্রিনে: rPaper নামের HTML অংশে (index.html-এ)
     খ) ছবি হিসেবে: Canvas-এ এঁকে PNG ডাউনলোড (ছবি আকারে ডাউনলোড)
   ============================================================ */
let currentReceipt = null; // এখন যে রসিদ দেখা হচ্ছে

/** রসিদে দেখানোর জন্য পণ্যের নাম — চালু ভাষায় (ইংরেজি থাকলে nameEn) */
function receiptProductName(r) {
  const p = PRODUCTS.find((x) => x.id === r.productId);
  return p ? L(p, "name") : r.productName;
}

/** রসিদে দেখানোর জন্য একক — চালু ভাষায় */
function receiptProductUnit(r) {
  const p = PRODUCTS.find((x) => x.id === r.productId);
  if (p) return L(p, "unit") || r.unit;
  return r.unit;
}

/** রসিদের নিচের নোট (ফোন নম্বর চালু ভাষার অঙ্কে বসানো) */
function paintReceiptStaticTexts() {
  const info = document.getElementById("rInfo");
  if (info) info.textContent = Tf("rcptNote");
}

/** রসিদ মডালে আগ্রহের তথ্য বসিয়ে দেখানো (ছাত্র আইডি না দিলে সারিটি লুকায়) */
function showReceipt(r) {
  currentReceipt = r;
  document.getElementById("rOrderNo").textContent = num(r.no);
  document.getElementById("rDate").textContent = fmtDate(new Date(r.date));
  document.getElementById("rName").textContent = r.name;
  document.getElementById("rPhone").textContent = num(r.phone);
  const stRow = document.getElementById("rStudentRow");
  if (stRow) stRow.style.display = r.studentId ? "" : "none";
  document.getElementById("rStudent").textContent = r.studentId || "—";
  document.getElementById("rProduct").textContent = receiptProductName(r);
  document.getElementById("rQty").textContent = num(r.qty) + " × " + receiptProductUnit(r);
  paintReceiptStaticTexts();
  openModal("receiptModal");
}

/* ---- ছবি আঁকার সাহায্যকারী ---- */

/** লম্বা লেখা একাধিক লাইনে ভাগ করা (canvas-এ মাপে মাপে রাখার জন্য) */
function wrapText(ctx, text, maxW) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxW || !line) line = test;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * রসিদের ছবি Canvas-এ আঁকা → PNG
 * ------------------------------------------------------------
 * ধাপ: ব্রাউজারের বাংলা ফন্ট লোড হওয়া পর্যন্ত অপেক্ষা →
 * সাদা কাগজ + টেরাকোটা বর্ডার → হেডার → শিরোনাম → তথ্যের সারি →
 * পণ্যের বাক্স → নোট → ধন্যবাদ। ছবি যেন ঝকঝকে দেখায় তাই
 * আসল সাইজের ২ গুণ (retina scale) করে আঁকা হয়।
 */
async function buildReceiptCanvas(r) {
  await document.fonts.ready; // বাংলা ফন্ট প্রস্তুত না হলে অক্ষর ভাঙা দেখাবে

  const S = 2;        // বাড়তি শার্পনেসের জন্য স্কেল
  const W = 720;      // রসিদের প্রস্থ (লজিক্যাল পিক্সেল)
  const M = 46;       // বাম-ডান মার্জিন
  const IW = W - M * 2; // ভেতরের লেখার চওড়া অংশ

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");

  // ক্যানভাসে লেখার জন্য ফন্ট সংজ্ঞা
  const bodyFont = (weight, size) => `${weight} ${size}px "Hind Siliguri", sans-serif`;
  const titleFont = (weight, size) => `${weight} ${size}px "Noto Serif Bengali", serif`;

  /* ---- আগে সব লেখার লাইন মেপে মোট উচ্চতা হিসাব করা ---- */
  ctx.font = bodyFont(500, 16);
  const infoLines = wrapText(ctx, Tf("rcptNote"), IW - 28);
  ctx.font = bodyFont(600, 16);
  const productLines = wrapText(ctx, receiptProductName(r), IW - 110);
  const qtyLine = num(r.qty) + " × " + receiptProductUnit(r);

  // সারিগুলোর তালিকা: {label, value} বা {sep: true} = ড্যাশ লাইন
  // ছাত্র আইডি ঐচ্ছিক — না দিলে রসিদে সারিটি আসে না
  const rows = [
    { label: T("rcptNo"),    value: num(r.no) },
    { label: T("rcptDate"),  value: fmtDate(new Date(r.date)) },
    { sep: true },
    { label: T("rcptName"),   value: r.name },
    { label: T("rcptMobile"), value: num(r.phone) },
  ];
  if (r.studentId) rows.push({ label: T("rcptStudent"), value: r.studentId });
  rows.push({ sep: true });
  // লম্বা ভ্যালু (নাম/আইডি) কয় লাইনে আসবে মেপে নেওয়া
  ctx.font = bodyFont(600, 15.5);
  const valueLineCounts = rows.map((row) => {
    if (row.sep || !row.value) return 1;
    return wrapText(ctx, row.value, IW - 210).length;
  });

  const ROW_H = 27;            // এক সারির উচ্চতা
  const SEP_H = 18;            // ড্যাশ লাইনের উচ্চতা
  // সারিগুলোর মোট উচ্চতা
  let rowsH = 0;
  rows.forEach((row, i) => { rowsH += row.sep ? SEP_H : ROW_H * valueLineCounts[i]; });
  const itemBoxH = 30 + productLines.length * 26 + 22;  // পণ্যের বাক্সের উচ্চতা
  const noteBoxH = 24 + infoLines.length * 23;          // নোটের বাক্সের উচ্চতা
  // মোট উচ্চতা: হেডার+পিল (২১০) + সারি + পণ্যের বাক্স + নোট + ধন্যবাদ + নিচের লাইন
  const totalH = Math.round(210 + rowsH + 6 + itemBoxH + 10 + noteBoxH + 14 + 40 + 40);

  // ক্যানভাসের আসল সাইজ (২ গুণ) — স্ক্রিনে দেখার সাইজ CSS দিয়ে ঠিক করা হয়
  c.width = W * S;
  c.height = totalH * S;
  ctx.scale(S, S);

  /* ---- এবার আঁকা শুরু ---- */

  // সাদা কাগজ
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, totalH);

  // চারপাশে টেরাকোটা বর্ডার (গোল কোণা)
  ctx.strokeStyle = "#b04e26";
  ctx.lineWidth = 3;
  const B = 12; // বর্ডারের ফাঁক
  roundRect(ctx, B, B, W - B * 2, totalH - B * 2, 16);
  ctx.stroke();

  let y = 56; // লেখার y-অবস্থান (খাতার মতো নিচে নামবে)

  /* হেডার */
  ctx.textAlign = "center";
  ctx.fillStyle = "#b04e26";
  ctx.font = titleFont(800, 28);
  ctx.fillText(SITE.nameBn, W / 2, y); y += 26;
  ctx.fillStyle = "#6b4a2e";
  ctx.font = bodyFont(500, 14);
  ctx.fillText(SITE.nameEn, W / 2, y); y += 22;
  ctx.font = bodyFont(400, 12.5);
  ctx.fillText((LANG === "en" && I18N.addressFixed.en ? I18N.addressFixed.en : SITE.address)
    + " · " + T("phonePrefix") + " " + num(SITE.phone), W / 2, y); y += 14;

  // ডাবল লাইন (হেডারের নিচে)
  ctx.strokeStyle = "#b04e26";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(M, y); ctx.lineTo(W - M, y); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(M, y + 4); ctx.lineTo(W - M, y + 4); ctx.stroke();
  y += 34;

  /* শিরোনামের পিল: "আগ্রহের রসিদ / INTEREST RECEIPT" */
  const pillText = "আগ্রহের রসিদ / INTEREST RECEIPT";
  ctx.font = bodyFont(600, 15);
  const pw = ctx.measureText(pillText).width + 36;
  ctx.fillStyle = "#b04e26";
  roundRect(ctx, (W - pw) / 2, y, pw, 34, 8);
  ctx.fill();
  ctx.fillStyle = "#fff7ec";
  ctx.fillText(pillText, W / 2, y + 23);
  y += 58;

  /* তথ্যের সারি: লেবেল বামে, ভ্যালু ডানে */
  rows.forEach((row, i) => {
    if (row.sep) {
      dashedLine(ctx, M, y + 6, W - M, y + 6);
      y += SEP_H;
      return;
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "#6b4a2e";
    ctx.font = bodyFont(400, 14.5);
    ctx.fillText(row.label, M, y);
    // লম্বা ভ্যালু একাধিক লাইনে ডানে সাজানো
    ctx.textAlign = "right";
    ctx.fillStyle = "#3b2a1d";
    ctx.font = bodyFont(600, 15.5);
    const lines = wrapText(ctx, row.value, IW - 210);
    lines.forEach((ln, k) => ctx.fillText(ln, W - M, y + k * ROW_H));
    y += ROW_H * lines.length;
  });
  y += 6;

  /* পণ্যের বাক্স */
  ctx.fillStyle = "#f3e3cb";
  roundRect(ctx, M, y, IW, itemBoxH, 10);
  ctx.fill();
  let iy = y + 30;
  ctx.textAlign = "left";
  ctx.fillStyle = "#6b4a2e";
  ctx.font = bodyFont(400, 14.5);
  ctx.fillText(T("rcptProduct"), M + 16, iy);
  ctx.fillStyle = "#b04e26";
  ctx.font = bodyFont(600, 16);
  productLines.forEach((ln, k) => ctx.fillText(ln, M + 92, iy + k * 26));
  iy += productLines.length * 26;
  ctx.fillStyle = "#6b4a2e";
  ctx.font = bodyFont(400, 14.5);
  ctx.fillText(T("rcptQty"), M + 16, iy);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = bodyFont(600, 16);
  ctx.fillText(qtyLine, M + 92, iy);
  y += itemBoxH + 10;

  /* নোটের বাক্স (ড্যাশ বর্ডার) */
  ctx.strokeStyle = "#b04e26";
  ctx.setLineDash([6, 4]);
  ctx.lineWidth = 1.5;
  roundRect(ctx, M, y, IW, noteBoxH, 10);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#6b4a2e";
  ctx.font = bodyFont(400, 13.5);
  ctx.textAlign = "left";
  let ny = y + 26;
  infoLines.forEach((ln) => { ctx.fillText(ln, M + 14, ny); ny += 23; });
  y += noteBoxH + 14;

  /* ধন্যবাদ */
  ctx.textAlign = "center";
  ctx.fillStyle = "#4a6b4e";
  ctx.font = bodyFont(700, 15.5);
  ctx.fillText(T("rcptThanks"), W / 2, y + 26);
  y += 40;

  /* নিচের ছোট লাইন */
  ctx.fillStyle = "#8a6b4f";
  ctx.font = bodyFont(400, 12);
  ctx.fillText(SITE.nameBn + " · " + SITE.nameEn, W / 2, y + 18);

  return c;
}

/** গোল কোণার আয়ত আঁকার ছোট ফাংশন (canvas-এ সরাসরি নেই) */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** ড্যাশ (ফাঁকা) লাইন আঁকা */
function dashedLine(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = "#e8d6bc";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** "ছবি হিসেবে ডাউনলোড" বাটন — রসিদটাকে PNG ছবি বানিয়ে সেভ করা */
function downloadReceiptImage() {
  if (!currentReceipt) return;
  buildReceiptCanvas(currentReceipt).then((canvas) => {
    // canvas → dataURL (PNG ছবির লিংক) → ডাউনলোড
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "receipt-" + currentReceipt.no + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(T("toastReceiptDl"));
  });
}

/** "হোয়াটসঅ্যাপে পাঠান" বাটন — রসিদের হিসাবসহ মেসেজ খোলা
 *  ছবিটি আগে ডাউনলোড করে হোয়াটসঅ্যাপে মেসেজের সাথে সংযুক্ত (attach) করতে হবে। */
function sendReceiptWhatsapp() {
  if (!currentReceipt) return;
  const r = currentReceipt;
  const lines = (LANG === "en") ? [
    "Assalamu alaikum — Interested (interest confirmation)",
    "Receipt No: " + r.no,
    "Product: " + receiptProductName(r),
    "Quantity: " + r.qty + " (" + receiptProductUnit(r) + ")",
    "Name: " + r.name,
    "Mobile: " + r.phone,
  ] : [
    "আসসালামু আলাইকুম — ইন্টারেস্টেড (আগ্রহ জানানো)",
    "রসিদ নং: " + r.no,
    "পণ্য: " + receiptProductName(r),
    "পরিমাণ: " + r.qty + " (" + r.unit + ")",
    "নাম: " + r.name,
    "মোবাইল: " + r.phone,
  ];
  // ছাত্র আইডি দেওয়া থাকলে তবেই মেসেজে যাবে (ঐচ্ছিক)
  if (r.studentId) lines.splice(6, 0, (LANG === "en" ? "Student ID: " : "ছাত্র আইডি: ") + r.studentId);
  lines.push(LANG === "en" ? "I am sending the receipt image with this message." : "রসিদের ছবিটি সাথে পাঠাচ্ছি।");
  window.open(`https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}

/* ============================================================
   ১৬) অ্যাডমিন প্যানেল — পিন ৭৮৯৪৫৬ দিয়ে সম্পূর্ণ নিয়ন্ত্রণ
   ------------------------------------------------------------
   ফুটারের "অ্যাডমিন" বাটনে চাপলে পিন জানতে চায়।
   পিন দিলে ৬টি ট্যাব:
     পণ্য        → যোগ / এডিট / মুছুন / ওপরে-নিচে সাজানো (ছবি আপলোডসহ)
     সেকশন       → ক্যাটাগরি যোগ / এডিট / মুছুন
     হোমপেজের লেখা → পেজের সব লেখা + হিরো ছবি বদলানো
     সাইট সেটিংস  → দোকানের নাম, ফোন, ঠিকানা, গুগল ফর্ম, বিশেষ পণ্য
     আগ্রহীরা     → আগ্রহের তালিকা, হোয়াটসঅ্যাপ, মুছুন, CSV
     ব্যাকআপ      → JSON ডাউনলোড / ফিরিয়ে আনা / ডিফল্টে রিসেট
   সব পরিবর্তন সঙ্গে সঙ্গে এই ব্রাউজারে সেভ হয়।
   ============================================================ */

const A_OK = "jph_admin_ok"; // এই ভিজিটে লগইন করা আছে কি না (sessionStorage)

/** ফুটারের অ্যাডমিন বাটন → পিন জানানো বা সরাসরি প্যানেল */
function openAdmin() {
  document.getElementById("aLogin").style.display = "";
  document.getElementById("aPanel").style.display = "none";
  document.getElementById("aPin").value = "";
  document.getElementById("aLoginErr").textContent = "";
  openModal("adminModal");
  if (sessionStorage.getItem(A_OK) === "1") adminEnter();
  else setTimeout(() => document.getElementById("aPin").focus(), 100);
}

/** পিন মিলিয়ে দেখা — ★ পিন: ৭৮৯৪৫৬ (সবসময় এটাই) */
function adminLogin() {
  const pin = document.getElementById("aPin").value.trim();
  if (pin === SITE.adminPin) {
    try { sessionStorage.setItem(A_OK, "1"); } catch (e) {}
    adminEnter();
  } else {
    document.getElementById("aLoginErr").textContent = "পিন ভুল — আবার চেষ্টা করুন।";
  }
}

/** লগইন হলে প্যানেল দেখানো + সব ট্যাব আঁকা */
function adminEnter() {
  document.getElementById("aLogin").style.display = "none";
  document.getElementById("aPanel").style.display = "";
  renderProductsTab();
  renderCatsTab();
  renderTextsTab();
  renderSiteTab();
  renderAdminTable();
  renderBackupTab();
  showTab("products");
}

/** লগআউট — আবার পিন চাইবে */
function adminLogout() {
  try { sessionStorage.removeItem(A_OK); } catch (e) {}
  closeModal("adminModal");
  toast("অ্যাডমিন থেকে বের হয়েছেন");
}

/** ট্যাব বদলানো */
function showTab(name) {
  document.querySelectorAll("#aTabs .atab").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".atab-body").forEach((d) => { d.style.display = d.id === "tab-" + name ? "" : "none"; });
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("#aTabs .atab[data-tab]");
  if (b) showTab(b.dataset.tab);
});

/* ------------------------------------------------------------
   ট্যাব ১: পণ্য — তালিকা + সাজানো + মুছুন
   ------------------------------------------------------------ */
function renderProductsTab() {
  const box = document.getElementById("tab-products");
  const rows = PRODUCTS.map((p, i) => `
    <div class="prow">
      <img src="${esc(p.image || PLACEHOLDER_IMG)}" alt="">
      <div class="pinfo">
        <b>${esc(p.name)}</b>
        <small>${esc(catLabel(p.category))}${p.unit ? " · " + esc(p.unit) : ""} · ছবি: ${(p.gallery || []).length ? toBn((p.gallery || []).length + 1) : "১"}টি</small>
      </div>
      <div class="pbtns">
        <button class="btn btn-ghost btn-sm" title="ওপরে সরান" onclick="pMove(${i},-1)">↑</button>
        <button class="btn btn-ghost btn-sm" title="নিচে সরান" onclick="pMove(${i},1)">↓</button>
        <button class="btn btn-outline btn-sm" onclick="pEdit('${esc(p.id)}')">এডিট</button>
        <button class="btn btn-danger btn-sm" onclick="pDelete('${esc(p.id)}')">মুছুন</button>
      </div>
    </div>`).join("");
  box.innerHTML = `
    <div class="admin-bar">
      <span>মোট পণ্য: ${toBn(PRODUCTS.length)}টি</span>
      <button class="btn btn-primary btn-sm" onclick="pNew()">＋ নতুন পণ্য যোগ করুন</button>
    </div>
    <div class="plist">${rows}</div>
    <p class="form-hint" style="text-align:left">↑ ↓ দিয়ে পণ্যের ক্রম বদলান — ওয়েবসাইটে সেই ক্রমেই দেখাবে। সব পরিবর্তন সঙ্গে সঙ্গে সেভ হয়।</p>`;
}

/** পণ্য ওপরে/নিচে সরানো */
function pMove(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= PRODUCTS.length) return;
  [PRODUCTS[i], PRODUCTS[j]] = [PRODUCTS[j], PRODUCTS[i]];
  saveContent(); renderProducts(); renderProductsTab();
}

/** পণ্য মুছে ফেলা */
function pDelete(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const isFeat = SITE.featuredId === id ? "\n\nখেয়াল রাখুন: এটি হোমপেজের বিশেষ পণ্য — মুছলে হোমপেজের বিশেষ অংশটি লুকিয়ে যাবে।" : "";
  if (!confirm("“" + p.name + "” পণ্যটি মুছে ফেলবেন?" + isFeat)) return;
  PRODUCTS.splice(PRODUCTS.indexOf(p), 1);
  if (SITE.featuredId === id) SITE.featuredId = "";
  saveContent(); renderProducts(); renderMilaniFeature(); renderProductsTab();
  toast("পণ্যটি মুছে ফেলা হয়েছে");
}

/** পণ্য এডিট/নতুন ফর্মের কাজের কপি */
let formDraft = null;
let formIsNew = false;

function pNew() {
  formIsNew = true;
  const firstCat = CATEGORIES.find((c) => c.key !== "all");
  formDraft = normalizeProduct({
    id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    category: firstCat ? firstCat.key : "food",
    unit: "প্রতি পিস", image: "", gallery: [],
  });
  renderProductForm();
}

function pEdit(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  formIsNew = false;
  formDraft = JSON.parse(JSON.stringify(p));
  renderProductForm();
}

/** পণ্যের ফর্ম (নতুন/এডিট দুটোতেই একই ফর্ম) */
function renderProductForm() {
  const p = formDraft;
  const catOpts = CATEGORIES.filter((c) => c.key !== "all")
    .map((c) => `<option value="${esc(c.key)}" ${p.category === c.key ? "selected" : ""}>${esc(c.label)}</option>`).join("");
  document.getElementById("tab-products").innerHTML = `
    <h3 class="pf-title">${formIsNew ? "নতুন পণ্য যোগ করুন" : "পণ্য এডিট: " + esc(p.name)}</h3>
    <div class="pf-grid">
      <label class="field"><span>পণ্যের নাম *</span><input id="pf-name" value="${esc(p.name)}"></label>
      <label class="field"><span>প্রচলিত অন্য নাম (কমা দিয়ে আলাদা করুন)</span><input id="pf-alt" value="${esc(p.altNames.join(", "))}"></label>
      <label class="field"><span>সেকশন / ক্যাটাগরি</span><select id="pf-cat">${catOpts}</select></label>
      <label class="field"><span>পরিমাণের একক (রসিদে দেখায়)</span><input id="pf-unit" value="${esc(p.unit)}"></label>
    </div>
    <label class="field"><span>কার্ডে দেখানোর ছোট বিবরণ (১–২ লাইন)</span><textarea id="pf-short" rows="2">${esc(p.short)}</textarea></label>
    <label class="field"><span>ঐতিহ্য / ইতিহাসের গল্প</span><textarea id="pf-history" rows="5">${esc(p.history)}</textarea></label>
    <label class="field"><span>উপকরণ (প্রতি লাইনে একটি)</span><textarea id="pf-ing" rows="4">${esc(p.ingredients.join("\n"))}</textarea></label>
    <div id="pf-images"></div>
    <p class="form-error" id="pf-err"></p>
    <div class="pf-actions">
      <button class="btn btn-primary" onclick="pSave()">সংরক্ষণ করুন</button>
      <button class="btn btn-ghost" onclick="pCancel()">বাতিল</button>
    </div>`;
  renderPfImages();
}

/** ফর্মের ছবি অংশ: মূল ছবি + অতিরিক্ত গ্যালারি */
function renderPfImages() {
  const p = formDraft;
  const gal = (p.gallery || []).map((src, i) => `
    <div class="gthumb"><img src="${esc(src)}" alt=""><button type="button" title="সরান" onclick="pfRemoveGal(${i})">✕</button></div>`).join("");
  document.getElementById("pf-images").innerHTML = `
    <div class="pf-imgblock">
      <span class="lbl">মূল ছবি (কার্ডে দেখায়) — ছবি না দিলে ডিফল্ট ছবি বসবে</span>
      <div class="pf-main">
        <img src="${esc(p.image || PLACEHOLDER_IMG)}" alt="">
        <label class="btn btn-outline btn-sm filebtn">ছবি বাছাই করুন
          <input type="file" accept="image/*" id="pf-main-file" hidden>
        </label>
      </div>
    </div>
    <div class="pf-imgblock">
      <span class="lbl">অতিরিক্ত ছবি (বিস্তারিত পপআপে দেখায়)</span>
      <div class="gal-row">${gal}</div>
      <label class="btn btn-outline btn-sm filebtn">＋ আরও ছবি যোগ করুন
        <input type="file" accept="image/*" multiple id="pf-gal-file" hidden>
      </label>
    </div>`;
  document.getElementById("pf-main-file").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { formDraft.image = await fileToDataURL(f, 1200); keepTyped(); renderPfImages(); }
    catch (err) { toast(err.message); }
  };
  document.getElementById("pf-gal-file").onchange = async (e) => {
    for (const f of e.target.files) {
      try { formDraft.gallery.push(await fileToDataURL(f, 1200)); } catch (err) { toast(err.message); }
    }
    keepTyped(); renderPfImages();
  };
}

function pfRemoveGal(i) { keepTyped(); formDraft.gallery.splice(i, 1); renderPfImages(); }

/** ছবি বদলানোর আগে ফর্মে লেখা তথ্য formDraft-এ রেখে দেওয়া */
function keepTyped() {
  const g = (id) => { const el = document.getElementById(id); return el ? el.value : ""; };
  const p = formDraft;
  if (!p) return;
  p.name = g("pf-name"); p.altNames = g("pf-alt").split(/[,،]/).map((x) => x.trim()).filter(Boolean);
  p.category = g("pf-cat") || p.category; p.unit = g("pf-unit");
  p.short = g("pf-short"); p.history = g("pf-history");
  p.ingredients = g("pf-ing").split("\n").map((x) => x.trim()).filter(Boolean);
}

/** ফর্ম সেভ — যাচাই → PRODUCTS-এ ঢোকানো → সাইট রিফ্রেশ */
function pSave() {
  keepTyped();
  const p = formDraft;
  const err = document.getElementById("pf-err");
  if (p.name.trim().length < 2) { err.textContent = "পণ্যের নাম লিখুন (অন্তত ২ অক্ষর)।"; return; }
  const out = normalizeProduct({
    ...p,
    name: p.name.trim(),
  });
  if (formIsNew) PRODUCTS.push(out);
  else {
    const i = PRODUCTS.findIndex((x) => x.id === out.id);
    if (i >= 0) PRODUCTS[i] = out; else PRODUCTS.push(out);
  }
  formDraft = null;
  saveContent(); renderProducts(); renderMilaniFeature(); renderProductsTab();
  toast(formIsNew ? "নতুন পণ্য যোগ হয়েছে" : "পণ্যের তথ্য আপডেট হয়েছে");
}

function pCancel() { formDraft = null; renderProductsTab(); }

/* ------------------------------------------------------------
   ট্যাব ২: সেকশন / ক্যাটাগরি
   ------------------------------------------------------------ */
let catForm = null; // null = তালিকা দেখাও; {key?, label} = ফর্ম দেখাও

function renderCatsTab() {
  const box = document.getElementById("tab-cats");
  if (catForm) {
    box.innerHTML = `
      <h3 class="pf-title">${catForm.key ? "সেকশন এডিট: " + esc(catForm.key) : "নতুন সেকশন যোগ করুন"}</h3>
      <label class="field"><span>সেকশনের নাম *</span>
        <input id="cf-label" value="${esc(catForm.label)}" placeholder="যেমন: বাঁশ-বেতের পণ্য"></label>
      <p class="form-error" id="cf-err"></p>
      <div class="pf-actions">
        <button class="btn btn-primary" onclick="cSave()">সংরক্ষণ করুন</button>
        <button class="btn btn-ghost" onclick="cCancel()">বাতিল</button>
      </div>`;
    const inp = document.getElementById("cf-label");
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") cSave(); });
    inp.focus();
    return;
  }
  const rows = CATEGORIES.filter((c) => c.key !== "all").map((c) => {
    const count = PRODUCTS.filter((p) => p.category === c.key).length;
    return `
      <div class="prow">
        <div class="pinfo">
          <b>${esc(c.label)}</b>
          <small>পণ্য: ${toBn(count)}টি</small>
        </div>
        <div class="pbtns">
          <button class="btn btn-outline btn-sm" onclick="cEdit('${esc(c.key)}')">এডিট</button>
          <button class="btn btn-danger btn-sm" onclick="cDelete('${esc(c.key)}')">মুছুন</button>
        </div>
      </div>`;
  }).join("");
  box.innerHTML = `
    <div class="admin-bar">
      <span>মোট সেকশন: ${toBn(CATEGORIES.length - 1)}টি</span>
      <button class="btn btn-primary btn-sm" onclick="cNew()">＋ নতুন সেকশন যোগ করুন</button>
    </div>
    <div class="plist">${rows || '<p style="color:#8a6b4f;padding:10px 0;">কোনো সেকশন নেই — নতুন সেকশন যোগ করুন।</p>'}</div>
    <p class="form-hint" style="text-align:left">“সব পণ্য” সেকশনটি অটোমেটিক থাকে — সেটি এডিট বা মুছা যায় না। যে সেকশনে পণ্য আছে সেটি মুছতে আগে পণ্যগুলো সরাতে হবে।</p>`;
}

function cNew() { catForm = { key: null, label: "" }; renderCatsTab(); }
function cEdit(key) {
  const c = CATEGORIES.find((x) => x.key === key);
  if (c) { catForm = { key: c.key, label: c.label }; renderCatsTab(); }
}
function cCancel() { catForm = null; renderCatsTab(); }

function cSave() {
  const label = document.getElementById("cf-label").value.trim();
  const err = document.getElementById("cf-err");
  if (label.length < 2) { err.textContent = "সেকশনের নাম লিখুন (অন্তত ২ অক্ষর)।"; return; }
  if (catForm.key) {
    const c = CATEGORIES.find((x) => x.key === catForm.key);
    if (c) c.label = label;
    toast("সেকশনের নাম আপডেট হয়েছে");
  } else {
    // নতুন কী বানানো (ইংরেজি ছোট হরফে ইউনিক নাম)
    let key = "cat" + Date.now().toString(36);
    while (CATEGORIES.some((c) => c.key === key)) key += Math.floor(Math.random() * 9) + 1;
    CATEGORIES.push({ key, label });
    toast("নতুন সেকশন যোগ হয়েছে");
  }
  catForm = null;
  saveContent(); setupFilters(); renderProducts(); renderCatsTab(); renderProductsTab();
}

/** সেকশন মুছা — ভেতরে পণ্য থাকলে আটকানো */
function cDelete(key) {
  const c = CATEGORIES.find((x) => x.key === key);
  if (!c) return;
  const used = PRODUCTS.filter((p) => p.category === key);
  if (used.length) {
    toast("“" + c.label + "” সেকশনে " + toBn(used.length) + "টি পণ্য আছে — আগে সেগুলো অন্য সেকশনে সরান বা মুছুন।");
    return;
  }
  if (!confirm("“" + c.label + "” সেকশনটি মুছে ফেলবেন?")) return;
  CATEGORIES = CATEGORIES.filter((x) => x.key !== key);
  if (activeCat === key) activeCat = "all";
  saveContent(); setupFilters(); renderProducts(); renderCatsTab();
  toast("সেকশনটি মুছে ফেলা হয়েছে");
}

/* ------------------------------------------------------------
   ট্যাব ৩: হোমপেজের লেখা — সব data-edit ঘর + হিরো ছবি
   ------------------------------------------------------------ */
function renderTextsTab() {
  const hero = document.querySelector("[data-hero-img]");
  const fields = [...document.querySelectorAll("[data-edit]")].map((el) => {
    const v = TEXTS[el.dataset.edit] != null ? TEXTS[el.dataset.edit] : el.textContent.trim();
    const long = v.length > 60;
    return `<label class="field${long ? " span2" : ""}"><span>${esc(el.dataset.label || el.dataset.edit)}</span>
      ${long
        ? `<textarea rows="3" data-key="${esc(el.dataset.edit)}">${esc(v)}</textarea>`
        : `<input data-key="${esc(el.dataset.edit)}" value="${esc(v)}">`}</label>`;
  }).join("");
  document.getElementById("tab-texts").innerHTML = `
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
    <p class="form-hint" style="text-align:left">যে লেখাটি বদলাবেন সাইটে সঙ্গে সঙ্গেই দেখা যাবে ও সেভ হবে। ফাঁকা রাখলে আসল লেখাটাই থাকবে।</p>`;
  const hf = document.getElementById("hero-file");
  if (hf) hf.onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const d = await fileToDataURL(f, 1800);
      const heroEl = document.querySelector("[data-hero-img]");
      if (heroEl) heroEl.src = d;
      const prev = document.getElementById("heroPrev");
      if (prev) prev.src = d;
      saveContent();
      toast("হিরো ছবি বদলে গেছে");
    } catch (err) { toast(err.message); }
  };
}

/** লেখা টাইপ করলেই সাইটে বসে যাওয়া + সেভ */
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.key && t.closest("#tab-texts")) {
    const key = t.dataset.key;
    TEXTS[key] = t.value;
    const el = document.querySelector('[data-edit="' + key + '"]');
    if (el) el.textContent = t.value;
    saveContentSoon();
  }
});

/* ------------------------------------------------------------
   ট্যাব ৪: সাইট সেটিংস
   ------------------------------------------------------------ */
function renderSiteTab() {
  const featOpts = [`<option value="" ${!SITE.featuredId ? "selected" : ""}>— বিশেষ পণ্য নেই (অংশটি লুকাবে) —</option>`]
    .concat(PRODUCTS.map((p) => `<option value="${esc(p.id)}" ${SITE.featuredId === p.id ? "selected" : ""}>${esc(p.name)}</option>`)).join("");
  document.getElementById("tab-site").innerHTML = `
    <div class="pf-grid">
      <label class="field"><span>দোকানের নাম (বাংলা) — রসিদেও দেখায়</span><input id="st-namebn" value="${esc(SITE.nameBn)}"></label>
      <label class="field"><span>দোকানের নাম (ইংরেজি)</span><input id="st-nameen" value="${esc(SITE.nameEn)}"></label>
      <label class="field"><span>ফোন / হোয়াটসঅ্যাপ নম্বর</span><input id="st-phone" inputmode="tel" value="${esc(SITE.phone)}"></label>
      <label class="field"><span>ঠিকানা</span><input id="st-address" value="${esc(SITE.address)}"></label>
    </div>
    <label class="field"><span>প্রি-অর্ডারের গুগল ফর্ম লিংক ("প্রি-অর্ডার" বাটনে এটি ওয়েবসাইটের বাইরে নতুন ট্যাবে খুলবে)</span>
      <input id="st-form" value="${esc(SITE.googleFormUrl)}" placeholder="https://docs.google.com/forms/..."></label>
    <label class="field"><span>হোমপেজের বিশেষ পণ্য (মিলির মতো বড় অংশটি কোন পণ্যের হবে)</span>
      <select id="st-feat">${featOpts}</select></label>
    <p class="form-hint" style="text-align:left">ফোন নম্বর বদলালে হেডার, যোগাযোগ, প্রি-অর্ডার ও হোয়াটসঅ্যাপ লিংক — সব জায়গায় নতুন নম্বর চলে যাবে।</p>`;
  const bind = (id, fn) => document.getElementById(id).addEventListener("input", fn);
  bind("st-namebn", () => { SITE.nameBn = document.getElementById("st-namebn").value.trim(); saveContentSoon(); });
  bind("st-nameen", () => { SITE.nameEn = document.getElementById("st-nameen").value.trim(); saveContentSoon(); });
  bind("st-phone", () => {
    const ph = document.getElementById("st-phone").value.trim();
    if (/^\+?\d[\d\s-]{8,}$/.test(ph)) { SITE.phone = ph.replace(/[\s-]/g, ""); SITE.phoneIntl = toIntl(SITE.phone); applySiteToDOM(); saveContentSoon(); }
  });
  bind("st-address", () => { SITE.address = document.getElementById("st-address").value.trim(); applySiteToDOM(); saveContentSoon(); });
  bind("st-form", () => { SITE.googleFormUrl = document.getElementById("st-form").value.trim(); applySiteToDOM(); saveContentSoon(); });
  document.getElementById("st-feat").addEventListener("change", (e) => {
    SITE.featuredId = e.target.value;
    renderMilaniFeature(); saveContent();
    toast(e.target.value ? "বিশেষ পণ্য বদলে গেছে" : "বিশেষ অংশটি লুকিয়ে যাবে");
  });
}

/* ------------------------------------------------------------
   ট্যাব ৫: আগ্রহীরা — তালিকা + হোয়াটসঅ্যাপ + মুছুন + CSV
   ------------------------------------------------------------ */
function renderAdminTable() {
  const list = getInterests().slice().reverse(); // নতুন আগ্রহ ওপরে
  const tbody = document.getElementById("aTbody");
  document.getElementById("aCount").textContent = "মোট আগ্রহ: " + toBn(list.length);
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:22px;color:#8a6b4f;">এখনো কোনো আগ্রহ জমা হয়নি</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((r) => `
    <tr>
      <td>${esc(toBn(r.no))}</td>
      <td>${esc(bnDate(new Date(r.date)))}</td>
      <td>${esc(r.productName)}</td>
      <td>${esc(toBn(r.qty) + " × " + r.unit)}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(toBn(r.phone))}</td>
      <td>${esc(r.studentId || "—")}</td>
      <td>
        <a class="btn btn-green btn-sm" target="_blank" rel="noopener"
           href="https://wa.me/${esc(toIntl(r.phone))}?text=${encodeURIComponent("আসসালামু আলাইকুম, " + r.name + " — আপনার আগ্রহের (“" + r.productName + "”) খোঁজখবর দিতে যোগাযোগ করছি।")}">হোয়াটসঅ্যাপ</a>
        <button class="btn btn-danger btn-sm" onclick="deleteInterest('${esc(r.no)}')">মুছুন</button>
      </td>
    </tr>`).join("");
}

/** একটা আগ্রহ মুছা */
function deleteInterest(no) {
  if (!confirm("রসিদ " + no + " মুছে ফেলবেন?")) return;
  const list = getInterests().filter((x) => x.no !== no);
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) {}
  renderAdminTable();
  toast("মুছে ফেলা হয়েছে");
}

/** CSV ডাউনলোড (Excel-এ খোলা যায়) — বাংলা ভালো দেখাতে UTF-8 BOM দেওয়া হয় */
function downloadCSV() {
  const list = getInterests();
  if (!list.length) { toast("কোনো আগ্রহ নেই"); return; }
  const head = ["রসিদ নং","তারিখ","পণ্য","পরিমাণ","একক","নাম","মোবাইল","ছাত্র আইডি"];
  const rows = list.map((r) => [
    r.no, new Date(r.date).toLocaleString("en-GB"), r.productName, r.qty, r.unit,
    r.name, r.phone, r.studentId,
  ]);
  const escCsv = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = "\uFEFF" + [head, ...rows].map((r) => r.map(escCsv).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const d = new Date();
  a.download = "interests-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") +
               String(d.getDate()).padStart(2, "0") + ".csv";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("CSV ডাউনলোড হয়েছে");
}

/** সব আগ্রহ মুছে ফেলা (সাবধানতার সাথে) */
function clearOrders() {
  if (!confirm("সব আগ্রহের তালিকা মুছে ফেলবেন? এটি আর ফিরে আসবে না।")) return;
  localStorage.removeItem(LS_KEY);
  renderAdminTable();
  toast("সব মুছে ফেলা হয়েছে");
}

/* ------------------------------------------------------------
   ট্যাব ৬: ব্যাকআপ — JSON ডাউনলোড / ফিরিয়ে আনা / রিসেট
   ------------------------------------------------------------ */
function renderBackupTab() {
  document.getElementById("tab-backup").innerHTML = `
    <div class="admin-note">
      <b>কোথায় সেভ হচ্ছে?</b> সব পরিবর্তন এই ব্রাউজারের localStorage-এ সেভ হয় —
      অর্থাৎ যে কম্পিউটার/মোবাইল থেকে বদলেছেন, সেখানেই দেখা যাবে।
      নতুন কম্পিউটারে বসাতে বা নিরাপদ রাখতে নিয়মিত <b>ব্যাকআপ ডাউনলোড</b> করুন।
    </div>
    <div class="pf-actions" style="margin-bottom:14px;">
      <button class="btn btn-primary" onclick="downloadBackup()">⬇ ব্যাকআপ ডাউনলোড (JSON)</button>
      <label class="btn btn-outline filebtn">⬆ ব্যাকআপ থেকে ফিরিয়ে আনুন
        <input type="file" accept="application/json,.json" id="restore-file" hidden>
      </label>
    </div>
    <div class="pf-actions">
      <button class="btn btn-danger" onclick="resetAll()">সব রিসেট করুন (আসল ডাটায় ফিরে যান)</button>
    </div>
    <p class="form-hint" style="text-align:left">রিসেট করলে এই ব্রাউজারে বদলানো সব পণ্য/সেকশন/লেখা মুছে গিয়ে ওয়েবসাইটের আসল ডাটায় ফিরে যাবে। আগে ব্যাকআপ নিয়ে রাখুন।</p>`;
  document.getElementById("restore-file").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const c = JSON.parse(await f.text());
      if (!c || !Array.isArray(c.products)) throw new Error("ফাইলটি সঠিক ব্যাকআপ নয়");
      if (!confirm("ব্যাকআপ থেকে ফিরিয়ে আনবেন? এখনকার পরিবর্তনগুলো বদলে যাবে।")) return;
      applyContent(c);
      saveContent();
      refreshWholeSite();
      renderProductsTab(); renderCatsTab(); renderTextsTab(); renderSiteTab();
      toast("ব্যাকআপ ফিরিয়ে আনা হয়েছে");
    } catch (err) { toast(err.message || "ফাইল পড়া যায়নি"); }
    e.target.value = "";
  };
}

/** ব্যাকআপ JSON ডাউনলোড */
function downloadBackup() {
  const blob = new Blob([JSON.stringify(snapshot(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const d = new Date();
  a.download = "jamalpur-site-backup-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") +
               String(d.getDate()).padStart(2, "0") + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  toast("ব্যাকআপ ডাউনলোড হয়েছে — নিরাপদে রাখুন");
}

/** সব রিসেট — localStorage মুছে পেজ রিলোড */
function resetAll() {
  if (!confirm("সব পরিবর্তন মুছে ওয়েবসাইটের আসল ডাটায় ফিরে যাবেন?")) return;
  localStorage.removeItem(LS_CONTENT);
  location.reload();
}

/** সাইটের সব অংশ নতুন করে আঁকা (ব্যাকআপ ফিরিয়ে আনার পরে লাগে) */
function refreshWholeSite() {
  applyLang();          // ভাষা অনুযায়ী সব লেখা + ফিল্টার + পণ্য + মিলি অংশ
  renderAdminTable();
}

/* ============================================================
   ১৭) পেজ লোড — সব সেটআপ একসাথে চালানো
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  harvestDefaults();        // HTML থেকে ডিফল্ট লেখা তোলা
  loadContent();            // সেভ করা কনটেন্ট (বা ডিফল্ট) বসানো

  /* ---- ভাষা প্রস্তুত: শেষবারের পছন্দ মনে রাখা + বাটন চালু ---- */
  try { if (localStorage.getItem(LS_LANG) === "en") LANG = "en"; } catch (e) {}
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === LANG);
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });

  applyLang();              // ভাষা অনুযায়ী সব লেখা + ফিল্টার + পণ্য + মিলি অংশ
  setupInterestStepper();   // ইন্টারেস্টেড ফর্মের স্টেপার

  // মোবাইল মেনু (হ্যামবার্গার) চালু
  const burger = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

  // হেডার (ন্যাভবার) স্ক্রলের দিক অনুযায়ী লুকানো/দেখানো:
  //   নিচের দিকে স্ক্রল করলে → হেডার উপরে উঠে লুকিয়ে যায়
  //   উপরের দিকে স্ক্রল করলে → হেডার আবার ফিরে আসে (মোবাইল সাইটের মতো)
  // পেজের একদম ওপরে থাকলে (৯০px-এর নিচে) সবসময় দেখা যায়।
  const header = document.querySelector(".site-header");
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > lastScrollY + 4 && y > 90) {
      header.classList.add("nav-hidden");    // নিচে যাচ্ছে → হেডার লুকাও
      nav.classList.remove("open");           // মোবাইল মেনু খোলা থাকলে বন্ধ
    } else if (y < lastScrollY - 4 || y <= 90) {
      header.classList.remove("nav-hidden"); // উপরে যাচ্ছে → হেডার দেখাও
    }
    lastScrollY = y;
  }, { passive: true });

  // সাল ফুটারে বসানো (চালু ভাষার অঙ্কে — applyLang-ও এটি করে)
  document.getElementById("footYear").textContent = num(new Date().getFullYear());

  // লিংকে #admin থাকলে সরাসরি অ্যাডমিন খুলবে (যেমন: index.html#admin)
  if (location.hash === "#admin") openAdmin();
});
