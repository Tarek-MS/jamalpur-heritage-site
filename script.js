/* ============================================================
   জামালপুর ঐতিহ্য হাট — script.js
   ------------------------------------------------------------
   এই ফাইলে ওয়েবসাইটের সব "কাজ" নিয়ন্ত্রিত হয়:
     ১) পণ্যের ডাটা দেখানো (কার্ড + বিস্তারিত)
     ২) ক্যাটাগরি ফিল্টার
     ৩) অর্ডার ফর্ম ও যাচাই
     ৪) অর্ডার রসিদ তৈরি (প্রিন্ট / PDF / ডাউনলোড / হোয়াটসঅ্যাপ)
     ৫) অ্যাডমিন প্যানেল (পিন দিয়ে অর্ডার দেখা ও CSV ডাউনলোড)
   প্রতিটি অংশের শুরুতে বড় কমেন্ট দেওয়া আছে — সহজে খুঁজে পাবেন।
   ============================================================ */

"use strict"; // জাভাস্ক্রিপ্টকে কঠোর নিয়মে চালানো (ভুল ধরা সহজ হয়)

/* ============================================================
   ১) সাইট কনফিগ — এখানে দোকানের তথ্য বদলাতে পারবেন
   ============================================================ */
const SITE = {
  nameBn: "জামালপুর ঐতিহ্য হাট",            // দোকানের নাম (বাংলা)
  nameEn: "Jamalpur Heritage Market",        // দোকানের নাম (ইংরেজি)
  phone: "01304542204",                      // ফোন নম্বর (দেশি ফরম্যাট)
  phoneIntl: "8801304542204",                // আন্তর্জাতিক ফরম্যাট (হোয়াটসঅ্যাপে লাগে)
  address: "জামালপুর, ময়মনসিংহ বিভাগ, বাংলাদেশ",
  adminPin: "591990",                        // অ্যাডমিন কোড — চাইলে বদলান
  orderForm: "https://docs.google.com/forms/d/e/1FAIpQLSeWdkKJXxgx2CssV5TgEXEYkoj5Q9B_Ar6svQ6iCNhBBY7wbA/viewform", // গুগল ফর্ম (পপআপের ভেতরে এমবেড হবে)
  formTemplate: "",                          // (ঐচ্ছিক) প্রি-ফিলড লিংক — অ্যাডমিন > যোগাযোগ ট্যাবে বসান
};

/* ============================================================
   ২) পণ্যের ডাটা — নতুন পণ্য যোগ/বাদ দিতে চাইলে এখানে করুন
   ------------------------------------------------------------
   প্রতিটি পণ্যের অর্থ:
     id         : ইংরেজিতে ছোট নাম (কোডে চেনার জন্য)
     name       : পণ্যের নাম (বাংলা)
     altNames   : প্রচলিত অন্যান্য নাম (যেমন মিলানীর মেন্দা)
     category   : "food" (খাদ্য) / "craft" (হস্তশিল্প) / "processed" (প্রসেশনি)
     unit       : বিক্রির একক (প্রতি প্লেট, প্রতি কেজি...)
     price      : দাম (টাকা)। না থাকলে null — তখন "যোগাযোগ" দেখাবে
     priceMax   : দামের পরিসর থাকলে সর্বোচ্চ দাম (যেমন ১৩০–৬৫০)
     image      : মূল ছবি (images ফোল্ডারের ফাইল)
     gallery    : বিস্তারিত পপআপে দেখানোর অতিরিক্ত ছবি
     short      : কার্ডে দেখানো ১-২ লাইনের সারসংক্ষেপ
     history    : ঐতিহ্যের গল্প
     ingredients: উপকরণ/উপাদানের তালিকা
   ============================================================ */
const PRODUCTS = [
  {
    "id": "milani",
    "name": "মিল্লি / পিঠালি",
    "altNames": [
      "মেন্দা",
      "ম্যান্দা",
      "মিলানী"
    ],
    "category": "food",
    "unit": "প্রতি প্লেট",
    "price": 200,
    "priceMax": null,
    "image": "images/milani-main.jpg",
    "gallery": [
      "images/milani-banner.jpg",
      "images/milani-2.jpg",
      "images/milani-3.jpg",
      "images/milani-4.jpg"
    ],
    "short": "জামালপুরের শতবর্ষের ভালোবাসা ও সামাজিক বন্ধনের প্রতীক — ধোঁয়া ওঠা ভাত ও মাষকলাই ডালের সাথে ভাগ করে খাওয়া ঐতিহ্যবাহী বিশেষ খাবার।",
    "history": "জামালপুর অঞ্চলের শতবর্ষের ভালোবাসা ও সামাজিক বন্ধনের প্রতীক এই মিল্লি বা পিঠালি। প্রাচীনকালে চরাঞ্চলে বসতি গড়ে ওঠার সময় থেকে বিয়ে, চল্লিশা বা বিশেষ মিলনমেলায় মানুষ একসাথে বসে কলাপাতায় ধোঁয়া ওঠা সাদা ভাত ও মাষকলাই ডালের সাথে এই খাবার ভাগ করে নিতেন। দক্ষ বাবুর্চিদের হাতের বিশেষ বাগাড় ও মসলার মায়াবী মিশ্রণে তৈরি এই মাংসের ঘ্রাণ আর মোলায়েম স্বাদ একবার মুখে নিলে সহজে ভোলা যায় না। প্রতিটি লোকমায় মিশে থাকে গ্রামবাংলার আতিথেয়তার উষ্ণতা ও অতুলনীয় স্বাদের তৃপ্তি।",
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
    "name": "প্যাড়া সন্দেশ",
    "altNames": [
      "প্যারা সন্দেশ",
      "ক্ষীরের সন্দেশ"
    ],
    "category": "food",
    "unit": "প্রতি পিস",
    "price": 25,
    "priceMax": null,
    "image": "images/para-sandesh-main.jpg",
    "gallery": [
      "images/para-sandesh-2.jpg",
      "images/para-sandesh-3.jpg"
    ],
    "short": "প্রায় ১২০ বছরের পুরোনো ধারায় খাঁটি গরুর দুধের ঘন ক্ষীর থেকে তৈরি অমৃতসম মিষ্টান্ন — উপহার হিসেবে সেরা।",
    "history": "প্রায় শতবর্ষের ঐতিহ্য আর কারিগরদের পরম যত্নে গড়ে ওঠা এক অমৃতসম মিষ্টান্ন হলো প্যাড়া সন্দেশ। নওগাঁ থেকে শুরু করে জামালপুরের সরিষাবাড়ীতে প্রায় ১২০ বছরের পুরোনো ধারায় খাঁটি গরুর দুধ জ্বাল দিয়ে ঘন ক্ষীর থেকে পরম মমতায় তৈরি হয় এই সন্দেশ। মুখে দিলেই মিলিয়ে যাওয়া হালকা মিষ্টি আর খাঁটি দুধের স্নিগ্ধ ঘ্রাণ একে করে তুলেছে অতুলনীয় সুস্বাদু। সহজে নষ্ট হয় না বলে প্রিয়জনদের জন্য উপহার হিসেবে বা বাড়ির সবার জন্য নিয়ে যাওয়ার সেরা একটি খাবার।",
    "ingredients": [
      "গরুর খাঁটি দুধ (ঘন ক্ষীর)",
      "চিনি (অথবা খেজুরের নলেন গুড়)",
      "সামান্য এলাচ"
    ]
  },
  {
    "id": "chanar-payesh",
    "name": "ছানার পায়েস",
    "altNames": [
      "ছানার পরমান্ন",
      "জামালপুর ও শেরপুরের ছানার পায়েস"
    ],
    "category": "food",
    "unit": "প্রতি কেজি",
    "price": 450,
    "priceMax": null,
    "image": "images/chanar-payesh-main.jpg",
    "gallery": [
      "images/chanar-payesh-2.jpg"
    ],
    "short": "জিআই স্বীকৃতিপ্রাপ্ত রাজকীয় মিষ্টান্ন — দুধ ও তাজা ছানার ঘন, ক্রিমি বুননে এলাচ-বাদামের সুবাস।",
    "history": "জামালপুর ও শেরপুর অঞ্চলের মায়েদের স্নেহ আর ময়রাদের সূক্ষ্ম রন্ধনশিল্পের মেলবন্ধন হলো এই ঐতিহ্যবাহী ছানার পায়েস। অতিথি আপ্যায়ন কিংবা ঘরোয়া উৎসব—সব আনন্দের কেন্দ্রবিন্দুতে থাকে জিআই স্বীকৃতিপ্রাপ্ত এই রাজকীয় মিষ্টান্ন। দুধ আর তাজা ছানার ঘন, ক্রিমি বুননের সাথে এলাচ ও বাদামের সুবাস মিলেমিশে তৈরি করে এক স্বর্গীয় ও লোভনীয় স্বাদ। ঠান্ডা বা গরম—যেকোনো অবস্থাতেই এর এক চামচ স্বাদ মন ও প্রাণ জুড়িয়ে দেয়।",
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
    "name": "ছানার পোলাও",
    "altNames": [
      "জামালপুরের ছানার পোলাও",
      "ঝুরি ছানার মিষ্টি পোলাও"
    ],
    "category": "food",
    "unit": "প্রতি কেজি",
    "price": 500,
    "priceMax": null,
    "image": "images/chanar-polao-main.jpg",
    "gallery": [
      "images/chanar-polao-2.jpg",
      "images/chanar-polao-3.jpg"
    ],
    "short": "বিয়ে ও বিশেষ দাওয়াতের ভালোবাসার নিদর্শন — ঝুরি ছানা ঘিয়ে ভেজে মিষ্টি শিরায় ডুবিয়ে পরিবেশন।",
    "history": "জামালপুরের প্রায় শত বছরের পুরোনো গৌরব ও ঐতিহ্যের এক অনন্য স্বাক্ষর এই ছানার পোলাও। বিয়ে বা বিশেষ কোনো দাওয়াতে ভালোবাসার নিদর্শন হিসেবে পোলাওয়ের আদলে ঝুরি ছানা ঘিয়ে ভেজে ও মিষ্টি শিরায় ডুবিয়ে পরিবেশন করা হয়। কারিগরদের নিপুণ হাতের ছোঁয়ায় তৈরি প্রতিটি দানা মুখে নিলেই পাওয়া যায় খাঁটি ঘি, এলাচ আর মিষ্টির অসাধারণ মেলবন্ধন। সাধারণ মিষ্টির চেয়ে ভিন্নধর্মী ও অসম্ভব সুস্বাদু হওয়ায় ভোজনরসিকদের কাছে এর আকর্ষণ চিরন্তন।",
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
    "name": "জালি পিঠা / সিরিশ পিঠা",
    "altNames": [
      "খোলাজা পিঠা",
      "সিরিজ বা সিরিঞ্জ পিঠা"
    ],
    "category": "food",
    "unit": "প্রতি প্লেট",
    "price": 70,
    "priceMax": null,
    "image": "images/jali-pitha-main.jpg",
    "gallery": [
      "images/jali-pitha-2.jpg",
      "images/jali-pitha-3.jpg"
    ],
    "short": "নবান্ন উৎসব আর মা-বোনদের স্নেহমাখা হাতের পিঠা — জালিদার নরম জালি পিঠা আর ফুলেল নকশার মচমচে সিরিশ পিঠা।",
    "history": "গ্রামীণ বাংলার নবান্ন উৎসব আর মা-বোনদের স্নেহমাখা হাতের পরশে জড়িয়ে আছে জালি ও সিরিশ পিঠার গল্প। মাটির খোলায় তৈরি অসংখ্য জালিদার ছিদ্রের নরম জালি পিঠা যেকোনো তরকারি বা গুড়ের সাথে খেতে যেমন দারুণ, তেমনি সিরিঞ্জ বা ছাঁচে ফুলেল নকশা করে রোদে শুকানো সিরিশ পিঠা ভাজলে হয় দারুণ মচমচে ও সুস্বাদু। পাড়ার নারীরা দলবেঁধে গল্প ও হাসি-আনন্দের মাঝে এই পিঠা বানিয়ে আত্মীয়স্বজনদের বাড়িতে ভালোবাসার উপহার হিসেবে পাঠান। প্রতিটি কামড়ে পাওয়া যায় বাংলার মাটির সোঁদা গন্ধ আর ঘরোয়া আদরের স্বাদ।",
    "ingredients": [
      "জালি পিঠায়: চালের গুঁড়া, ডিম, লবণ ও গরম পানি",
      "সিরিশ পিঠায়: আতপ বা সিদ্ধ চালের গুঁড়া, পানি, সামান্য লবণ",
      "ভাজার জন্য তেল"
    ]
  },
  {
    "id": "jamai-pitha",
    "name": "জামাই পিঠা",
    "altNames": [
      "জামাই আদুরি পিঠা",
      "মুগপাকন বা পাকন পিঠা"
    ],
    "category": "food",
    "unit": "প্রতি পিস",
    "price": 60,
    "priceMax": null,
    "image": "images/jamai-pitha-main.jpg",
    "gallery": [
      "images/jamai-pitha-2.jpg"
    ],
    "short": "নতুন জামাইয়ের আগমনে শাশুড়ি ও গৃহিণীদের হৃদয় নিংড়ানো আদর-যত্ন থেকে জন্ম নেওয়া রসালো মিষ্টি পিঠা।",
    "history": "গ্রামবাংলায় নতুন জামাইয়ের আগমনে শাশুড়ি ও গৃহিণীদের হৃদয় নিংড়ানো আদর-যত্ন আর মেয়ের সুখের কামনা থেকে জন্ম নিয়েছে এই জামাই পিঠা। একসময় পাড়ার বউ-ঝিরা মিলে রাত জেগে লোকগানের সুরে নানা নকশায় পরম ভালোবাসায় এই পিঠা গড়তেন। ঘিয়ে ভাজা মুগডাল আর চালের গুঁড়ার পিঠা যখন খেজুরের গুড় বা চিনির রসালো শিরায় ডুবানো হয়, তখন তার মচমচে ও রসালো স্বাদ যে কারও মন জয় করে নেয়। পরিবারের প্রিয় মানুষদের মুখে হাসি ফোটাতে এই মিষ্টি পিঠার জুড়ি নেই।",
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
    "name": "নকশি শিল্প (নকশী কাঁথা)",
    "altNames": [
      "নকশী কাঁথা",
      "সুজনী"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "price": 130,
    "priceMax": 650,
    "image": "images/nakshi-shilpo.jpg",
    "gallery": [],
    "short": "সুঁই-সুতার প্রতিটি ফোঁড়ে বোনা মা-দাদিদের ভালোবাসা ও জীবনের গল্প — জিআই স্বীকৃত, পাঁচ শতাধিক নারী উদ্যোক্তার গর্ব।",
    "history": "জামালপুরের মা-দাদিদের শত-দেড়শ বছরের ভালোবাসা, ধৈর্য আর জীবনের গল্প সুঁই-সুতার প্রতিটি ফোঁড়ে বোনা থাকে নকশী কাঁথায়। ঘরের কোণে বসে গ্রামীণ নারীরা নিজেদের মনের মাধুরী মিশিয়ে লতা-পাতা আর ঐতিহ্যবাহী আল্পনায় সাজিয়ে তোলেন একেকটি অনন্য শিল্পকর্ম। সরকারের 'নকশী কাঁথার দেশ' ব্র্যান্ডিং এবং জিআই পণ্যের স্বীকৃতি পাওয়া এই শিল্প আজ জেলার পাঁচ শতাধিক নারী উদ্যোক্তাকে স্বাবলম্বী করেছে। একটি নকশী কাঁথা কেবল ব্যবহার্য বস্ত্র নয়, বরং প্রিয়জনের জন্য পরম মমতায় বোনা এক জীবন্ত স্মৃতিচিহ্ন।",
    "ingredients": [
      "পুরোনো বা নতুন সুতি কাপড় (থান কাপড়)",
      "রঙিন সুতি সুতা",
      "সুঁচ"
    ]
  },
  {
    "id": "kasha-shilpo",
    "name": "কাঁসা শিল্প",
    "altNames": [
      "ইসলামপুরের কাঁসা",
      "কাঁসা-পিতল শিল্প"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "price": 250,
    "priceMax": 1350,
    "image": "images/kasha-shilpo.jpg",
    "gallery": [],
    "short": "ইসলামপুরের কারিগরদের আগুনের আঁচে গড়া ঐতিহ্যবাহী কাঁসার সামগ্রী — পারিবারিক আতিথেয়তা ও আভিজাত্যের প্রতীক।",
    "history": "জামালপুরের ইসলামপুরের কারিগরদের ঘাম, নিষ্ঠা আর ঐতিহ্যবাহী দক্ষতায় গড়া কাঁসা শিল্প একসময় বিশ্বজুড়ে সমাদৃত ছিল। পৈতৃক পেশার প্রতি গভীর মায়া আর ভালোবাসা থেকে আধুনিক যান্ত্রিক যুগেও ইসলামপুরের প্রায় ২০-২৫টি পরিবার আজও আগুনের আঁচে নিখুঁত কাঁসার সামগ্রী তৈরি করে চলেছেন। ঐতিহ্যগতভাবে পারিবারিক আতিথেয়তা, বিয়ে ও ধর্মীয় আচারে কাঁসার সামগ্রী আভিজাত্যের প্রতীক হিসেবে ব্যবহৃত হয়ে আসছে। এর সোনালী আভা ও দীর্ঘস্থায়ী গড়ন ঘরে নিয়ে আসে এক অনন্য ঐতিহ্যবাহী সৌন্দর্য।",
    "ingredients": [
      "তামা ও টিনের (রাং) নির্দিষ্ট অনুপাতের সংকর ধাতু",
      "মাটির ছাঁচ",
      "কয়লা"
    ]
  },
  {
    "id": "mrithshilpo",
    "name": "মৃৎশিল্পের সামগ্রী",
    "altNames": [
      "মাটির তৈজসপত্র",
      "পোড়ামাটির সামগ্রী"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "price": 70,
    "priceMax": 650,
    "image": "images/mrithshilpo.jpg",
    "gallery": [],
    "short": "কুমার সম্প্রদায়ের চাকায় গড়া পরিবেশবান্ধব মাটির পাত্র ও টেপা পুতুল — দেশীয় মাটির মায়াবী ছোঁয়া।",
    "history": "প্রাচীনকাল থেকে বাংলার কুমার সম্প্রদায়ের হাতের স্পর্শে কাদামাটি প্রাণ পেয়েছে এবং হয়ে উঠেছে গ্রামীণ জীবনের অবিচ্ছেদ্য অংশ। ১৯০১ সালের হিসাব অনুযায়ী জামালপুরেই দেড় হাজার কুমার পরিবারের সদস্য বংশপরম্পরায় এই নিপুণ শিল্পের চর্চা করে গেছেন। আধুনিক প্লাস্টিক বা স্টিলের ভিড়েও পরিবেশবান্ধব ও শৌখিন পণ্য হিসেবে মাটির তৈরি পাত্র ও টেপা পুতুলের কদর আজও অমলিন। প্রতিটি মাটির পণ্যে লেগে থাকে কুমারদের গভীর শ্রম, প্রকৃতির সান্নিধ্য আর দেশীয় মাটির মায়াবী ছোঁয়া।",
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
    "name": "বাঁশের পণ্য (ঝুড়ি / কুলা / চালুনি)",
    "altNames": [
      "বাঁশ ও বেতের হস্তশিল্প"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "price": 200,
    "priceMax": 2600,
    "image": "images/basher-ponno.jpg",
    "gallery": [],
    "short": "বংশপরম্পরায় কারিগরদের বোনা টেকসই বাঁশ-বেতের সামগ্রী — এখন ইউরোপ, জাপান ও আমেরিকার বাজারেও সুনাম।",
    "history": "কৃষিপ্রধান বাংলার গ্রামীণ জনপদে ফসল তোলা থেকে শুরু করে সংসারের নিত্যদিনের কাজে বাঁশ ও বেতের পণ্য যুগ যুগ ধরে মানুষের পরম সঙ্গী। বংশপরম্পরায় গ্রামীণ কারিগররা অসীম ধৈর্য ও দক্ষতায় বাঁশের শলা বুনে তৈরি করেন এসব টেকসই ও পরিবেশবান্ধব শিল্পকর্ম। দেশের মোট হস্তশিল্পের প্রায় অর্ধেক অংশ জুড়ে থাকা এই পণ্যগুলো আজ গ্রামের গণ্ডি পেরিয়ে ইউরোপ, জাপান ও আমেরিকার বাজারেও সুনাম কুড়াচ্ছে। প্রাকৃতিক ও স্বাস্থ্যসম্মত জীবনযাপনের অংশ হিসেবে ঘরে এমন পণ্য থাকা মানেই বাংলার ঐতিহ্যকে আগলে রাখা।",
    "ingredients": [
      "পরিপক্ব বাঁশ",
      "বেত",
      "চিকন তার বা সুতা",
      "প্রয়োজনভেদে রঙ"
    ]
  },
  {
    "id": "sorishar-tel",
    "name": "সরিষার তেল",
    "altNames": [
      "ঘানি ভাঙা খাঁটি সরিষার তেল"
    ],
    "category": "craft",
    "unit": "প্রতি লিটার",
    "price": 325,
    "priceMax": null,
    "image": "images/sorishar-tel-main.jpg",
    "gallery": [
      "images/sorishar-tel-2.jpg",
      "images/sorishar-tel-3.jpg"
    ],
    "short": "খ্রিস্টপূর্ব ৩০০০ অব্দের ঐতিহ্য — কাঠের ঘানিতে ধীরে ভাঙা ঝাঁঝালো, ভেজালমুক্ত খাঁটি সরিষার তেল।",
    "history": "উপমহাদেশে প্রায় খ্রিস্টপূর্ব ৩০০০ অব্দ থেকে বাঙালির রান্নাঘর, আচার আর সুস্থতার সাথে জড়িয়ে আছে খাঁটি সরিষার তেল। জামালপুরের প্রধান ফসলগুলোর একটি সরিষা—এমনকি ঐতিহাসিক সরিষা চাষের স্মৃতি থেকেই 'সরিষাবাড়ী' উপজেলার নামকরণ হয়েছে। কাঠের ঘানিতে ধীরে ধীরে ভাঙানো খাঁটি সরিষার তেলের ঝাঁঝালো ঘ্রাণ যেকোনো ভর্তা, ভাজি বা মাছের রান্নায় এনে দেয় অবিশ্বাস্য ও লোভনীয় স্বাদ। ভেজালমুক্ত প্রকৃতির এই নির্যাস খাবারের স্বাদ যেমন বহুগুণ বাড়ায়, তেমনি শরীরের যত্নেও রাখে অনন্য ভূমিকা।",
    "ingredients": [
      "দেশি খাঁটি সরিষা দানা (যেমন শ্বেতী বা রাই সরিষা)"
    ]
  },
  {
    "id": "jute-craft",
    "name": "পাটজাত পণ্য",
    "altNames": [
      "সোনালী আঁশের পণ্য (পাটের ব্যাগ, শিকা, কার্পেট ও চট)"
    ],
    "category": "craft",
    "unit": "প্রতি পিস",
    "price": 250,
    "priceMax": 350,
    "image": "images/jute-craft.jpg",
    "gallery": [],
    "short": "সরিষাবাড়ীর পাটকুঠির ঐতিহ্য — পরিবেশবান্ধব পাটের ব্যাগ, শিকা ও ম্যাট, হস্তশিল্প রপ্তানির শীর্ষে।",
    "history": "বাংলার অর্থনীতি ও প্রকৃতির প্রতি ভালোবাসার চিরন্তন প্রতীক হলো আমাদের 'সোনালী আঁশ' পাট। ব্রিটিশ আমল থেকেই জামালপুরের সরিষাবাড়ী ছিল উপমহাদেশের অন্যতম প্রধান পাট রপ্তানি কেন্দ্র, যেখানে বহু ঐতিহ্যবাহী পাটকুঠি গড়ে উঠেছিল। পরিবেশের কোনো ক্ষতি না করে গ্রামীণ কারিগরদের পরম যত্নে তৈরি পাটের ব্যাগ, শিকা ও ম্যাট আজ বিশ্ববাজারে বাংলাদেশের হস্তশিল্প রপ্তানির শীর্ষে রয়েছে। নান্দনিক ও টেকসই এই পাটজাত পণ্যগুলো আপনার দৈনন্দিন ব্যবহারে নিয়ে আসবে রুচিশীলতা ও দেশপ্রেমের অনুভূতি।",
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
    "name": "ধানের আঁটি",
    "altNames": [
      "পাকা ধানের গোছা",
      "মুঠি বা বিড়া"
    ],
    "category": "processed",
    "unit": "প্রতি আঁটি",
    "price": null,
    "priceMax": null,
    "image": "images/dhaner-anti.jpg",
    "gallery": [],
    "short": "অগ্রহায়ণের নবান্নে কৃষকের ঘাম, স্বপ্ন ও মাটির ভালোবাসার সোনালী ফসল — প্রাচুর্য আর শিকড়ের টানের প্রতীক।",
    "history": "কৃষকের সারা বছরের ঘাম, স্বপ্ন আর মাটির প্রতি অকৃত্রিম ভালোবাসার সোনালী ফসল হলো পাকা ধানের আঁটি। অগ্রহায়ণের নবান্ন উৎসবে কৃষকরা মাঠ থেকে এই আঁটি মাথায় বা গরুর গাড়িতে করে বাড়ির উঠানে তুলে আনেন, যা জামালপুরের গ্রামীণ জীবনে আজও এক চিরচেনা দৃশ্য। এই সোনালী ধানের নতুন চালের পিঠা-পায়েসের সুবাসেই ভরে ওঠে বাঙালির ঘর, আর ধানের খড় ব্যবহৃত হয় গ্রামীণ গৃহস্থালি ও লোকশিল্পে। ঘরের সাজে বা মাঙ্গলিক অনুষঙ্গে একমুঠো ধানের আঁটি মানেই প্রাচুর্য, শস্যশ্যামলা বাংলা আর শিকড়ের টান।",
    "ingredients": [
      "পাকা ধান গাছ (ধান ও খড়)",
      "আঁটি বাঁধার জন্য খড় বা পাটের দড়ি"
    ]
  },
  {
    "id": "jhuri-kula",
    "name": "ঝুড়ি / কুলা / চালুনি",
    "altNames": [
      "টুকরি",
      "ধামা",
      "চালনি",
      "ডালি"
    ],
    "category": "processed",
    "unit": "প্রতি পিস",
    "price": null,
    "priceMax": null,
    "image": "images/jhuri-kula.jpg",
    "gallery": [],
    "short": "গ্রামবাংলার মা-চাচিদের সংসারের নিত্যসঙ্গী — বিয়ে-শাদি ও নবান্নের মাঙ্গলিক ঐতিহ্যেও কুলা-ডালির ব্যবহার।",
    "history": "গ্রামবাংলার মা-চাচিদের সংসারের নিত্যসঙ্গী ও ফসল ঝাড়াই-বাছাইয়ের অকৃত্রিম মাধ্যম হলো ঝুড়ি, কুলা ও চালুনি। কেবল গৃহস্থালি কাজেই নয়, বাঙালির বিয়ে-শাদি ও নবান্নের মতো মাঙ্গলিক অনুষ্ঠানেও কুলা ও ডালির ব্যবহার এক স্নেহময় ঐতিহ্য হিসেবে টিকে আছে। কারিগরদের হাতের মায়ায় বোনা এসব পণ্য পরিবেশের জন্য শতভাগ নিরাপদ এবং শহুরে আধুনিক অন্দরসজ্জায়ও এখন দারুণ জনপ্রিয়। প্লাস্টিকের বদলে এই হাতে বোনা পণ্যগুলো ব্যবহার করা মানেই গ্রামীণ কারিগরদের মুখে হাসি ফোটানো।",
    "ingredients": [
      "পাতলা করে চেরা বাঁশের শলা",
      "বেত",
      "বাঁধার জন্য সুতা বা চিকন তার"
    ]
  },
  {
    "id": "hari-kolosh",
    "name": "হাঁড়ি ও কলস",
    "altNames": [
      "মাটির পাতিল",
      "কলসি",
      "শখের হাঁড়ি"
    ],
    "category": "processed",
    "unit": "প্রতি পিস",
    "price": null,
    "priceMax": null,
    "image": "images/hari-kolosh.jpg",
    "gallery": [],
    "short": "মাটির হাঁড়ির রান্নার স্নিগ্ধ স্বাদ আর কলসের শীতল পানির তৃপ্তি — প্রকৃতির কাছাকাছি থাকার প্রশান্তিময় উপায়।",
    "history": "আবহমান কাল ধরে গ্রামবাংলার রান্নাঘরে মাটির হাঁড়িতে রান্না করা খাবারের স্নিগ্ধ স্বাদ আর মাটির কলসের শীতল পানির তৃপ্তি এক অনন্য অনুভূতি। জামালপুরের কুমারদের পরম যত্নে গড়া হাঁড়ি ও কলস একসময় দেশের বিভিন্ন প্রান্তে মানুষের প্রতিদিনের প্রয়োজন মেটাত। ধাতব পাত্রের ভিড়ে ব্যবহার কিছুটা কমলেও ঐতিহ্যবাহী 'শখের হাঁড়ি' ও মাটির কলস আজও বৈশাখী মেলা ও ঘর সাজানোর অনন্য অনুষঙ্গ হয়ে আছে। মাটির পাত্রে রান্না বা পানি সংরক্ষণ কেবল ঐতিহ্যই নয়, বরং প্রকৃতির কাছাকাছি থাকার এক প্রশান্তিময় উপায়।",
    "ingredients": [
      "কাঁকর ও পাথরমুক্ত পরিষ্কার এঁটেল মাটি",
      "পানি",
      "কাঠের চাকা",
      "প্রাকৃতিক বা খনিজ রঙ"
    ]
  },
  {
    "id": "kasa",
    "name": "কাঁসা (কাঁসার তৈজসপত্র)",
    "altNames": [
      "কাঁসার বাসন",
      "ঘটি-বাটি ও থালা"
    ],
    "category": "processed",
    "unit": "প্রতি পিস",
    "price": null,
    "priceMax": null,
    "image": "images/kasa.jpg",
    "gallery": [],
    "short": "আতিথেয়তা ও মর্যাদার উজ্জ্বল নিদর্শন কাঁসার থালা-বাটি, ঘটি, গ্লাস ও বদনা — বংশানুক্রমিক ঐতিহ্যের অমূল্য সম্পদ।",
    "history": "জামালপুরের ইসলামপুরের ঐতিহ্যবাহী কাঁসার থালা-বাটি, ঘটি, গ্লাস ও বদনা বাঙালির আতিথেয়তা ও মর্যাদার এক উজ্জ্বল নিদর্শন। একসময় বিয়ের উপহার থেকে শুরু করে বিশেষ অতিথির পাতে খাবার পরিবেশনে কাঁসার বাসন ব্যবহার করা ছিল গভীর সম্মান ও ভালোবাসার প্রকাশ। প্রজন্মের পর প্রজন্ম ধরে টিকে থাকা এই টেকসই ধাতব বাসনগুলোতে খাবার খাওয়া যেমন স্বাস্থ্যসম্মত, তেমনি এর ঝলমলে রূপ যে কাউকে মুগ্ধ করে। আজও একটি খাঁটি কাঁসার তৈজস ঘরে থাকা মানে বংশানুক্রমিক ঐতিহ্যের এক অমূল্য সম্পদ সংরক্ষণ করা।",
    "ingredients": [
      "তামা ও টিনের সংকর ধাতু (তামা ও রাং-এর নির্দিষ্ট অনুপাত)",
      "মাটির ছাঁচ",
      "কয়লা"
    ]
  }
];

/* ক্যাটাগরির বাংলা নাম (ফিল্টার বাটনে দেখাবে) */
const CATEGORIES = [
  { key: "all",       label: "সব পণ্য" },
  { key: "food",      label: "খাদ্য" },
  { key: "craft",     label: "হস্তশিল্প" },
  { key: "processed", label: "প্রসেশনি" },
];

/* ============================================================
   ৩) সাহায্যকারী ছোট ফাংশন
   ============================================================ */

/** ইংরেজি অঙ্ক (0-9) কে বাংলা অঙ্কে (০-৯) রূপান্তর */
function toBn(num) {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bn[Number(d)]);
}

/** টাকা দেখানোর ফরম্যাট: ২০০ টাকা */
function taka(n) {
  return toBn(n.toLocaleString("en-IN")) + " টাকা";
}

/** দামের লেখা তৈরি: একক দাম / পরিসর / "যোগাযোগ করুন" */
function priceText(p) {
  if (p.price === null) return "মূল্য যোগাযোগ করে জানুন";
  if (p.priceMax) return toBn(p.price) + " – " + toBn(p.priceMax) + " টাকা";
  return taka(p.price);
}

/** অর্ডারের হিসাবে ব্যবহৃত দাম (পরিসর থাকলে সর্বনিম্ন দাম = আনুমানিক) */
function basePrice(p) {
  return p.price === null ? 0 : p.price;
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
  toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
}

/* ============================================================
   ৪) পণ্য দেখানো — কার্ড তৈরি ও গ্রিডে বসানো
   ============================================================ */

/** একটি পণ্যের কার্ডের HTML তৈরি করে */
function productCardHTML(p) {
  // দাম নেই এমন পণ্যে বাটন হয় "মূল্য জানতে চাই" (হোয়াটসঅ্যাপে যায়)
  const btn = p.price === null
    ? `<button class="btn btn-outline btn-sm" onclick="inquiry('${p.id}')">মূল্য জানতে চাই</button>`
    : `<button class="btn btn-primary btn-sm" onclick="openOrder('${p.id}', 1)">অর্ডার করুন</button>`;

  return `
  <article class="product-card">
    <div class="product-thumb" onclick="openDetail('${p.id}')">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <span class="cat-badge">${catLabel(p.category)}</span>
    </div>
    <div class="product-body">
      <h3 class="product-name" onclick="openDetail('${p.id}')">${p.name}</h3>
      ${p.altNames.length ? `<p class="alt-names">প্রচলিত নাম: ${p.altNames.join(", ")}</p>` : ""}
      <p class="product-short">${p.short}</p>
      <div class="product-foot">
        <span class="price">${priceText(p)}${p.unit ? `<small> / ${p.unit}</small>` : ""}</span>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="openDetail('${p.id}')">বিস্তারিত</button>
          ${btn}
        </div>
      </div>
    </div>
  </article>`;
}

/** ক্যাটাগরি কোড থেকে বাংলা নাম */
function catLabel(key) {
  const c = CATEGORIES.find((c) => c.key === key);
  return c ? c.label : key;
}

/** সব পণ্য গ্রিডে বসানো (ফিল্টার অনুযায়ী) */
let activeCat = "all"; // এখন কোন ক্যাটাগরি সিলেক্ট করা আছে
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat);
  grid.innerHTML = list.map(productCardHTML).join("");
}

/** ফিল্টার বাটন তৈরি ও ক্লিক হ্যান্ডলার */
function setupFilters() {
  const bar = document.getElementById("filterBar");
  bar.innerHTML = CATEGORIES.map((c) =>
    `<button class="filter-chip${c.key === "all" ? " active" : ""}" data-cat="${c.key}">${c.label}</button>`
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
   ৫) মিল্লি (মিলানী) ফিচার সেকশন — হোমপেজের বিশেষ অংশ
   ============================================================ */
function renderMilaniFeature() {
  const p = PRODUCTS.find((x) => x.id === "milani");
  if (!p) return;
  const box = document.getElementById("milaniSection");
  box.innerHTML = `
    <div class="milani-grid">
      <div class="milani-photo">
        <img src="${(p.gallery && p.gallery[0]) || p.image}" alt="কাঁসার হাঁড়িতে জামালপুরের ঐতিহ্যবাহী মিল্লি / পিঠালি">
        <span class="milani-tag">শতবর্ষের ঐতিহ্য</span>
      </div>
      <div class="milani-info">
        <p class="overline">বিশেষ পরিচিতি</p>
        <h2>${p.name} <span class="milani-alt">(মিলানী)</span></h2>
        <div class="alt-chips">${p.altNames.map((n) => `<span class="chip">${n}</span>`).join("")}</div>
        <p class="milani-history">${p.history}</p>
        <h4 class="ing-title">উপকরণ</h4>
        <ul class="ing-list">${p.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        <div class="milani-cta">
          <div class="stepper" id="milaniStepper">
            <button type="button" data-step="-1">−</button>
            <span id="milaniQty">১</span>
            <button type="button" data-step="1">+</button>
          </div>
          <button class="btn btn-primary" onclick="milaniOrder()">অর্ডার করুন — ${priceText(p)}</button>
        </div>
      </div>
    </div>`;
  setupStepper(document.getElementById("milaniStepper"), document.getElementById("milaniQty"));
}

/** মিল্লি সেকশনের অর্ডার বাটন — স্টেপারের সংখ্যা নিয়ে অর্ডার ফর্ম খোলে */
function milaniOrder() {
  const qty = parseInt(document.getElementById("milaniQty").dataset.val || "1", 10);
  openOrder("milani", qty);
}

/* ============================================================
   ৬) পরিমাণ স্টেপার (− ১ +) — সব জায়গায় একই ফাংশন ব্যবহৃত হয়
   ============================================================ */
function setupStepper(root, displayEl) {
  displayEl.dataset.val = displayEl.dataset.val || "1";
  const paint = () => { displayEl.textContent = toBn(displayEl.dataset.val); };
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
   ৭) পণ্য বিস্তারিত পপআপ (মডাল)
   ============================================================ */
let detailQtyVal = null; // ডিটেইল মডালের স্টেপারের ভ্যালু রাখার জায়গা

function openDetail(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;

  // ছবি গ্যালারি: মূল ছবি + থাম্বনেইল (একাধিক ছবি থাকলে)
  const gal = [p.image].concat(p.gallery || []);
  document.getElementById("dMainImg").src = gal[0];
  document.getElementById("dMainImg").alt = p.name;
  document.getElementById("dThumbs").innerHTML = gal.length > 1
    ? gal.map((src, i) => `<img src="${src}" class="thumb${i === 0 ? " active" : ""}" data-src="${src}" alt="ছবি ${i + 1}">`).join("")
    : "";

  // লেখা অংশ
  document.getElementById("dCat").textContent = catLabel(p.category);
  document.getElementById("dName").textContent = p.name;
  document.getElementById("dAltRow").style.display = p.altNames.length ? "" : "none";
  document.getElementById("dAlt").textContent = p.altNames.join(", ");
  document.getElementById("dHistory").textContent = p.history;
  document.getElementById("dIngList").innerHTML = p.ingredients.map((i) => `<li>${i}</li>`).join("");
  document.getElementById("dPrice").textContent = priceText(p) + (p.unit ? " / " + p.unit : "");

  // অর্ডার বাটন / যোগাযোগ বাটন
  const foot = document.getElementById("dActions");
  if (p.price === null) {
    foot.innerHTML = `<button class="btn btn-green" onclick="inquiry('${p.id}')">হোয়াটসঅ্যাপে মূল্য জানুন</button>
                      <a class="btn btn-outline" href="tel:+${SITE.phoneIntl}">ফোন করুন</a>`;
  } else {
    foot.innerHTML = `
      <div class="stepper" id="dStepper"><button type="button" data-step="-1">−</button>
        <span id="dQty">১</span><button type="button" data-step="1">+</button></div>
      <button class="btn btn-primary" onclick="detailOrder('${p.id}')">অর্ডার করুন</button>`;
    setupStepper(document.getElementById("dStepper"), document.getElementById("dQty"));
  }
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

/** বিস্তারিত মডাল থেকে সরাসরি অর্ডার ফর্মে যাওয়া */
function detailOrder(id) {
  const qty = parseInt(document.getElementById("dQty").dataset.val || "1", 10);
  closeModal("detailModal");
  openOrder(id, qty);
}

/** দাম নেই এমন পণ্যের জন্য হোয়াটসঅ্যাপে কথা বলা */
function inquiry(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const msg = `আসসালামু আলাইকুম। "${p.name}" পণ্যটির মূল্য ও সরবরাহ সম্পর্কে জানতে চাই।`;
  window.open(`https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ============================================================
   ৮) মডাল খোলা/বন্ধ করার সাধারণ ফাংশন
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
   ৯) অর্ডার ফর্ম — পণ্য, পরিমাণ, ক্রেতার তথ্য
   ============================================================ */
let orderProduct = null; // কোন পণ্যের অর্ডার চলছে

// ধাপ ১: অর্ডার পপআপে নাম/মোবাইল/ঠিকানা  →  ধাপ ২: গুগল ফর্ম (ছবি আপলোডসহ) নতুন ট্যাবে
// ধাপ ৩: ফর্ম জমা দিয়ে ফিরে "রসিদ নিন" চাপলে রসিদ তৈরি + অর্ডার তালিকায় জমা
let pendingOrder = null; // ফর্ম পূরণের অপেক্ষায় থাকা অর্ডার

function openOrder(id, qty) {
  pendingOrder = null;
  showOrderStep(1);
  orderProduct = PRODUCTS.find((x) => x.id === id);
  if (!orderProduct) return;

  // ফর্মের ওপরে পণ্যের সারসংক্ষেপ বসানো
  document.getElementById("oSummaryName").textContent = orderProduct.name;
  document.getElementById("oSummaryUnit").textContent =
    (orderProduct.price === null ? "" : taka(orderProduct.price) + " / ") + (orderProduct.unit || "প্রতি পিস");

  const q = document.getElementById("oQty");
  q.dataset.val = String(qty || 1);
  q.textContent = toBn(q.dataset.val);

  updateOrderTotal();
  document.getElementById("oForm").reset();          // পুরোনো লেখা মুছে ফেলা
  document.getElementById("oError").textContent = ""; // ভুলের মেসেজ মুছে ফেলা
  openModal("orderModal");
}

/** পরিমাণ বদলালে মোট মূল্য আপডেট */
function updateOrderTotal() {
  const qty = parseInt(document.getElementById("oQty").dataset.val || "1", 10);
  const totalEl = document.getElementById("oTotal");
  if (orderProduct && orderProduct.price !== null) {
    totalEl.textContent = "মোট মূল্য: " + taka(basePrice(orderProduct) * qty) +
      (orderProduct.priceMax ? " (আনুমানিক — চূড়ান্ত মূল্য সাইজ/নকশা অনুযায়ী)" : "");
  } else {
    totalEl.textContent = "";
  }
}

// অর্ডার ফর্মের স্টেপার চালু করা (পেজ লোডের সময় একবার)
function setupOrderStepper() {
  const root = document.getElementById("oStepper");
  const q = document.getElementById("oQty");
  q.dataset.val = "1"; q.textContent = toBn("1");
  root.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-step]");
    if (!b) return;
    let v = parseInt(q.dataset.val, 10) + Number(b.dataset.step);
    v = Math.min(99, Math.max(1, v));
    q.dataset.val = String(v); q.textContent = toBn(v);
    updateOrderTotal();
  });
}

/** ফর্ম জমা দেওয়া — যাচাই → সেভ → রসিদ দেখানো */
document.addEventListener("submit", (e) => {
  if (e.target.id !== "oForm") return;
  e.preventDefault(); // ব্রাউজারের সাধারণ সাবমিট থামানো (পেজ রিলোড যাবে না)

  const errEl = document.getElementById("oError");
  const name = document.getElementById("oName").value.trim();
  let phone = document.getElementById("oPhone").value.trim().replace(/[\s-]/g, "");
  if (phone.startsWith("+880")) phone = "0" + phone.slice(4);
  else if (phone.startsWith("880")) phone = "0" + phone.slice(3);
  const address = document.getElementById("oAddress").value.trim();
  const note = document.getElementById("oNote").value.trim();
  const qty = parseInt(document.getElementById("oQty").dataset.val || "1", 10);

  /* ---- যাচাই: সব ঘর ঠিক আছে কি না ---- */
  let err = "";
  if (name.length < 2) err = "অনুগ্রহ করে আপনার নাম লিখুন।";
  else if (!/^01[3-9]\d{8}$/.test(phone)) err = "মোবাইল নম্বর ঠিক নয় — ১১ ডিজিটের নম্বর (01XXXXXXXXX) লিখুন।";
  else if (address.length < 6) err = "অনুগ্রহ করে পূর্ণ ঠিকানা লিখুন (গ্রাম/এলাকা, থানা, জেলা)।";
  if (err) { errEl.textContent = err; return; }

  /* ---- অর্ডার অবজেক্ট তৈরি (এখনো সেভ হয়নি — ফর্ম জমার পর সেভ হবে) ---- */
  errEl.textContent = "";
  pendingOrder = createOrder({ name, phone, address, note, qty });

  // গুগল ফর্ম সেট করা না থাকলে সরাসরি রসিদ
  if (!SITE.orderForm && !SITE.formTemplate) { finishOrder(); return; }

  document.getElementById("oStep2No").textContent = pendingOrder.orderNo;
  showOrderStep(2);
  loadFormFrame(); // ফর্মটি পপআপের ভেতরেই দেখাবে
});

/** ধাপ ১ (তথ্য) / ধাপ ২ (ফর্ম জমা নিশ্চিত) দেখানো */
function showOrderStep(n) {
  document.getElementById("oStep1").style.display = n === 1 ? "" : "none";
  document.getElementById("oStep2").style.display = n === 2 ? "" : "none";
  // ফর্ম দেখানোর সময় পপআপ চওড়া, আর ধাপ ১-এ ফিরলে ফ্রেম খালি
  document.querySelector("#orderModal .modal").classList.toggle("modal-wide", n === 2);
  if (n === 1) document.getElementById("oFrame").src = "about:blank";
}

/** গুগল ফর্ম এমবেড করা যায় কি না (শুধু docs.google.com/.../viewform লিংক যায়; forms.gle ছোট লিংক যায় না) */
function embedUrl(o) {
  try {
    const u = new URL(buildFormUrl(o));
    if (u.hostname !== "docs.google.com" || !u.pathname.includes("/viewform")) return null;
    u.searchParams.set("embedded", "true");
    return u.toString();
  } catch (e) { return null; }
}

/** ফর্ম পপআপের ভেতরে লোড; এমবেড সম্ভব না হলে নতুন ট্যাবে */
function loadFormFrame() {
  const frameWrap = document.getElementById("oFrameWrap");
  const url = pendingOrder && embedUrl(pendingOrder);
  if (url) {
    frameWrap.style.display = "";
    document.getElementById("oFrame").src = url;
  } else {
    frameWrap.style.display = "none";
    openGoogleForm();
  }
}

/** প্রি-ফিলড টেমপ্লেট থাকলে অর্ডারের তথ্য বসিয়ে গুগল ফর্মের লিংক বানানো */
function buildFormUrl(o) {
  if (!SITE.formTemplate) return SITE.orderForm;
  try {
    const u = new URL(SITE.formTemplate);
    const map = {
      NAME: o.name, PHONE: o.phone, ADDRESS: o.address,
      PRODUCT: o.productName, QTY: o.qty + " (" + o.unit + ")",
      TOTAL: o.total ? taka(o.total) : "যোগাযোগে জানানো হবে",
      ORDERNO: o.orderNo, NOTE: o.note || "",
    };
    [...u.searchParams.keys()].forEach((k) => {
      const v = (u.searchParams.get(k) || "").trim().toUpperCase();
      if (Object.prototype.hasOwnProperty.call(map, v)) u.searchParams.set(k, map[v]);
    });
    return u.toString();
  } catch (e) { return SITE.orderForm || SITE.formTemplate; }
}

function openGoogleForm() {
  if (!pendingOrder) return;
  window.open(buildFormUrl(pendingOrder), "_blank", "noopener");
}

/** "ফর্ম জমা দিয়েছি — রসিদ নিন" — অর্ডার সেভ করে রসিদ দেখানো */
function finishOrder() {
  if (!pendingOrder) return;
  const order = pendingOrder;
  pendingOrder = null;
  saveOrder(order);
  closeModal("orderModal");
  showReceipt(order);
  toast("অর্ডার সফল হয়েছে — রসিদ সংরক্ষণ করুন");
}

/* ============================================================
   ১০) অর্ডার নম্বর ও সেভ ব্যবস্থা (localStorage)
   ------------------------------------------------------------
   অর্ডার নম্বর হয়: JPH-২০২৬১১১৫-০০১ (তারিখ + সেই দিনের ক্রম)
   localStorage = ব্রাউজারের নিজের স্টোরেজ — নেট ছাড়াও কাজ করে।
   ============================================================ */
const LS_KEY = "jph_orders"; // localStorage-এ অর্ডার যে নামে জমা হয়

function getOrders() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function createOrder(info) {
  const orders = getOrders();
  const today = new Date();
  const ymd = today.getFullYear() + String(today.getMonth() + 1).padStart(2, "0") +
              String(today.getDate()).padStart(2, "0");
  // আজকের অর্ডার কয়টা আছে গুনে পরের ক্রম নম্বর
  const seq = orders.filter((o) => o.date.startsWith(ymd)).length + 1;
  const price = orderProduct.price === null ? 0 : basePrice(orderProduct);
  return {
    orderNo: "JPH-" + ymd + "-" + String(seq).padStart(3, "0"),
    date: today.toISOString(),
    id: orderProduct.id,
    productName: orderProduct.name,
    unit: orderProduct.unit || "প্রতি পিস",
    price, priceMax: orderProduct.priceMax || null,
    qty: info.qty, total: price * info.qty,
    name: info.name, phone: info.phone, address: info.address, note: info.note,
  };
}

function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  try { localStorage.setItem(LS_KEY, JSON.stringify(orders)); }
  catch { /* স্টোরেজ ভরা থাকলেও রসিদ তো দেখানোই হবে */ }
}

/* ============================================================
   ১১) রসিদ — দেখানো, প্রিন্ট/PDF, ডাউনলোড, হোয়াটসঅ্যাপ
   ============================================================ */
let currentOrder = null; // এখন যে রসিদ দেখা হচ্ছে

/** রসিদ মডালে অর্ডারের তথ্য বসিয়ে দেখানো */
function showReceipt(order) {
  currentOrder = order;
  document.getElementById("rOrderNo").textContent = order.orderNo;
  document.getElementById("rDate").textContent = bnDate(new Date(order.date));
  document.getElementById("rName").textContent = order.name;
  document.getElementById("rPhone").textContent = toBn(order.phone);
  document.getElementById("rAddress").textContent = order.address;

  // পণ্যের সারি (এক পণ্যের অর্ডার হয়)
  const priceTxt = order.priceMax
    ? toBn(order.price) + " – " + toBn(order.priceMax)
    : toBn(order.price);
  document.getElementById("rItemRow").innerHTML = `
    <td>${order.productName}</td>
    <td>${priceTxt}${order.priceMax ? " (আনুমানিক)" : ""}</td>
    <td>${toBn(order.qty)} × ${order.unit}</td>
    <td class="num">${taka(order.total)}</td>`;

  document.getElementById("rTotal").textContent = taka(order.total);
  document.getElementById("rNote").style.display = order.note ? "" : "none";
  document.getElementById("rNoteText").textContent = order.note;

  openModal("receiptModal");
}

/** প্রিন্ট বাটন — কেবল রসিদ প্রিন্ট হয় (সেভ করে PDF-ও করা যায়) */
function printReceipt() {
  // রসিদের HTML লুকানো printRoot-এ কপি করা হয়; @media print নিয়ম
  // প্রিন্টের সময় পুরো পেজ লুকিয়ে শুধু রসিদ দেখায়
  const root = document.getElementById("printRoot");
  root.innerHTML = document.getElementById("rPaper").outerHTML;
  document.body.classList.add("printing");
  window.print(); // প্রিন্ট ডায়ালগ — "Save as PDF" ও সিলেক্ট করা যায়
  document.body.classList.remove("printing");
  root.innerHTML = "";
}

/** রসিদ আলাদা HTML ফাইল হিসেবে ডাউনলোড — মোবাইলেও কাজ করে */
function downloadReceipt() {
  if (!currentOrder) return;
  const html = `<!DOCTYPE html>
<html lang="bn"><head><meta charset="UTF-8">
<title>রসিদ ${currentOrder.orderNo}</title>
<style>${RECEIPT_CSS}</style></head>
<body><div class="receipt">${document.getElementById("rPaper").innerHTML}</div></body></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "receipt-" + currentOrder.orderNo + ".html";
  a.click(); // ডাউনলোড শুরু
  URL.revokeObjectURL(a.href);
  toast("রসিদ ডাউনলোড হয়েছে");
}

/** হোয়াটসঅ্যাপে অর্ডারের হিসাব পাঠানো (দোকানের নম্বরে) */
function sendWhatsapp() {
  if (!currentOrder) return;
  const o = currentOrder;
  const lines = [
    "আসসালামু আলাইকুম — নতুন অর্ডার",
    "রসিদ নং: " + o.orderNo,
    "পণ্য: " + o.productName,
    "পরিমাণ: " + o.qty + " (" + o.unit + ")",
    "মোট মূল্য: " + o.total + " টাকা" + (o.priceMax ? " (আনুমানিক)" : ""),
    "ক্রেতা: " + o.name,
    "মোবাইল: " + o.phone,
    "ঠিকানা: " + o.address,
    o.note ? "নোট: " + o.note : "",
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(lines)}`, "_blank");
}

/** ডাউনলোড করা রসিদ ফাইলে যে স্টাইল বসবে */
const RECEIPT_CSS = `
  body{font-family:'Hind Siliguri','Noto Sans Bengali',sans-serif;background:#eee;padding:20px;}
  .receipt{max-width:480px;margin:0 auto;background:#fff;color:#3b2a1d;border:2px solid #b04e26;
    padding:26px 28px;font-size:15px;line-height:1.7;}
  .r-head{text-align:center;border-bottom:2px double #b04e26;padding-bottom:12px;margin-bottom:14px;}
  .r-head h2{margin:0;font-size:22px;color:#b04e26;}
  .r-head p{margin:3px 0;font-size:13px;}
  .r-title{background:#b04e26;color:#fff7ec;text-align:center;padding:4px;border-radius:6px;
    font-weight:600;letter-spacing:1px;margin:10px 0 14px;}
  .r-row{display:flex;justify-content:space-between;gap:10px;}
  .r-row b{font-weight:600;}
  table{width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;}
  th,td{border:1px solid #e8d6bc;padding:7px 9px;text-align:left;}
  th{background:#f3e3cb;}
  td.num{text-align:right;}
  .r-total{display:flex;justify-content:space-between;font-size:17px;font-weight:700;
    background:#f3e3cb;padding:9px 12px;border-radius:8px;}
  .r-note{background:#fdf6eb;border:1px dashed #b04e26;border-radius:8px;padding:8px 12px;margin:12px 0;font-size:13px;}
  .r-sign{display:flex;justify-content:space-between;margin-top:34px;font-size:13px;}
  .r-sign span{border-top:1px solid #3b2a1d;padding-top:4px;min-width:130px;text-align:center;}
  .r-thanks{text-align:center;margin-top:14px;color:#4a6b4e;font-weight:600;}`;

/* ============================================================
   ১২) অ্যাডমিন প্যানেল — পিন দিয়ে অর্ডার দেখা ও CSV
   ------------------------------------------------------------
   গুরুত্বপূর্ণ: localStorage শুধু যে ব্রাউজারে অর্ডার হয়েছে
   সেই ডিভাইসেই জমা থাকে। তাই দোকানদারের দেখার প্রধান উপায়
   হলো কাস্টমারের হোয়াটসঅ্যাপ/রসিদ — অ্যাডমিন প্যানেল নিজের
   ডিভাইসে পরীক্ষা ও হিসাব রাখার জন্য।
   ============================================================ */
let adminOk = false; // পিন মিলেছে কি না

function openAdmin() {
  adminOk = false;
  document.getElementById("aLogin").style.display = "";
  document.getElementById("aPanel").style.display = "none";
  document.getElementById("aPin").value = "";
  document.getElementById("aLoginErr").textContent = "";
  openModal("adminModal");
  setTimeout(() => document.getElementById("aPin").focus(), 100);
}

/** পিন মিলিয়ে দেখা */
function adminLogin() {
  const pin = document.getElementById("aPin").value.trim();
  if (pin === SITE.adminPin) {
    adminOk = true;
    document.getElementById("aLogin").style.display = "none";
    document.getElementById("aPanel").style.display = "";
    renderAdminTable();
    if (typeof editorOpen === "function") editorOpen();
  } else {
    document.getElementById("aLoginErr").textContent = "পিন ভুল — আবার চেষ্টা করুন।";
  }
}

/** অর্ডারের টেবিল আঁকা */
function renderAdminTable() {
  const orders = getOrders().slice().reverse(); // নতুন অর্ডার ওপরে
  const tbody = document.getElementById("aTbody");
  document.getElementById("aCount").textContent = "মোট অর্ডার: " + toBn(orders.length);
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:22px;color:#8a6b4f;">এখনো কোনো অর্ডার জমা হয়নি</td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map((o) => `
    <tr>
      <td>${o.orderNo}</td>
      <td>${bnDate(new Date(o.date))}</td>
      <td>${o.productName}</td>
      <td>${toBn(o.qty)} × ${o.unit}</td>
      <td>${taka(o.total)}</td>
      <td>${o.name}</td>
      <td>${toBn(o.phone)}</td>
      <td>${o.address}</td>
      <td>${o.note || "—"}</td>
    </tr>`).join("");
}

/** CSV ডাউনলোড (Excel-এ খোলা যায়) — বাংলা ভালো দেখাতে UTF-8 BOM দেওয়া হয় */
function downloadCSV() {
  const orders = getOrders();
  if (!orders.length) { toast("কোনো অর্ডার নেই"); return; }
  const head = ["অর্ডার নং","তারিখ","পণ্য","পরিমাণ","একক","মোট (টাকা)","ক্রেতার নাম","মোবাইল","ঠিকানা","নোট"];
  const rows = orders.map((o) => [
    o.orderNo, new Date(o.date).toLocaleString("en-GB"), o.productName, o.qty, o.unit,
    o.total, o.name, o.phone, o.address.replace(/\n/g, " "), o.note,
  ]);
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = "\uFEFF" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const d = new Date();
  a.download = "orders-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") +
               String(d.getDate()).padStart(2, "0") + ".csv";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("CSV ডাউনলোড হয়েছে");
}

/** সব অর্ডার মুছে ফেলা (সাবধানতার সাথে) */
function clearOrders() {
  if (!confirm("সব অর্ডার মুছে ফেলবেন? এটি আর ফিরে আসবে না।")) return;
  localStorage.removeItem(LS_KEY);
  renderAdminTable();
  toast("সব অর্ডার মুছে ফেলা হয়েছে");
}

/* ============================================================
   ১৩) ঐচ্ছিক: গুগল ফর্মে অর্ডার পাঠানো
   ------------------------------------------------------------
   আপনার গুগল ফর্মটি এখন "সাইন-ইন ছাড়া যে কেউ" সেট নয়,
   তাই আপাতত বন্ধ (enabled: false) আছে। চালু করতে চাইলে:
     ১) গুগল ফর্ম Settings → Responses → "Limit to 1 response" অফ রাখুন
     ২) ফর্মটি Share → "Anyone with the link" করুন (তাতে সাইন-ইন লাগবে না)
     ৩) ফর্মে ৮টি প্রশ্ন এই ক্রমে রাখুন (Short answer):
        পণ্যের নাম, পরিমাণ ও একক, মোট মূল্য, ক্রেতার নাম, মোবাইল,
        পূর্ণ ঠিকানা (Paragraph), অর্ডার নং, নোট
     ৪) ফর্ম প্রিভিউ পেজের সোর্স (Ctrl+U) থেকে প্রতিটি প্রশ্নের
        entry ID (যেমন entry.123456789) কপি করে নিচে বসান
     ৫) enabled: true করুন — তখন থেকে সব অর্ডার গুগল শিটেও জমা হবে
   ============================================================ */
const GOOGLE_FORM = {
  enabled: false, // ← গুগল ফর্ম চালু করতে true করুন
  formId: "1XoYf8avbDvanpdrsLoyz1PZA2KkV8rNjdS9AnLYoIzk",
  entry: { product: "", qty: "", total: "", name: "", phone: "", address: "", orderNo: "", note: "" },
};

function maybeSendToGoogleForm(order) {
  if (!GOOGLE_FORM.enabled) return; // বন্ধ থাকলে কিছুই করা হয় না
  try {
    const fd = new FormData();
    const map = {
      product: order.productName,
      qty: order.qty + " (" + order.unit + ")",
      total: order.total,
      name: order.name, phone: order.phone,
      address: order.address, orderNo: order.orderNo, note: order.note,
    };
    Object.keys(map).forEach((k) => {
      if (GOOGLE_FORM.entry[k]) fd.append("entry." + GOOGLE_FORM.entry[k].replace("entry.", ""), map[k]);
    });
    // no-cors মোডে পোস্ট — গুগল ফর্ম CORS আটকায় না
    fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM.formId}/formResponse`, {
      method: "POST", mode: "no-cors", body: fd,
    });
  } catch (e) { /* গুগল ফর্মে না গেলেও রসিদ ও localStorage তো আছেই */ }
}

/* ============================================================
   ১৪) পেজ লোড — সব সেটআপ একসাথে চালানো
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  // সংরক্ষিত কনটেন্ট (data/content.json বা ড্রাফট) থাকলে আগে বসানো — editor.js এ আছে
  if (typeof loadContent === "function") { try { await loadContent(); } catch (e) {} }
  setupFilters();        // ক্যাটাগরি বাটন
  renderProducts();      // পণ্যের গ্রিড
  renderMilaniFeature(); // মিল্লি বিশেষ অংশ
  setupOrderStepper();   // অর্ডার ফর্মের স্টেপার

  // মোবাইল মেনু (হ্যামবার্গার) চালু
  const burger = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

  // সাল ফুটারে বসানো
  document.getElementById("footYear").textContent = toBn(new Date().getFullYear());
});
