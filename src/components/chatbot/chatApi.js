/**
 * ============================================================
 *  Signature AI – Chat API layer
 * ============================================================
 *
 *  The chatbot talks to the backend ONLY through this file.
 *  Today it answers with local mock responses so the whole UI
 *  can be tested without any server or AI API key.
 *
 *  🌐 LANGUAGE MIRRORING:
 *     Every reply is written in 3 variants – English (en),
 *     Roman Urdu (ro) and اردو script (ur). The language of the
 *     user's message is detected automatically and the reply is
 *     returned in the SAME language. When the ASP.NET Core API
 *     goes live, it should mirror the user's language the same
 *     way (detect on the server, return { reply } in that
 *     language).
 *
 *  ➜ When your ASP.NET Core API is ready:
 *      1. Set USE_MOCK_RESPONSES = false
 *      2. Set VITE_API_BASE_URL in a .env file, e.g.
 *             VITE_API_BASE_URL=https://localhost:7001
 *         (leave it empty if the API is served from the same origin)
 *      3. That's it – the frontend will call:
 *             POST  {base}/api/chat
 *             Body: { "message": "user message" }
 *             Resp: { "reply":   "AI response" }
 *
 *  ⚠️  NEVER put an AI API key inside the React frontend.
 *      The key belongs in your ASP.NET Core backend only.
 * ============================================================
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export const CHAT_ENDPOINT = `${API_BASE}/api/chat`;

/** Flip to false as soon as the ASP.NET Core /api/chat endpoint is live. */
export const USE_MOCK_RESPONSES = true;

/* ------------------------------------------------------------------ */
/*  Language detection (en / Roman Urdu / Urdu script)                 */
/* ------------------------------------------------------------------ */

/** Urdu / Arabic script characters. */
const URDU_SCRIPT_RE = /[\u0600-\u06FF\u0750-\u077F]/;

/**
 * Distinctive Roman-Urdu words that never appear in normal English.
 * (Kept intentionally specific to avoid false positives.)
 */
const ROMAN_URDU_RE =
  /\b(kia|kya|kaisy|kaisay|kaise|kese|kaisa|kaisi|kitna|kitne|kitni|kitnay|mujhe|mujhy|chahiye|chaheye|chaiye|chahie|hain|hoon|karo|karna|karni|krna|krni|krdo|krdy|batao|bata|bataye|batado|batayein|batana|kyun|kyu|kion|nahi|nhi|acha|achha|accha|theek|thik|thora|thoda|abhi|bhai|yaar|mera|meray|meri|tera|teray|teri|tum|tumhe|tumhara|aap|aapka|aapki|hum|humara|humari|apna|apni|apne|milega|melyga|milta|milti|hota|hoti|hotay|chalta|chalti|jaldi|pehle|phir|bohat|bohot|buhut|zabardast|zara|zarra|bilkul|shukriya|shukeriya|salam|assalam|aoa|waisa|wese|yaani|matlb|matlab|kaunsa|kaunsi|konsa|konsi|hoga|hogi|dedo|dijiye|pooch|poochh|poch|sawaal|jawab|jawaab|karu|karun|karta|karti|sakte|sakti|dikhao|likho|lagta|lagti|wala|wali|hai)\b/i;

/**
 * Detects the language a message is written in.
 * @param {string} text
 * @returns {'en' | 'ro' | 'ur'} English · Roman Urdu · Urdu script
 */
export function detectLanguage(text) {
  const value = String(text ?? '');
  if (URDU_SCRIPT_RE.test(value)) return 'ur';
  if (ROMAN_URDU_RE.test(value)) return 'ro';
  return 'en';
}

/**
 * The language the current conversation has settled on.
 * Quick-reply chips always send English labels ("View Products"),
 * so their answers keep following the language the person has
 * actually been typing in.
 */
let conversationLang = null;

/* ------------------------------------------------------------------ */
/*  Public entry point                                                 */
/* ------------------------------------------------------------------ */

/**
 * Sends the user message and resolves with the AI reply (string).
 * The reply always comes back in the same language as the message.
 * @param {string} message
 * @param {{ signal?: AbortSignal, fromSuggestion?: boolean }} [options]
 * @returns {Promise<string>}
 */
export async function sendChatMessage(message, options = {}) {
  const text = String(message ?? '').trim();
  if (!text) {
    throw new Error('A message is required.');
  }

  if (USE_MOCK_RESPONSES) {
    return getMockReply(text, options);
  }

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`Chat API failed with status ${response.status}`);
  }

  const data = await response.json();
  const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';

  if (!reply) {
    throw new Error('Chat API returned an empty reply.');
  }

  return reply;
}

/* ------------------------------------------------------------------ */
/*  Mock responses (frontend-only, no keys, no network)                */
/* ------------------------------------------------------------------ */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Every intent carries the same answer in all three languages. */
const INTENTS = [
  {
    match: (m) =>
      /\b(return|refund|exchange|replace|wapisa|replacement)\b/i.test(m),
    reply: {
      en: 'Shopping with us is completely risk-free:\n\n• 7-day easy return or exchange\n• Item must be unworn & unwashed with tags\n• Refund is processed within a few working days\n\nJust tell me your order number and I’ll point you in the right direction. 😊',
      ro: 'Shopping bilkul risk-free hai:\n\n• 7 din mein aasani se return ya exchange\n• Item pehna aur dhula na ho, tags lagay hon\n• Refund kuch working days mein process ho jata hai\n\nBas apna order number batayein, main aage sahi raah dikhata hoon. 😊',
      ur: 'شاپنگ بالکل بغیر خطرہ ہے:\n\n• 7 دن میں آسانی سے ریٹرن یا ایکسچینج\n• آئٹم پہنا اور دھولا نہ ہو، ٹیگز لگے ہوں\n• ریفنڈ چند ورکنگ ڈےز میں ہو جاتا ہے\n\nبس اپنا آرڈر نمبر بتائیں، میں آگے صحیح راہ دکھاتا ہوں 😊',
    },
  },
  {
    match: (m) =>
      /\b(cod|cash on delivery|payment|payments|pay|easypaisa|jazzcash|card|debit|credit)\b/i.test(
        m
      ),
    reply: {
      en: 'We accept:\n\n• Cash on Delivery (COD) – all over Pakistan\n• Easypaisa & JazzCash\n• Debit / credit card at checkout\n\nYou only pay after you receive and check your order. 💳',
      ro: 'Hum yeh payment methods accept karte hain:\n\n• Cash on Delivery (COD) – poore Pakistan mein\n• Easypaisa & JazzCash\n• Debit / credit card checkout par\n\nParcel receive karke check karte hi tab payment karni hoti hai. 💳',
      ur: 'ہم یہ ادائیگی کے طریقے قبول کرتے ہیں:\n\n• کیش آن ڈیلیوری (COD) – پورے پاکستان میں\n• ایزی پیسا اور جیز کیش\n• چیک آؤٹ پر ڈیبٹ / کریٹ کارڈ\n\nپارسل وصول کر کے چیک کرتے ہی پھر ادائیگی کرنی ہوتی ہے 💳',
    },
  },
  {
    match: (m) =>
      /\b(track|tracking|order status|where is|parcel|courier|dispatch|delivered|delivery|shipping|ship|deliver)\b/i.test(
        m
      ),
    reply: {
      en: 'You can track your parcel anytime from the menu → Track Order.\n\n• Standard delivery: 3–5 working days, Pan Pakistan\n• Lahore, Karachi & Islamabad: usually 2–3 days\n\nJust keep your order number handy. 📦',
      ro: 'Parcel ka status kisi bhi waqt menu → Track Order se dekh sakte hain:\n\n• Standard delivery: 3–5 working days, Pakistan bhar mein\n• Lahore, Karachi aur Islamabad mein aam tor par 2–3 din\n\nApna order number sath rakhein. 📦',
      ur: 'پارسل کی صورتحال کسی بھی وقت مینیو → ٹریک آرڈر سے دیکھ سکتے ہیں:\n\n• معیاری ڈیلیوری: 3–5 ورکنگ ڈےز، پورے پاکستان میں\n• لاہور، کراچی اور اسلام آباد میں عام طور پر 2–3 دن\n\nاپنا آرڈر نمبر ساتھ رکھیں 📦',
    },
  },
  {
    match: (m) =>
      /\b(order|orders|purchase|buy|checkout|place an order|how to)\b/i.test(m),
    reply: {
      en: 'Here’s how ordering works at Signature Libaas:\n\n1. Add your favourite pieces to the cart\n2. Checkout with COD, Easypaisa or JazzCash\n3. We call you to confirm before dispatch\n4. Delivery in 3–5 working days\n\nNeed help with an order you already placed? Use Track Order from the menu. 🧵',
      ro: 'Signature Libaas par order karna bohot aasaan hai:\n\n1. Apne pasandeeda pieces cart mein daalein\n2. COD, Easypaisa ya JazzCash se checkout karein\n3. Dispatch se pehle confirm ke liye hum call karte hain\n4. 3–5 working days mein delivery\n\nPehle se placed order mein madad chahiye? Menu se Track Order kholein. 🧵',
      ur: 'سگنیچر لباس پر آرڈر کرنا بہت آسان ہے:\n\n1. اپنی پسند کے پیسز کارٹ میں ڈالیں\n2. COD، ایزی پیسا یا جیز کیش سے چیک آؤٹ کریں\n3. ڈسپیچ سے پہلے تصدیق کے لیے ہم کال کرتے ہیں\n4. 3–5 ورکنگ ڈےز میں ڈیلیوری\n\nپہلے سے دیے گئے آرڈر میں مدد چاہیے؟ مینیو سے ٹریک آرڈر کھولیں 🧵',
    },
  },
  {
    match: (m) =>
      /\b(price|prices|pricing|cost|rate|kitna|discount|coupon|sale|off|offer)\b/i.test(
        m
      ),
    reply: {
      en: 'Our current range:\n\n• T-Shirts – Rs. 1,299 to Rs. 1,899\n• Kurtis – Rs. 2,499 to Rs. 4,599\n\nAll prices are in PKR and include taxes. Any discounted price is shown directly on the product page. Want something specific? 🏷️',
      ro: 'Hamari current range yeh hai:\n\n• T-Shirts – Rs. 1,299 se Rs. 1,899\n• Kurtis – Rs. 2,499 se Rs. 4,599\n\nTamam prices PKR mein hain aur taxes included hain. Koi bhi discount price product page par nazar aata hai. Kuch khaas dhoond rahe hain? 🏷️',
      ur: 'ہماری موجودہ رینج یہ ہے:\n\n• ٹی شرٹس – روپے 1,299 سے روپے 1,899\n• کڑیس – روپے 2,499 سے روپے 4,599\n\nتمام قیمتیں پاکستانی روپے میں ہیں اور ٹیکس شامل ہے۔ کوئی بھی رعایتی قیمت پروڈکٹ پیج پر نظر آتی ہے۔ کچھ خاص تلاش کر رہے ہیں؟ 🏷️',
    },
  },
  {
    match: (m) => /\b(kurti|kurtis|kurta|kurtas|anarkali|lawn)\b/i.test(m),
    reply: {
      en: 'Our Kurti collection is one of our bestsellers:\n\n• Embroidered Cotton Kurti – Rs. 2,499\n• Straight Cut Premium Kurta – Rs. 3,199\n• Lawn Embroidered Kurti – Rs. 3,899\n• Anarkali Floral Kurti – Rs. 4,599\n\nOpen Kurtis from the menu to see every design. 👗',
      ro: 'Hamari Kurti collection hamari bestsellers mein se hai:\n\n• Embroidered Cotton Kurti – Rs. 2,499\n• Straight Cut Premium Kurta – Rs. 3,199\n• Lawn Embroidered Kurti – Rs. 3,899\n• Anarkali Floral Kurti – Rs. 4,599\n\nHar design dekhne ke liye menu se Kurtis kholein. 👗',
      ur: 'ہماری کڑی کلیکشن ہماری بیسٹ سیلرز میں سے ہے:\n\n• کڑھائی والی کاٹن کڑی – روپے 2,499\n• سٹریٹ کٹ پریمیم کرتا – روپے 3,199\n• لان کڑھائی والی کڑی – روپے 3,899\n• انارکلی فلورل کڑی – روپے 4,599\n\nہر ڈیزائن دیکھنے کے لیے مینیو سے کڑیس کھولیں 👗',
    },
  },
  {
    match: (m) => /\b(t-?shirts?|tees?|shirt|polo|oversized)\b/i.test(m),
    reply: {
      en: 'For T-Shirts we currently have:\n\n• Classic White Cotton Tee – Rs. 1,299\n• Graphic Print T-Shirt – Rs. 1,499\n• Oversized Streetwear Tee – Rs. 1,599\n• Premium Polo Collar Tee – Rs. 1,899\n\nCheck the T-Shirts page for colours and sizes. 👕',
      ro: 'T-Shirts ki range yeh hai:\n\n• Classic White Cotton Tee – Rs. 1,299\n• Graphic Print T-Shirt – Rs. 1,499\n• Oversized Streetwear Tee – Rs. 1,599\n• Premium Polo Collar Tee – Rs. 1,899\n\nColours aur sizes ke liye T-Shirts page kholein. 👕',
      ur: 'ٹی شرٹس کی رینج یہ ہے:\n\n• کلاسک وائٹ کاٹن ٹی – روپے 1,299\n• گرافک پرنٹ ٹی شرٹ – روپے 1,499\n• اوور سائزڈ سٹریٹ ویئر ٹی – روپے 1,599\n• پریمیم پولو کالر ٹی – روپے 1,899\n\nرنگ اور سائز کے لیے ٹی شرٹس پیج کھولیں 👕',
    },
  },
  {
    match: (m) =>
      /\b(size|sizes|sizing|measurement|measurements|fit|fitted)\b/i.test(m),
    reply: {
      en: 'Here’s our size guide:\n\nS – Chest 36”\nM – Chest 38”\nL – Chest 40”\nXL – Chest 42”\n\nOur tees and kurtis follow a true-to-size regular fit. If you’re between sizes, size up for a relaxed look. You can also open the Size Guide on any product page. 📐',
      ro: 'Yeh raha hamara size guide:\n\nS – Chest 36”\nM – Chest 38”\nL – Chest 40”\nXL – Chest 42”\n\nHamari tees aur kurtis true-to-size regular fit hoti hain. Agar aap do sizes ke darmiyan hon toh relaxed look ke liye size bara lein. Har product page par Size Guide bhi milta hai. 📐',
      ur: 'یہ ہے ہمارا سائز گائیڈ:\n\nS – چیسٹ 36”\nM – چیسٹ 38”\nL – چیسٹ 40”\nXL – چیسٹ 42”\n\nہماری ٹیز اور کڑیس true-to-size ریگولر فٹ ہوتی ہیں۔ اگر آپ دو سائز کے درمیان ہوں تو ریلیکس لوک کے لیے بڑا سائز لیں۔ ہر پروڈکٹ پیج پر سائز گائیڈ بھی موجود ہے 📐',
    },
  },
  {
    match: (m) =>
      /\b(products?|collection|catalog|catalogue|view|browse|shop|show me|new arrivals|variety)\b/i.test(
        m
      ),
    reply: {
      en: 'Here’s what’s trending at Signature Libaas right now:\n\n• T-Shirts – everyday pure-cotton essentials\n• Kurtis – embroidered, lawn & festive styles\n\nOpen T-Shirts or Kurtis from the menu to explore the full collection. Want me to narrow it down? ✨',
      ro: 'Signature Libaas par abhi yeh trend kar raha hai:\n\n• T-Shirts – rozmarra pure-cotton essentials\n• Kurtis – embroidered, lawn aur festive styles\n\nMenu se T-Shirts ya Kurtis kholein aur pura collection dekhein. Koi specific cheez bataun? ✨',
      ur: 'سگنیچر لباس پر ابھی یہ ٹرینڈ میں ہے:\n\n• ٹی شرٹس – روزمرہ خالص کاٹن ایسینشلز\n• کڑیس – کڑھائی، لان اور تہوار والے سٹائل\n\nمینیو سے ٹی شرٹس یا کڑیس کھولیں اور مکمل کلیکشن دیکھیں۔ کوئی خاص چیز بتاؤں؟ ✨',
    },
  },
  {
    match: (m) =>
      /\b(contact|whatsapp|phone|call|email|number|instagram|reach|support)\b/i.test(
        m
      ),
    reply: {
      en: 'You can reach us at:\n\n• WhatsApp: 0325-3728040\n• Instagram: @signaturelibaas\n• Or the Contact page – we usually reply within a few hours.',
      ro: 'Aap humse yahan raabta kar sakte hain:\n\n• WhatsApp: 0325-3728040\n• Instagram: @signaturelibaas\n• Ya Contact page – aam tor par kuch ghanton mein reply kar dete hain.',
      ur: 'آپ ہم سے یہاں رابطہ کر سکتے ہیں:\n\n• واٹس ایپ: 0325-3728040\n• انسٹاگرام: @signaturelibaas\n• یا رابطہ پیج – عام طور پر چند گھنٹوں میں جواب دے دیتے ہیں۔',
    },
  },
  {
    match: (m) => /\b(thanks|thank|shukriya|jazakallah|great|perfect|amazing|good)\b/i.test(m),
    reply: {
      en: 'You’re most welcome! 😊 If you need anything else – products, prices, sizes or order help – I’m right here.',
      ro: 'Koi baat nahi, khush rahiye! 😊 Agar aur kuch chahiye – products, prices, sizes ya order help – main yahin hoon.',
      ur: 'کوئی بات نہیں، خوش رہیں! 😊 اگر اور کچھ چاہیے – مصنوعات، قیمتیں، سائز یا آرڈر کی مدد – میں یہیں ہوں۔',
    },
  },
  {
    match: (m) =>
      /^(hi|hii|hey|hello|salam|assalam|aoa|salam o alaikum|assalam o alaikum)\b/i.test(
        m.trim()
      ) && m.trim().split(/\s+/).length <= 6,
    reply: {
      en: 'Hi! 👋 Great to see you. Ask me about our products, prices, sizes, delivery or your order – what would you like to know?',
      ro: 'Assalam-o-Alaikum! 👋 Bohot khush amdeed. Products, prices, sizes, delivery ya order – batayein kya jaanna chahenge?',
      ur: 'السلام علیکم! 👋 خوش آمدید۔ مصنوعات، قیمتیں، سائز، ڈیلیوری یا آرڈر – بتائیے کیا جاننا چاہتے ہیں؟',
    },
  },
];

const FALLBACK_REPLY = {
  en: 'I want to make sure I give you the right answer. I can help with:\n\n• Products & collection\n• Prices & offers\n• Sizes & fit\n• Orders, delivery & returns\n\nWhat are you looking for?',
  ro: 'Main aapko bilkul sahi jawab dena chahta hoon. Main in cheezon mein madad kar sakta hoon:\n\n• Products aur collection\n• Prices aur offers\n• Sizes aur fit\n• Orders, delivery aur returns\n\nAap kya dhoond rahe hain?',
  ur: 'میں آپ کو بالکل درست جواب دینا چاہتا ہوں۔ میں ان چیزوں میں مدد کر سکتا ہوں:\n\n• مصنوعات اور کلیکشن\n• قیمتیں اور آفرز\n• سائز اور فِٹ\n• آرڈر، ڈیلیوری اور ریٹرن\n\nآپ کیا تلاش کر رہے ہیں؟',
};

/**
 * Resolves a local, brand-aware mock answer after a short,
 * human-like "thinking" delay. The answer always comes back in
 * the language the person is writing in.
 * @param {string} text
 * @param {{ fromSuggestion?: boolean }} [options]
 * @returns {Promise<string>}
 */
export function getMockReply(text, options = {}) {
  const detected = detectLanguage(text);

  // Quick-reply chips send fixed English labels, so they keep the
  // conversation's language instead of forcing an English reply.
  const lang =
    options.fromSuggestion && conversationLang ? conversationLang : detected;
  conversationLang = detected;

  const normalized = text.toLowerCase();
  const intent = INTENTS.find((entry) => entry.match(normalized, text));
  const bundle = intent ? intent.reply : FALLBACK_REPLY;
  const reply = bundle[lang] || bundle.en;

  // Thinking time scales gently with the length of the question.
  const delay = 700 + Math.min(text.length * 14, 800);

  return wait(delay).then(() => reply);
}
