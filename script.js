/* ============================================================
   জামালপুর ঐতিহ্য হাট — script.js
   ------------------------------------------------------------
   এই ফাইলে ওয়েবসাইটের সব "কাজ" নিয়ন্ত্রিত হয়:
     ১) পণ্যের ডাটা দেখানো (কার্ড + বিস্তারিত) — কোনো দাম নেই
     ২) ক্যাটাগরি ফিল্টার
     ৩) প্রি-অর্ডার পপআপ (ফোন নম্বর + গুগল ফর্ম নতুন ট্যাবে)
     ৪) ইন্টারেস্টেড ফর্ম (নাম, মোবাইল, ছাত্র আইডি, পরিমাণ)
     ৫) আগ্রহের রসিদ — ছবি (PNG) হিসেবে ডাউনলোড + হোয়াটসঅ্যাপ
     ৬) অ্যাডমিন প্যানেল (পিন দিয়ে আগ্রহীদের তালিকা + CSV)
   ★ গুরুত্বপূর্ণ: এই সাইটে কোথাও কোনো দাম/মূল্য দেখানো হয় না।
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
  adminPin: "1789",                          // অ্যাডমিন পিন — চাইলে বদলান
  // প্রি-অর্ডারের গুগল ফর্ম — ওয়েবসাইটের বাইরে নতুন ট্যাবে খোলে
  googleFormUrl: "https://docs.google.com/forms/d/1XoYf8avbDvanpdrsLoyz1PZA2KkV8rNjdS9AnLYoIzk/viewform",
};

/* ============================================================
   ২) পণ্যের ডাটা — নতুন পণ্য যোগ/বাদ দিতে চাইলে এখানে করুন
   ------------------------------------------------------------
   প্রতিটি পণ্যের অর্থ:
     id         : ইংরেজিতে ছোট নাম (কোডে চেনার জন্য)
     name       : পণ্যের নাম (বাংলা)
     altNames   : প্রচলিত অন্যান্য নাম (যেমন মিলির ম্যান্দা)
     category   : "food" (খাদ্য) / "craft" (হস্তশিল্প) / "processed" (প্রক্রিয়াজাত)
     unit       : বিক্রির একক (প্রতি প্লেট, প্রতি কেজি...) — রসিদে পরিমাণের সাথে বসে
     image      : মূল ছবি (images ফোল্ডারের ফাইল)
     gallery    : বিস্তারিত পপআপে দেখানোর অতিরিক্ত ছবি
     short      : কার্ডে দেখানো ১-২ লাইনের সারসংক্ষেপ
     history    : ঐতিহ্যের গল্প
     ingredients: উপকরণ/উপাদানের তালিকা
   ★ দাম (price) এখন আর রাখা হয় নি — সাইটে দাম দেখানো হয় না।
   ============================================================ */
const PRODUCTS = [
  {
    "id": "milani",
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

/* ক্যাটাগরির বাংলা নাম (ফিল্টার বাটনে দেখাবে) */
const CATEGORIES = [
  { key: "all",       label: "সব পণ্য" },
  { key: "food",      label: "খাদ্য" },
  { key: "craft",     label: "হস্তশিল্প" },
  { key: "processed", label: "প্রক্রিয়াজাত" },
];

/* ============================================================
   ৩) সাহায্যকারী ছোট ফাংশন
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

/* ============================================================
   ৪) পণ্য দেখানো — কার্ড তৈরি ও গ্রিডে বসানো
   ------------------------------------------------------------
   প্রতিটি কার্ডের নিচে ৩টি বাটন:
     বিস্তারিত   → পণ্যের গল্প/উপকরণ দেখা (দাম নেই)
     প্রি-অর্ডার → ফোন নম্বর + গুগল ফর্ম
     ইন্টারেস্টেড → আগ্রহ জানানোর ফর্ম + রসিদ
   ============================================================ */

/** একটি পণ্যের কার্ডের HTML তৈরি করে */
function productCardHTML(p) {
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
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" onclick="openDetail('${p.id}')">বিস্তারিত</button>
          <button class="btn btn-primary btn-sm" onclick="openPreOrder('${p.id}')">প্রি-অর্ডার</button>
          <button class="btn btn-green btn-sm" onclick="openInterested('${p.id}')">ইন্টারেস্টেড</button>
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
   ৫) মিলি (মিলানি) ফিচার সেকশন — হোমপেজের বিশেষ অংশ
   ============================================================ */
function renderMilaniFeature() {
  const p = PRODUCTS.find((x) => x.id === "milani");
  if (!p) return;
  const box = document.getElementById("milaniSection");
  box.innerHTML = `
    <div class="milani-grid">
      <div class="milani-photo">
        <img src="images/milani-banner.jpg" alt="কাঁসার হাঁড়িতে জামালপুরের ঐতিহ্যবাহী মিলি / পিঠালি">
        <span class="milani-tag">শতবর্ষের ঐতিহ্য</span>
      </div>
      <div class="milani-info">
        <p class="overline">বিশেষ পরিচিতি</p>
        <h2>${p.name} <span class="milani-alt">(মিলানি)</span></h2>
        <div class="alt-chips">${p.altNames.map((n) => `<span class="chip">${n}</span>`).join("")}</div>
        <p class="milani-history">${p.history}</p>
        <h4 class="ing-title">উপকরণ</h4>
        <ul class="ing-list">${p.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        <div class="milani-cta">
          <button class="btn btn-primary" onclick="openPreOrder('milani')">প্রি-অর্ডার করুন</button>
          <button class="btn btn-green" onclick="openInterested('milani')">ইন্টারেস্টেড</button>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   ৬) পরিমাণ স্টেপার (− ১ +) — ইন্টারেস্টেড ফর্মে ব্যবহৃত হয়
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
   ৭) পণ্য বিস্তারিত পপআপ (মডাল) — দাম ছাড়া
   ============================================================ */
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

  // লেখা অংশ (দাম দেখানো হয় না)
  document.getElementById("dCat").textContent = catLabel(p.category);
  document.getElementById("dName").textContent = p.name;
  document.getElementById("dAltRow").style.display = p.altNames.length ? "" : "none";
  document.getElementById("dAlt").textContent = p.altNames.join(", ");
  document.getElementById("dHistory").textContent = p.history;
  document.getElementById("dIngList").innerHTML = p.ingredients.map((i) => `<li>${i}</li>`).join("");

  // নিচের বাটন: প্রি-অর্ডার + ইন্টারেস্টেড + ফোন
  document.getElementById("dActions").innerHTML = `
    <button class="btn btn-primary" onclick="openPreOrder('${p.id}')">প্রি-অর্ডার করুন</button>
    <button class="btn btn-green" onclick="openInterested('${p.id}')">ইন্টারেস্টেড</button>
    <a class="btn btn-outline" href="tel:+${SITE.phoneIntl}">ফোন করুন</a>`;

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
   ৯) প্রি-অর্ডার পপআপ
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

  // পণ্যের নাম ও একক বসানো
  document.getElementById("poName").textContent = preProduct.name;
  document.getElementById("poUnit").textContent = preProduct.unit || "প্রতি পিস";

  // হোয়াটসঅ্যাপ মেসেজে পণ্যের নাম বসিয়ে লিংক তৈরি
  const msg = `আসসালামু আলাইকুম। আমি "${preProduct.name}" পণ্যটি প্রি-অর্ডার করতে চাই।`;
  document.getElementById("poWhatsapp").href =
    `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(msg)}`;

  // গুগল ফর্মের লিংক (কনফিগ থেকে নেওয়া — নতুন ট্যাবে খোলে)
  document.getElementById("poGoogleForm").href = SITE.googleFormUrl;

  // বিস্তারিত মডাল খোলা থাকলে সেটি বন্ধ করা
  closeModal("detailModal");
  openModal("preOrderModal");
}

/* ============================================================
   ১০) ইন্টারেস্টেড (আগ্রহ) ফর্ম
   ------------------------------------------------------------
   নাম, মোবাইল নম্বর ও ছাত্র আইডি (Student ID — বাধ্যতামূলক)
   নিয়ে + কাঙ্ক্ষিত পরিমাণ নির্বাচন করে আগ্রহ জানানো হয়।
   জমা দিলে আগ্রহের রসিদ তৈরি হয় (নিচের অংশে)।
   ============================================================ */
let interestProduct = null; // কোন পণ্যে আগ্রহ

function openInterested(id) {
  interestProduct = PRODUCTS.find((x) => x.id === id);
  if (!interestProduct) return;

  document.getElementById("iName").textContent = interestProduct.name;
  document.getElementById("iUnit").textContent = interestProduct.unit || "প্রতি পিস";

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

  /* ---- যাচাই: সব ঘর ঠিক আছে কি না ---- */
  let err = "";
  if (name.length < 2) err = "অনুগ্রহ করে আপনার নাম লিখুন।";
  else if (!/^01[3-9]\d{8}$/.test(phone)) err = "মোবাইল নম্বর ঠিক নয় — ১১ ডিজিটের নম্বর (01XXXXXXXXX) লিখুন।";
  else if (!studentId) err = "ছাত্র আইডি (Student ID) দেওয়া বাধ্যতামূলক — অনুগ্রহ করে আপনার আইডি লিখুন।";
  else if (studentId.length < 2) err = "ছাত্র আইডি ঠিক নয় — অন্তত ২ অক্ষরের আইডি লিখুন।";
  if (err) { errEl.textContent = err; return; }

  /* ---- আগ্রহের রেকর্ড তৈরি ও সেভ ---- */
  const interest = createInterest({ name, phone, studentId, qty });
  saveInterest(interest);

  /* ---- ফর্ম বন্ধ করে রসিদ দেখানো ---- */
  closeModal("interestModal");
  showReceipt(interest);
  toast("আগ্রহ নিশ্চিত হয়েছে — রসিদের ছবি ডাউনলোড করুন");
});

/* ============================================================
   ১১) রসিদ নম্বর ও সেভ ব্যবস্থা (localStorage)
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
  catch { /* স্টোরেজ ভরা থাকলেও রসিদ তো দেখানোই হবে */ }
}

/* ============================================================
   ১২) আগ্রহের রসিদ — প্রিভিউ + ছবি (PNG) ডাউনলোড + হোয়াটসঅ্যাপ
   ------------------------------------------------------------
   রসিদ দুইভাবে দেখা যায়:
     ক) স্ক্রিনে: rPaper নামের HTML অংশে (index.html-এ)
     খ) ছবি হিসেবে: Canvas-এ এঁকে PNG ডাউনলোড (ছবি আকারে ডাউনলোড)
   ============================================================ */
let currentReceipt = null; // এখন যে রসিদ দেখা হচ্ছে

/** রসিদ মডালে আগ্রহের তথ্য বসিয়ে দেখানো */
function showReceipt(r) {
  currentReceipt = r;
  document.getElementById("rOrderNo").textContent = toBn(r.no);
  document.getElementById("rDate").textContent = bnDate(new Date(r.date));
  document.getElementById("rName").textContent = r.name;
  document.getElementById("rPhone").textContent = toBn(r.phone);
  document.getElementById("rStudent").textContent = r.studentId;
  document.getElementById("rProduct").textContent = r.productName;
  document.getElementById("rQty").textContent = toBn(r.qty) + " × " + r.unit;
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
  const infoLines = wrapText(ctx,
    "এই রসিদ আপনার আগ্রহ নিশ্চিত করার প্রমাণ। ছবিটি ডাউনলোড করে আমাদের হোয়াটসঅ্যাপে (০১৩০৪৫৪২২০৪) পাঠান — আমরা দ্রুত আপনার সাথে যোগাযোগ করব।", IW - 28);
  ctx.font = bodyFont(600, 16);
  const productLines = wrapText(ctx, r.productName, IW - 110);
  const qtyLine = toBn(r.qty) + " × " + r.unit;

  // সারিগুলোর তালিকা: {label, value} বা {sep: true} = ড্যাশ লাইন
  const rows = [
    { label: "রসিদ নং", value: toBn(r.no) },
    { label: "তারিখ",   value: bnDate(new Date(r.date)) },
    { sep: true },
    { label: "নাম",        value: r.name },
    { label: "মোবাইল",     value: toBn(r.phone) },
    { label: "ছাত্র আইডি", value: r.studentId },
    { sep: true },
  ];
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
  ctx.fillText(SITE.address + " · ফোন: " + toBn(SITE.phone), W / 2, y); y += 14;

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
  ctx.fillText("পণ্য:", M + 16, iy);
  ctx.fillStyle = "#b04e26";
  ctx.font = bodyFont(600, 16);
  productLines.forEach((ln, k) => ctx.fillText(ln, M + 92, iy + k * 26));
  iy += productLines.length * 26;
  ctx.fillStyle = "#6b4a2e";
  ctx.font = bodyFont(400, 14.5);
  ctx.fillText("পরিমাণ:", M + 16, iy);
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
  ctx.fillText("আমাদের ঐতিহ্যে আগ্রহ দেখানোর জন্য ধন্যবাদ!", W / 2, y + 26);
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
    toast("রসিদের ছবি ডাউনলোড হয়েছে — এখন হোয়াটসঅ্যাপে পাঠান");
  });
}

/** "হোয়াটসঅ্যাপে পাঠান" বাটন — রসিদের হিসাবসহ মেসেজ খোলা
 *  ছবিটি আগে ডাউনলোড করে হোয়াটসঅ্যাপে মেসেজের সাথে সংযুক্ত (attach) করতে হবে। */
function sendReceiptWhatsapp() {
  if (!currentReceipt) return;
  const r = currentReceipt;
  const lines = [
    "আসসালামু আলাইকুম — ইন্টারেস্টেড (আগ্রহ জানানো)",
    "রসিদ নং: " + r.no,
    "পণ্য: " + r.productName,
    "পরিমাণ: " + r.qty + " (" + r.unit + ")",
    "নাম: " + r.name,
    "মোবাইল: " + r.phone,
    "ছাত্র আইডি: " + r.studentId,
    "রসিদের ছবিটি সাথে পাঠাচ্ছি।",
  ].join("\n");
  window.open(`https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(lines)}`, "_blank");
}

/* ============================================================
   ১৩) অ্যাডমিন প্যানেল — পিন দিয়ে আগ্রহীদের তালিকা ও CSV
   ------------------------------------------------------------
   গুরুত্বপূর্ণ: localStorage শুধু যে ব্রাউজারে ফর্ম জমা হয়েছে
   সেই ডিভাইসেই জমা থাকে। তাই দোকানদারের দেখার প্রধান উপায়
   হলো কাস্টমারের হোয়াটসঅ্যাপ রসিদ — অ্যাডমিন প্যানেল নিজের
   ডিভাইসে পরীক্ষা ও হিসাব রাখার জন্য।
   ============================================================ */

function openAdmin() {
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
    document.getElementById("aLogin").style.display = "none";
    document.getElementById("aPanel").style.display = "";
    renderAdminTable();
  } else {
    document.getElementById("aLoginErr").textContent = "পিন ভুল — আবার চেষ্টা করুন।";
  }
}

/** আগ্রহীদের টেবিল আঁকা */
function renderAdminTable() {
  const list = getInterests().slice().reverse(); // নতুন আগ্রহ ওপরে
  const tbody = document.getElementById("aTbody");
  document.getElementById("aCount").textContent = "মোট আগ্রহ: " + toBn(list.length);
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:22px;color:#8a6b4f;">এখনো কোনো আগ্রহ জমা হয়নি</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((r) => `
    <tr>
      <td>${toBn(r.no)}</td>
      <td>${bnDate(new Date(r.date))}</td>
      <td>${r.productName}</td>
      <td>${toBn(r.qty)} × ${r.unit}</td>
      <td>${r.name}</td>
      <td>${toBn(r.phone)}</td>
      <td>${r.studentId}</td>
    </tr>`).join("");
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
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = "\uFEFF" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
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

/* ============================================================
   ১৪) পেজ লোড — সব সেটআপ একসাথে চালানো
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  setupFilters();          // ক্যাটাগরি বাটন
  renderProducts();        // পণ্যের গ্রিড
  renderMilaniFeature();   // মিলি বিশেষ অংশ
  setupInterestStepper();  // ইন্টারেস্টেড ফর্মের স্টেপার

  // গুগল ফর্মের লিংক কনফিগ থেকে বসানো (নতুন ট্যাবে খোলে)
  const gf = document.getElementById("poGoogleForm");
  if (gf) gf.href = SITE.googleFormUrl;

  // মোবাইল মেনু (হ্যামবার্গার) চালু
  const burger = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

  // সাল ফুটারে বসানো
  document.getElementById("footYear").textContent = toBn(new Date().getFullYear());
});
