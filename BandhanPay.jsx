import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── PASTE YOUR APPS SCRIPT URL HERE AFTER SETUP ──────────────────
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
// ──────────────────────────────────────────────────────────────────

const S_LANG = "bp_lang";

// ══════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ══════════════════════════════════════════════════════════════════
const T = {
  en: {
    appName:"Bandhan Pay", tagline:"Smart Dues & Payment Manager",
    dashboard:"Dashboard", customers:"Customers", settings:"Settings", remHist:"Reminders",
    totalPending:"Total Pending", totalCust:"Total Customers", overdueCount:"Overdue", paidToday:"Paid Today",
    addCustomer:"Add Customer", search:"Search by name, phone or description…",
    custName:"Customer Name", phone:"Phone Number", amount:"Amount Due (₹)", dueDate:"Due Date",
    desc:"Payment Description", notes:"Notes / Remarks",
    saveCustomer:"Save Customer", cancel:"Cancel", update:"Update Customer",
    edit:"Edit", del:"Delete", markPaid:"Mark Paid", undoPaid:"Undo Paid",
    wa:"WhatsApp", voice:"Voice", qr:"QR Pay", call:"Call",
    pending:"Pending", paid:"Paid", overdue:"Overdue",
    allF:"All", overdueF:"Overdue", paidF:"Paid", unpaidF:"Unpaid",
    upiId:"Your UPI ID", shopName:"Shop Name", ownerPhone:"Owner Phone",
    saveSettings:"Save Settings", language:"Language",
    empty:"No customers yet. Tap + to add one!",
    delConfirm:"Are you sure you want to permanently delete this customer?",
    yes:"Yes, Delete", no:"Cancel",
    callScript:"Call Script — Read This Aloud", openDialer:"Open Phone Dialer",
    dlQR:"Download QR", shareWA:"Share on WhatsApp",
    play:"Play", pause:"Pause", replay:"Replay", stop:"Stop",
    copyUPI:"Copy UPI Link", voiceTitle:"Telugu Voice Reminder", voiceMsg:"Voice message text:",
    t_saved:"✅ Customer saved!", t_paid:"💚 Marked as Paid!", t_del:"🗑️ Customer deleted",
    t_copied:"📋 Copied to clipboard!", t_wa:"📲 WhatsApp opened!", t_synced:"☁️ Synced to Google Drive!",
    reminderHistory:"Reminder History", noRem:"No reminders sent yet.",
    sortName:"Sort: Name", sortAmt:"Sort: Amount ↓", sortDays:"Sort: Days ↓",
    pendingDays:"days overdue", dueToday:"Due today", paidOn:"Paid on",
    loading:"Loading from Google Drive…", offlineBanner:"⚠️ Offline mode — changes saved locally",
    setupNeeded:"⚙️ Script URL not set! Go to Settings to connect Google Drive.",
    scriptUrl:"Google Apps Script URL",
    // ── Validation errors ──
    err_nameRequired:    "Customer name is required",
    err_nameInvalid:     "Name should only contain letters and spaces",
    err_nameShort:       "Name must be at least 2 characters",
    err_phoneRequired:   "Phone number is required",
    err_phoneLetters:    "Phone number cannot contain letters — numbers only",
    err_phoneInvalid:    "Enter a valid 10-digit Indian mobile number",
    err_phoneShort:      "Phone number must be 10 digits",
    err_phoneLong:       "Phone number cannot exceed 13 digits (with country code)",
    err_amountRequired:  "Amount due is required",
    err_amountZero:      "Amount must be greater than ₹0",
    err_amountNegative:  "Amount cannot be negative",
    err_amountLetters:   "Amount must be a number — no letters allowed",
    err_amountMax:       "Amount seems too high — please verify",
    err_dueDatePast:     "Due date is already in the past — are you sure?",
    err_upiInvalid:      "UPI ID format is invalid (e.g. name@upi or name@bank)",
    err_upiRequired:     "UPI ID is required for QR payments",
    err_shopRequired:    "Shop name is required",
    err_scriptInvalid:   "Invalid Script URL — must start with https://script.google.com",
    err_phoneOwner:      "Enter a valid phone number with country code (e.g. 919876543210)",
    warn_dueDatePast:    "⚠️ Warning: Due date is already past",
    warn_largeAmount:    "⚠️ Double-check: Amount is over ₹1,00,000",
  },
  te: {
    appName:"బంధన్ పే", tagline:"స్మార్ట్ బకాయి & పేమెంట్ మేనేజర్",
    dashboard:"డాష్‌బోర్డ్", customers:"కస్టమర్లు", settings:"సెట్టింగ్స్", remHist:"రిమైండర్లు",
    totalPending:"మొత్తం బకాయి", totalCust:"మొత్తం కస్టమర్లు", overdueCount:"గడువు మించింది", paidToday:"ఈరోజు చెల్లించారు",
    addCustomer:"కస్టమర్ జోడించు", search:"పేరు, ఫోన్ లేదా వివరణతో వెతకండి…",
    custName:"కస్టమర్ పేరు", phone:"ఫోన్ నంబర్", amount:"బకాయి మొత్తం (₹)", dueDate:"గడువు తేదీ",
    desc:"పేమెంట్ వివరణ", notes:"గమనికలు",
    saveCustomer:"సేవ్ చేయి", cancel:"రద్దు", update:"నవీకరించు",
    edit:"మార్చు", del:"తొలగించు", markPaid:"చెల్లించారు", undoPaid:"రద్దు చేయి",
    wa:"వాట్సాప్", voice:"వాయిస్", qr:"QR పే", call:"కాల్",
    pending:"పెండింగ్", paid:"చెల్లించారు", overdue:"గడువు మించింది",
    allF:"అందరూ", overdueF:"గడువు మించింది", paidF:"చెల్లించారు", unpaidF:"చెల్లించలేదు",
    upiId:"మీ UPI ID", shopName:"షాప్ పేరు", ownerPhone:"యజమాని ఫోన్",
    saveSettings:"సేవ్ చేయి", language:"భాష",
    empty:"కస్టమర్లు లేరు. + నొక్కి జోడించండి!",
    delConfirm:"ఈ కస్టమర్‌ని శాశ్వతంగా తొలగించాలా?",
    yes:"అవును, తొలగించు", no:"రద్దు",
    callScript:"కాల్ స్క్రిప్ట్ — ఇది చదవండి", openDialer:"డయలర్ తెరువు",
    dlQR:"QR డౌన్లోడ్", shareWA:"వాట్సాప్‌లో షేర్",
    play:"ప్లే", pause:"పాజ్", replay:"మళ్ళీ", stop:"ఆపు",
    copyUPI:"UPI లింక్ కాపీ", voiceTitle:"తెలుగు వాయిస్ రిమైండర్", voiceMsg:"వాయిస్ సందేశం:",
    t_saved:"✅ కస్టమర్ సేవ్ అయింది!", t_paid:"💚 చెల్లించారుగా మార్చారు!", t_del:"🗑️ కస్టమర్ తొలగించారు",
    t_copied:"📋 క్లిప్‌బోర్డ్‌కు కాపీ అయింది!", t_wa:"📲 వాట్సాప్ తెరిచింది!", t_synced:"☁️ Google Drive కు సేవ్ అయింది!",
    reminderHistory:"రిమైండర్ చరిత్ర", noRem:"ఇంకా రిమైండర్లు పంపలేదు.",
    sortName:"పేరు వారీగా", sortAmt:"మొత్తం ↓", sortDays:"రోజులు ↓",
    pendingDays:"రోజులు మించింది", dueToday:"ఈరోజు గడువు", paidOn:"చెల్లించిన తేదీ",
    loading:"Google Drive నుండి లోడ్ అవుతోంది…", offlineBanner:"⚠️ ఆఫ్‌లైన్ మోడ్ — మార్పులు స్థానికంగా సేవ్ అయ్యాయి",
    setupNeeded:"⚙️ Script URL సెట్ చేయలేదు! Google Drive కనెక్ట్ చేయడానికి Settings కి వెళ్ళండి.",
    scriptUrl:"Google Apps Script URL",
    // ── Validation errors ──
    err_nameRequired:    "కస్టమర్ పేరు అవసరం",
    err_nameInvalid:     "పేరులో అక్షరాలు మరియు ఖాళీలు మాత్రమే ఉండాలి",
    err_nameShort:       "పేరు కనీసం 2 అక్షరాలు ఉండాలి",
    err_phoneRequired:   "ఫోన్ నంబర్ అవసరం",
    err_phoneLetters:    "ఫోన్ నంబర్‌లో అక్షరాలు ఉండకూడదు — కేవలం సంఖ్యలు మాత్రమే",
    err_phoneInvalid:    "చెల్లుబాటు అయ్యే 10-అంకెల మొబైల్ నంబర్ నమోదు చేయండి",
    err_phoneShort:      "ఫోన్ నంబర్ 10 అంకెలు ఉండాలి",
    err_phoneLong:       "ఫోన్ నంబర్ 13 అంకెలు మించకూడదు",
    err_amountRequired:  "బకాయి మొత్తం అవసరం",
    err_amountZero:      "మొత్తం ₹0 కంటే ఎక్కువ ఉండాలి",
    err_amountNegative:  "మొత్తం ప్రతికూలంగా ఉండకూడదు",
    err_amountLetters:   "మొత్తం సంఖ్య అయి ఉండాలి — అక్షరాలు అనుమతించబడవు",
    err_amountMax:       "మొత్తం చాలా ఎక్కువగా ఉంది — దయచేసి ధృవీకరించండి",
    err_dueDatePast:     "గడువు తేదీ ఇప్పటికే గడిచిపోయింది — మీరు ఖచ్చితంగా ఉన్నారా?",
    err_upiInvalid:      "UPI ID తప్పుగా ఉంది (ఉదా: name@upi లేదా name@bank)",
    err_upiRequired:     "QR పేమెంట్‌లకు UPI ID అవసరం",
    err_shopRequired:    "షాప్ పేరు అవసరం",
    err_scriptInvalid:   "తప్పైన Script URL — https://script.google.com తో మొదలు కావాలి",
    err_phoneOwner:      "దేశ కోడ్‌తో చెల్లుబాటు అయ్యే ఫోన్ నంబర్ నమోదు చేయండి (ఉదా: 919876543210)",
    warn_dueDatePast:    "⚠️ హెచ్చరిక: గడువు తేదీ ఇప్పటికే గడిచిపోయింది",
    warn_largeAmount:    "⚠️ రెండుసార్లు తనిఖీ చేయండి: మొత్తం ₹1,00,000 కంటే ఎక్కువ",
  }
};

// ══════════════════════════════════════════════════════════════════
// VALIDATION ENGINE
// ══════════════════════════════════════════════════════════════════
function validateCustomerForm(f, t) {
  const errors = {};
  const warnings = {};

  // ── Name ──────────────────────────────────────────────────────
  if (!f.name || !f.name.trim()) {
    errors.name = t.err_nameRequired;
  } else if (f.name.trim().length < 2) {
    errors.name = t.err_nameShort;
  } else if (/\d/.test(f.name)) {
    // Name contains digits — likely user typed phone in name field
    errors.name = t.err_nameInvalid;
  } else if (/^[^a-zA-Z\u0C00-\u0C7F\s'-]+$/.test(f.name.trim())) {
    errors.name = t.err_nameInvalid;
  }

  // ── Phone ─────────────────────────────────────────────────────
  if (!f.phone || !f.phone.trim()) {
    errors.phone = t.err_phoneRequired;
  } else if (/[a-zA-Z]/.test(f.phone)) {
    // Contains letters — user typed name in phone field
    errors.phone = t.err_phoneLetters;
  } else {
    const digitsOnly = f.phone.replace(/[\s\-\+\(\)]/g, "");
    if (!/^\d+$/.test(digitsOnly)) {
      errors.phone = t.err_phoneInvalid;
    } else if (digitsOnly.length < 10) {
      errors.phone = t.err_phoneShort;
    } else if (digitsOnly.length > 13) {
      errors.phone = t.err_phoneLong;
    } else if (digitsOnly.length === 10 && !/^[6-9]\d{9}$/.test(digitsOnly)) {
      errors.phone = t.err_phoneInvalid;
    } else if (digitsOnly.length === 12 && !digitsOnly.startsWith("91")) {
      errors.phone = t.err_phoneInvalid;
    }
  }

  // ── Amount ────────────────────────────────────────────────────
  if (!f.amountDue && f.amountDue !== 0) {
    errors.amountDue = t.err_amountRequired;
  } else if (/[a-zA-Z]/.test(String(f.amountDue))) {
    errors.amountDue = t.err_amountLetters;
  } else {
    const amt = Number(f.amountDue);
    if (isNaN(amt)) {
      errors.amountDue = t.err_amountLetters;
    } else if (amt < 0) {
      errors.amountDue = t.err_amountNegative;
    } else if (amt === 0) {
      errors.amountDue = t.err_amountZero;
    } else if (amt > 10000000) {
      errors.amountDue = t.err_amountMax;
    } else if (amt > 100000) {
      warnings.amountDue = t.warn_largeAmount;
    }
  }

  // ── Due Date (optional but warn if past) ──────────────────────
  if (f.dueDate) {
    const d = new Date(f.dueDate);
    const today = new Date(); today.setHours(0,0,0,0);
    if (d < today) {
      warnings.dueDate = t.warn_dueDatePast;
    }
  }

  return { errors, warnings, isValid: Object.keys(errors).length === 0 };
}

function validateSettings(f, t) {
  const errors = {};
  if (!f.shopName || !f.shopName.trim()) {
    errors.shopName = t.err_shopRequired;
  }
  if (f.upiId && f.upiId.trim()) {
    if (!/^[\w.\-_]+@[\w.\-_]+$/.test(f.upiId.trim())) {
      errors.upiId = t.err_upiInvalid;
    }
  }
  if (f.ownerPhone && f.ownerPhone.trim()) {
    const d = f.ownerPhone.replace(/[\s\-\+\(\)]/g,"");
    if (/[a-zA-Z]/.test(f.ownerPhone) || !/^\d+$/.test(d) || d.length < 10 || d.length > 13) {
      errors.ownerPhone = t.err_phoneOwner;
    }
  }
  if (f.scriptUrl && f.scriptUrl.trim() && !f.scriptUrl.trim().startsWith("https://script.google.com")) {
    errors.scriptUrl = t.err_scriptInvalid;
  }
  return { errors, isValid: Object.keys(errors).length === 0 };
}

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
const fmt       = n => new Intl.NumberFormat("en-IN").format(Number(n) || 0);
const daysDiff  = d => { if (!d) return 0; return Math.floor((Date.now() - new Date(d)) / 86400000); };
const ldLS      = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const svLS      = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ── API ───────────────────────────────────────────────────────────
// ALL requests use GET with URL params — avoids CORS preflight
// that blocks browser→Apps Script POST requests
async function apiGet(url, action = "all") {
  const fullUrl = `${url}?action=${encodeURIComponent(action)}&t=${Date.now()}`;
  const res  = await fetch(fullUrl, { method:"GET", redirect:"follow" });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!json.ok) throw new Error(json.error || "API error");
    return json;
  } catch(e) {
    throw new Error("Bad response from server. Check your Script URL.");
  }
}

// Write operations also use GET with ?action=X&data=JSON
// This bypasses CORS preflight completely
async function apiWrite(url, action, data) {
  const dataStr  = encodeURIComponent(JSON.stringify(data));
  const fullUrl  = `${url}?action=${encodeURIComponent(action)}&data=${dataStr}&t=${Date.now()}`;
  const res  = await fetch(fullUrl, { method:"GET", redirect:"follow" });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!json.ok) throw new Error(json.error || "API error");
    return json;
  } catch(e) {
    throw new Error("Write failed. Check Script URL and permissions.");
  }
}

// ── Message builders ──────────────────────────────────────────────
function buildWAMsg(c, settings, lang, count) {
  const days = daysDiff(c.dueDate), amt = fmt(c.amountDue);
  const upi  = settings.upiId || "shop@upi", shop = settings.shopName || "Shop";
  // No emoji prefixes — they render as ? on some Android WhatsApp versions
  const desc   = c.desc ? `\nVivrana: ${c.desc}` : "";
  const descTe = c.desc ? `\nవివరణ: ${c.desc}` : "";
  const urgency = count >= 3
    ? `\n${lang==="te" ? "Dayachesi ventane challinchandi." : "Please pay immediately — this is urgent."}`
    : count >= 2 ? `\n${lang==="te" ? "Malli miku gurtu chestunnamu." : "This is a follow-up reminder."}` : "";
  // UPI link — NO encodeURIComponent so it shows clean text in WhatsApp
  const upiLink = `upi://pay?pa=${upi}&am=${c.amountDue}&pn=${shop}&tn=${c.desc||"Payment"}&cu=INR`;
  const daysText = lang==="te"
    ? (days>0 ? `\n${days} rojuluga pending.` : days<0 ? `\n${Math.abs(days)} rojulalo gaduvu.` : "\nIrojey gaduvu.")
    : (days>0 ? `\nPending for ${days} days.` : days<0 ? `\nDue in ${Math.abs(days)} days.` : "\nDue today.");
  if (lang==="te") {
    return `Namaste *${c.name}* garu\n\n*${shop}* nundi gurtu chestunnamu.\n\nBakayi: *Rs.${amt}*${daysText}${descTe}${urgency}\n\nUPI Challinpu:\n*${upi}*\n\n${upiLink}\n\nDhanyavadalu\n*${shop}*`;
  }
  return `Hello *${c.name}*\n\nReminder from *${shop}*.\n\nDue Amount: *Rs.${amt}*${daysText}${desc}${urgency}\n\nPay via UPI:\n*${upi}*\n\n${upiLink}\n\nThank you\n*${shop}*`;
}

// ══════════════════════════════════════════════════════════════════
// VOICE ENGINE — Telugu number-to-words + natural speech text
// ══════════════════════════════════════════════════════════════════

// Telugu number to words (for natural pronunciation)
function teluguNumberToWords(num) {
  const n = Math.floor(Number(num));
  if (isNaN(n) || n < 0) return String(num);

  const ones = ["","ఒకటి","రెండు","మూడు","నాలుగు","అయిదు","ఆరు","ఏడు","ఎనిమిది","తొమ్మిది",
                "పది","పదకొండు","పన్నెండు","పదమూడు","పదనాలుగు","పదిహేను","పదహారు","పదిహేడు","పదెనిమిది","పందొమ్మిది"];
  const tens = ["","","ఇరవై","ముప్పై","నలభై","యాభై","అరవై","డెభ్భై","ఎనభై","తొంభై"];

  if (n === 0) return "సున్నా";
  if (n < 20)  return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
  if (n < 1000) {
    const h = Math.floor(n/100);
    const r = n % 100;
    return ones[h] + " వందలు" + (r ? " " + teluguNumberToWords(r) : "");
  }
  if (n < 100000) {
    const t = Math.floor(n/1000);
    const r = n % 1000;
    return teluguNumberToWords(t) + " వేలు" + (r ? " " + teluguNumberToWords(r) : "");
  }
  if (n < 10000000) {
    const l = Math.floor(n/100000);
    const r = n % 100000;
    return teluguNumberToWords(l) + " లక్షలు" + (r ? " " + teluguNumberToWords(r) : "");
  }
  return String(n); // fallback for very large numbers
}

// Build natural Telugu speech — all numbers as Telugu words,
// no English mixed in, short sentences with natural pauses
function buildSpeech(c, settings) {
  const days    = daysDiff(c.dueDate);
  const shop    = settings.shopName || "మా షాప్";
  const amtWord = teluguNumberToWords(c.amountDue);

  // Due date phrase
  let duePhrase = "";
  if (days > 0)       duePhrase = `ఇది ${teluguNumberToWords(days)} రోజుల నుండి పెండింగ్‌లో ఉంది.`;
  else if (days === 0) duePhrase = "ఈరోజే చెల్లింపు గడువు ముగుస్తుంది.";
  else                 duePhrase = "చెల్లింపు గడువు త్వరలో వస్తుంది.";

  // Description phrase (only if desc is Telugu/short)
  const descPhrase = c.desc ? `${c.desc} కోసం ` : "";

  // Build the speech — short natural sentences
  return `నమస్తే, ${c.name} గారు. ` +
    `${shop} నుండి మీకు గుర్తు చేస్తున్నాము. ` +
    `${descPhrase}మీ బకాయి మొత్తం ${amtWord} రూపాయలు. ` +
    `${duePhrase} ` +
    `దయచేసి ఈరోజే చెల్లించండి. ` +
    `ధన్యవాదాలు.`;
}

// Pick the absolute best available voice for Telugu
// Priority: te-IN > te > hi-IN (Hindi is closest to Telugu phonetics) > en-IN
function getBestVoiceForTelugu() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Exact Telugu India match
  const teIN = voices.find(v => v.lang === "te-IN");
  if (teIN) return teIN;

  // Any Telugu
  const te = voices.find(v => v.lang.toLowerCase().startsWith("te"));
  if (te) return te;

  // Hindi India — closest phonetics to Telugu on Android
  const hiIN = voices.find(v => v.lang === "hi-IN");
  if (hiIN) return hiIN;

  // Any Indian English — better than US/UK for Indian names
  const enIN = voices.find(v => v.lang === "en-IN");
  if (enIN) return enIN;

  // Any Indian locale
  const indian = voices.find(v => v.lang.includes("IN") || v.lang.includes("in-IN"));
  if (indian) return indian;

  // Last resort — first available
  return voices[0] || null;
}

// Optimal speech parameters per voice language
function getSpeechParams(voice) {
  if (!voice) return { rate: 0.88, pitch: 1.0 };
  const lang = voice.lang.toLowerCase();
  if (lang.startsWith("te"))   return { rate: 0.82, pitch: 1.0 };  // Telugu — slightly slow, natural pitch
  if (lang.startsWith("hi"))   return { rate: 0.80, pitch: 0.95 }; // Hindi — slower so Telugu words sound right
  if (lang.includes("en-in"))  return { rate: 0.78, pitch: 1.0 };  // Indian English
  return { rate: 0.85, pitch: 1.0 };
}
  const days = daysDiff(c.dueDate), amt = fmt(c.amountDue), shop = settings.shopName||"Shop", upi = settings.upiId||"shop@upi";
  const desc = c.desc ? `\nVivrana: ${c.desc}` : "";
  const descTe = c.desc ? `\nవివరణ: ${c.desc}` : "";
  if (lang==="te") return `Namaste ${c.name} garu\n\n${shop} nundi matladutunnamu.\n\nBakayi: Rs.${amt}${days>0?` — ${days} rojulu mincindi`:""}${descTe}\n\nDayachesi irojey challinchandi.\nUPI: ${upi}`;
  return `Hello ${c.name}\n\nCalling from ${shop}.\n\nDue: Rs.${amt}${days>0?` — ${days} days overdue`:""}${desc}\n\nPlease pay today.\nUPI: ${upi}`;
}

// ══════════════════════════════════════════════════════════════════
// SHARED STYLE ATOMS
// ══════════════════════════════════════════════════════════════════
const INP = (hasErr) => ({
  background: "#0f172a",
  border: `1px solid ${hasErr ? "#ef4444" : "#334155"}`,
  borderRadius: 12,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
});

// ── Inline field error ─────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
      style={{ display:"flex", alignItems:"center", gap:5, marginTop:5, color:"#f87171", fontSize:11, fontWeight:600 }}>
      <span style={{ fontSize:12 }}>⛔</span>{msg}
    </motion.div>
  );
}

// ── Inline field warning ───────────────────────────────────────────
function FieldWarn({ msg }) {
  if (!msg) return null;
  return (
    <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
      style={{ display:"flex", alignItems:"center", gap:5, marginTop:5, color:"#fbbf24", fontSize:11, fontWeight:600 }}>
      <span style={{ fontSize:12 }}>⚠️</span>{msg}
    </motion.div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ msg, type="success", onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  const bg = type==="error" ? "#7f1d1d" : type==="warn" ? "#78350f" : "#1e293b";
  const border = type==="error" ? "#ef4444" : type==="warn" ? "#f59e0b" : "#334155";
  return (
    <motion.div initial={{ opacity:0, y:60 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:60 }}
      style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:300,
        background:bg, border:`1px solid ${border}`, color:"#fff", padding:"11px 22px",
        borderRadius:18, boxShadow:"0 8px 32px rgba(0,0,0,0.6)", fontSize:13, fontWeight:700,
        whiteSpace:"nowrap", maxWidth:"90vw", textAlign:"center" }}>
      {msg}
    </motion.div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function SC({ icon, label, value, sub, a }) {
  const styles = {
    amber: { bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.35)", color:"#fbbf24" },
    red:   { bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.35)",  color:"#f87171" },
    blue:  { bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.35)", color:"#60a5fa" },
    green: { bg:"rgba(16,185,129,0.1)",  border:"rgba(16,185,129,0.35)", color:"#34d399" },
  }[a];
  return (
    <motion.div whileHover={{ y:-2 }}
      style={{ background:styles.bg, border:`1px solid ${styles.border}`, borderRadius:18, padding:"14px 16px" }}>
      <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:18, fontWeight:800, fontFamily:"monospace", color:styles.color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:"#64748b", marginTop:2 }}>{sub}</div>}
    </motion.div>
  );
}

// ── Sync Badge ────────────────────────────────────────────────────
function SyncBadge({ status }) {
  const map = {
    syncing: { color:"#60a5fa", text:"⟳ Syncing" },
    synced:  { color:"#34d399", text:"☁ Synced"  },
    error:   { color:"#f87171", text:"⚠ Offline" },
    idle:    { color:"#64748b", text:"☁ Drive"   },
  };
  const s = map[status] || map.idle;
  return (
    <span style={{ fontSize:10, color:s.color, fontWeight:700, background:"rgba(30,41,59,0.8)", padding:"3px 8px", borderRadius:10, border:`1px solid ${s.color}40` }}>
      {s.text}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════
// ADD / EDIT CUSTOMER MODAL — Full validation
// ══════════════════════════════════════════════════════════════════
function CustModal({ init, onSave, onClose, t }) {
  const blank = { name:"", phone:"", amountDue:"", dueDate:"", desc:"", notes:"" };
  const [f,   setF]   = useState(init ? { ...blank, ...init } : blank);
  const [errs, setErrs] = useState({});
  const [warns,setWarns]= useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Live validate a single field on blur or on change after touch
  const validate = useCallback((fields) => {
    const { errors, warnings } = validateCustomerForm(fields, t);
    setErrs(errors);
    setWarns(warnings);
    return Object.keys(errors).length === 0;
  }, [t]);

  const handleChange = (k) => (e) => {
    const val = e.target.value;

    // ── Real-time guards ─────────────────────────────────────────
    // Phone: block letters being typed
    if (k === "phone" && /[a-zA-Z]/.test(val.slice(-1))) {
      setErrs(p => ({ ...p, phone: t.err_phoneLetters }));
      setF(p => ({ ...p, [k]: val.replace(/[a-zA-Z]/g,"") }));
      return;
    }
    // Amount: block letters being typed
    if (k === "amountDue" && /[a-zA-Z]/.test(val.slice(-1))) {
      setErrs(p => ({ ...p, amountDue: t.err_amountLetters }));
      setF(p => ({ ...p, [k]: val.replace(/[a-zA-Z]/g,"") }));
      return;
    }

    const updated = { ...f, [k]: val };
    setF(updated);
    if (touched[k] || submitted) validate(updated);
  };

  const handleBlur = (k) => () => {
    setTouched(p => ({ ...p, [k]: true }));
    validate(f);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTouched({ name:true, phone:true, amountDue:true, dueDate:true });
    const ok = validate(f);
    if (ok) onSave(f);
  };

  const hasErrors = Object.keys(errs).length > 0;

  const fields = [
    { k:"name",      l:t.custName, type:"text",   ph:"రవి కుమార్ / Ravi Kumar", req:true,
      hint: "Only letters and spaces allowed" },
    { k:"phone",     l:t.phone,    type:"tel",    ph:"9876543210 or 919876543210", req:true,
      hint: "10-digit Indian mobile number" },
    { k:"amountDue", l:t.amount,   type:"number", ph:"2450", req:true,
      hint: "Numbers only — no letters" },
    { k:"dueDate",   l:t.dueDate,  type:"date",   ph:"", req:false },
    { k:"desc",      l:t.desc,     type:"text",   ph:"Grocery / Loan / కిరాణా", req:false },
    { k:"notes",     l:t.notes,    type:"text",   ph:"Extra notes…", req:false },
  ];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"flex-end", justifyContent:"center", padding:16 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ y:80 }} animate={{ y:0 }} exit={{ y:80 }}
        style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:28, padding:22,
          width:"100%", maxWidth:440, maxHeight:"94vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:"#fff" }}>
              {init ? t.update : t.addCustomer}
            </span>
            {submitted && hasErrors && (
              <div style={{ fontSize:11, color:"#f87171", marginTop:2, fontWeight:600 }}>
                ⛔ Fix the errors below to save
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ color:"#64748b", fontSize:20, background:"none", border:"none", cursor:"pointer" }}>✕</button>
        </div>

        {/* Fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {fields.map(({ k, l, type, ph, req, hint }) => {
            const hasErr  = !!(errs[k] && (touched[k] || submitted));
            const hasWarn = !!(warns[k] && !errs[k]);
            return (
              <div key={k}>
                <div style={{ fontSize:11, color: hasErr ? "#f87171" : "#94a3b8", marginBottom:5, fontWeight:700, display:"flex", justifyContent:"space-between" }}>
                  <span>{l}{req && <span style={{ color:"#ef4444" }}> *</span>}</span>
                  {hint && !hasErr && <span style={{ color:"#475569", fontWeight:400, fontSize:10 }}>{hint}</span>}
                </div>
                {k === "notes"
                  ? <textarea value={f[k]} onChange={handleChange(k)} onBlur={handleBlur(k)} placeholder={ph} rows={2}
                      style={{ ...INP(hasErr), resize:"none" }} />
                  : <input type={type} value={f[k]} onChange={handleChange(k)} onBlur={handleBlur(k)} placeholder={ph}
                      style={INP(hasErr)}
                      inputMode={k==="phone"||k==="amountDue" ? "numeric" : undefined} />
                }
                <AnimatePresence>
                  {hasErr  && <FieldError key="e" msg={errs[k]} />}
                  {hasWarn && <FieldWarn  key="w" msg={warns[k]} />}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:20 }}>
          <button onClick={onClose}
            style={{ background:"#334155", border:"none", borderRadius:14, padding:12, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
            {t.cancel}
          </button>
          <button onClick={handleSubmit}
            style={{ background: hasErrors && submitted ? "#7f1d1d" : "#f59e0b",
              border: hasErrors && submitted ? "1px solid #ef4444" : "none",
              borderRadius:14, padding:12, color: hasErrors && submitted ? "#fca5a5" : "#1e293b",
              fontSize:13, fontWeight:800, cursor:"pointer", transition:"all 0.2s" }}>
            {hasErrors && submitted ? "⛔ Fix errors first" : init ? t.update : t.saveCustomer}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DELETE CONFIRM MODAL
// ══════════════════════════════════════════════════════════════════
function DelModal({ onConfirm, onClose, t, customerName }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <motion.div initial={{ scale:0.85 }} animate={{ scale:1 }} exit={{ scale:0.85 }}
        style={{ background:"#1e293b", border:"1px solid rgba(239,68,68,0.5)", borderRadius:28, padding:24, maxWidth:320, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:44, marginBottom:12 }}>🗑️</div>
        <p style={{ color:"#f87171", fontWeight:800, fontSize:15, marginBottom:6 }}>{customerName}</p>
        <p style={{ color:"#94a3b8", fontWeight:500, fontSize:13, marginBottom:22, lineHeight:1.5 }}>{t.delConfirm}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <button onClick={onClose}
            style={{ background:"#334155", border:"none", borderRadius:14, padding:11, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
            {t.no}
          </button>
          <button onClick={onConfirm}
            style={{ background:"#dc2626", border:"none", borderRadius:14, padding:11, color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer" }}>
            {t.yes}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QR MODAL
// ══════════════════════════════════════════════════════════════════
function QRModal({ c, settings, t, onClose }) {
  const upi   = settings.upiId;
  const shop  = settings.shopName || "BandhanPay";
  const amt   = c.amountDue, note = c.desc || "Payment";
  const phone = c.phone.replace(/\D/g,"");

  // Warn if no UPI ID
  if (!upi || !upi.trim()) {
    return (
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
        onClick={e => e.target===e.currentTarget && onClose()}>
        <motion.div initial={{ scale:0.85 }} animate={{ scale:1 }}
          style={{ background:"#1e293b", border:"1px solid rgba(239,68,68,0.5)", borderRadius:28, padding:28, maxWidth:320, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
          <p style={{ color:"#f87171", fontWeight:800, fontSize:15, marginBottom:8 }}>{t.err_upiRequired}</p>
          <p style={{ color:"#94a3b8", fontSize:12, marginBottom:20 }}>Go to Settings and add your UPI ID (e.g. yourname@upi) to generate QR codes.</p>
          <button onClick={onClose}
            style={{ background:"#f59e0b", border:"none", borderRadius:14, padding:"10px 28px", color:"#1e293b", fontWeight:800, fontSize:13, cursor:"pointer" }}>
            Go to Settings
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const upiStr = `upi://pay?pa=${upi}&pn=${encodeURIComponent(shop)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=000000&bgcolor=FFFFFF&qzone=2&data=${encodeURIComponent(upiStr)}`;
  const waMsg  = `*QR Payment — ${shop}*\n\nNameste ${c.name} garu\nUPI: *${upi}*\nAmount: *Rs.${fmt(amt)}*\n${c.desc?`Vivrana: ${c.desc}\n`:""}\n${upiStr}`;
  const [copied,setCopied] = useState(false);
  const [qrErr, setQrErr]  = useState(false);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", padding:16 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ y:60 }} animate={{ y:0 }} exit={{ y:60 }}
        style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:28, padding:20, width:"100%", maxWidth:380, textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontWeight:800, fontSize:15, color:"#fff" }}>QR Payment</span>
          <button onClick={onClose} style={{ color:"#64748b", background:"none", border:"none", cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
        <p style={{ color:"#94a3b8", fontSize:13, marginBottom:4 }}>{c.name} — <span style={{ color:"#fbbf24", fontWeight:800 }}>₹{fmt(amt)}</span></p>
        {c.desc && <p style={{ color:"#64748b", fontSize:11, marginBottom:10 }}>📝 {c.desc}</p>}

        {/* QR Image */}
        <div style={{ background:"#fff", borderRadius:20, padding:12, display:"inline-block", marginBottom:10 }}>
          {qrErr ? (
            <div style={{ width:200, height:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#ef4444", fontSize:12, gap:8 }}>
              <span style={{ fontSize:32 }}>❌</span>
              <span>QR failed to load.</span>
              <span style={{ color:"#94a3b8", fontSize:10 }}>Check internet connection.</span>
            </div>
          ) : (
            <img src={qrUrl} alt="UPI QR Code" style={{ width:200, height:200, display:"block" }}
              onError={() => setQrErr(true)} />
          )}
        </div>
        <p style={{ color:"#64748b", fontSize:11, marginBottom:4 }}>UPI: <span style={{ color:"#fbbf24", fontFamily:"monospace" }}>{upi}</span></p>
        <p style={{ color:"#475569", fontSize:10, marginBottom:14 }}>GPay · PhonePe · Paytm · BHIM</p>

        {/* App deep links */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
          {[
            { l:"GPay",    e:"🟢", s:`gpay://upi/pay?pa=${upi}&am=${amt}&tn=${encodeURIComponent(note)}` },
            { l:"PhonePe", e:"🟣", s:`phonepe://pay?pa=${upi}&am=${amt}&tn=${encodeURIComponent(note)}` },
            { l:"Paytm",   e:"🔵", s:`paytmmp://upi/pay?pa=${upi}&am=${amt}&tn=${encodeURIComponent(note)}` },
            { l:"BHIM",    e:"🟠", s:`bhim://pay?pa=${upi}&am=${amt}&tn=${encodeURIComponent(note)}` },
          ].map(({ l, e, s }) => (
            <a key={l} href={s} style={{ background:"#0f172a", border:"1px solid #334155", borderRadius:14, padding:"8px 4px", color:"#fff", textDecoration:"none", fontSize:10, fontWeight:700, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span style={{ fontSize:16 }}>{e}</span><span>{l}</span>
            </a>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          <button onClick={() => { navigator.clipboard.writeText(upiStr); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
            style={{ background:copied?"#059669":"#334155", border:"none", borderRadius:14, padding:10, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", transition:"background 0.2s" }}>
            {copied ? "✓ Copied!" : "📋 "+t.copyUPI}
          </button>
          <a href={qrUrl} download={`QR-${c.name}-${amt}.png`} target="_blank" rel="noopener noreferrer"
            style={{ background:"#1d4ed8", borderRadius:14, padding:10, color:"#fff", fontSize:11, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
            ⬇ {t.dlQR}
          </a>
          <a href={`https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer"
            style={{ background:"#059669", borderRadius:14, padding:10, color:"#fff", fontSize:11, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
            🟢 WA
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// VOICE MODAL — Records audio via MediaRecorder + Web Speech API
// Downloads as .wav and opens WhatsApp so you can attach the file
// ══════════════════════════════════════════════════════════════════
function VoiceModal({ c, settings, t, onClose }) {
  const [status,    setStatus]   = useState("idle");
  // idle | loading | speaking | recording | paused | done | recorded | error
  const [progress,  setProgress] = useState(0);
  const [audioURL,  setAudioURL] = useState(null);  // blob URL for recorded audio
  const [audioBlob, setAudioBlob]= useState(null);  // actual blob for download
  const [recStatus, setRecStatus]= useState("");     // recording status text

  const timerRef    = useRef(null);
  const mediaRecRef = useRef(null);  // MediaRecorder instance
  const chunksRef   = useRef([]);    // audio chunks
  const streamRef   = useRef(null);  // mic stream

  const text  = buildSpeech(c, settings);
  const phone = c.phone.replace(/\D/g,"");
  const supported = "speechSynthesis" in window;
  const canRecord = !!(navigator.mediaDevices && window.MediaRecorder);

  // ── Play only (no recording) ──────────────────────────────────────
  const doPlay = () => {
    if (!supported) { setStatus("error"); return; }
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    setProgress(0); setStatus("loading");

    const trySpeak = () => {
      const voice  = getBestVoiceForTelugu();
      const params = getSpeechParams(voice);
      const utter  = new SpeechSynthesisUtterance(text);
      utter.lang   = voice ? voice.lang : "te-IN";
      utter.rate   = params.rate;
      utter.pitch  = params.pitch;
      utter.volume = 1;
      if (voice) utter.voice = voice;
      utter.onstart  = () => setStatus("speaking");
      utter.onend    = () => { setStatus("done"); setProgress(100); clearInterval(timerRef.current); };
      utter.onerror  = e => { if(e.error!=="interrupted"&&e.error!=="canceled") setStatus("error"); };
      utter.onpause  = () => setStatus("paused");
      utter.onresume = () => setStatus("speaking");
      window.speechSynthesis.speak(utter);
      setStatus("speaking");
      const est = Math.max(4000, text.length * 72);
      let el = 0;
      timerRef.current = setInterval(() => {
        el += 300;
        setProgress(Math.min(94, Math.round(el / est * 100)));
        if (el >= est) clearInterval(timerRef.current);
      }, 300);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) setTimeout(trySpeak, 80);
    else {
      window.speechSynthesis.onvoiceschanged = () => setTimeout(trySpeak, 80);
      window.speechSynthesis.getVoices(); // trigger load
    }
  };

  const doPause  = () => { window.speechSynthesis.pause(); setStatus("paused"); clearInterval(timerRef.current); };
  const doResume = () => { window.speechSynthesis.resume(); setStatus("speaking"); };
  const doStop   = () => { window.speechSynthesis.cancel(); setStatus("idle"); setProgress(0); clearInterval(timerRef.current); stopRecording(); };

  // ── Record audio — mic captures what the speaker plays ──────────
  // SpeechSynthesis plays through the device speaker.
  // We capture it by: speak FIRST (so user hears it), then
  // use getUserMedia (mic) to record what the speaker outputs.
  // On mobile the mic picks up the speaker clearly.
  // On desktop: user should hold phone near speaker OR use headphones.
  const doRecord = async () => {
    if (!supported) { setStatus("error"); return; }
    if (!canRecord) {
      setRecStatus("Recording not supported. Use Chrome on Android.");
      return;
    }

    try {
      setStatus("loading");
      setRecStatus("Requesting microphone permission...");
      setAudioURL(null);
      setAudioBlob(null);
      chunksRef.current = [];

      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      // Pick best supported mime type
      const mimeType =
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" :
        MediaRecorder.isTypeSupported("audio/webm")             ? "audio/webm" :
        MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")  ? "audio/ogg;codecs=opus" :
        MediaRecorder.isTypeSupported("audio/mp4")              ? "audio/mp4" :
        "audio/webm";

      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecRef.current = mr;

      mr.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        // Stop mic tracks
        stream.getTracks().forEach(t => t.stop());
        if (chunksRef.current.length === 0) {
          setStatus("error");
          setRecStatus("No audio captured. Make sure microphone is near speaker.");
          return;
        }
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 500) {
          setStatus("error");
          setRecStatus("Audio too short or empty. Try again — hold mic near speaker.");
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        setStatus("recorded");
        setProgress(100);
        setRecStatus("Audio saved! Play to check, then share via WhatsApp.");
      };

      // Start recording
      mr.start(100);
      setStatus("recording");
      setRecStatus("Recording... (speaking now — keep mic near device)");

      // Progress bar
      const est = Math.max(6000, text.length * 85);
      let el = 0;
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        el += 300;
        setProgress(Math.min(92, Math.round(el / est * 100)));
        if (el >= est) clearInterval(timerRef.current);
      }, 300);

      // Build utterance with best voice + optimal params
      const voice  = getBestVoiceForTelugu();
      const params = getSpeechParams(voice);
      const utter  = new SpeechSynthesisUtterance(text);
      utter.lang   = voice ? voice.lang : "te-IN";
      utter.rate   = params.rate;
      utter.pitch  = params.pitch;
      utter.volume = 1;
      if (voice) utter.voice = voice;

      utter.onstart = () => setRecStatus("Recording... voice is playing");

      utter.onend = () => {
        clearInterval(timerRef.current);
        // Give a short tail before stopping
        setTimeout(() => {
          if (mr.state !== "inactive") mr.stop();
        }, 600);
      };

      utter.onerror = (e) => {
        clearInterval(timerRef.current);
        if (mr.state !== "inactive") mr.stop();
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setStatus("error");
          setRecStatus("Speech error: " + (e.error || "unknown") + ". Use Chrome.");
        }
      };

      // Cancel any existing speech then speak
      window.speechSynthesis.cancel();
      setTimeout(() => window.speechSynthesis.speak(utter), 150);

    } catch (err) {
      setStatus("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setRecStatus("Microphone permission denied. Allow mic in browser settings.");
      } else {
        setRecStatus("Error: " + err.message);
      }
    }
  };

  const stopRecording = () => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  // ── Download audio ────────────────────────────────────────────────
  const doDownload = () => {
    if (!audioBlob || !audioURL) return;
    const ext  = audioBlob.type.includes("ogg") ? "ogg" : audioBlob.type.includes("mp4") ? "m4a" : "webm";
    const name = `VoiceReminder-${c.name.replace(/\s+/g,"-")}-Rs${c.amountDue}.${ext}`;
    const a    = document.createElement("a");
    a.href     = audioURL;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Share audio via WhatsApp ─────────────────────────────────────
  // Web Share API (navigator.share) on Android Chrome can share files
  // directly to WhatsApp as a voice/audio message.
  const doShareAudio = async () => {
    if (!audioBlob) {
      // No audio yet — just open WhatsApp with text
      const waText = `Voice reminder: ${c.name} - Rs.${fmt(c.amountDue)} pending.\nPay via UPI: ${settings.upiId||"shop@upi"}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waText)}`, "_blank");
      return;
    }

    const ext  = audioBlob.type.includes("ogg") ? "ogg" : audioBlob.type.includes("mp4") ? "m4a" : "webm";
    const file = new File(
      [audioBlob],
      `VoiceReminder-${c.name.replace(/\s+/g,"-")}.${ext}`,
      { type: audioBlob.type }
    );

    // Try Web Share API first (Android Chrome, iOS Safari 15+)
    if (navigator.share) {
      try {
        const shareData = { files: [file], title: `Voice Reminder — ${c.name}`, text: `Rs.${fmt(c.amountDue)} due` };
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return; // success — WhatsApp share sheet opened
        }
      } catch (e) {
        // User cancelled or share failed — fall through to download
        if (e.name === "AbortError") return; // user cancelled deliberately
      }
    }

    // Fallback: download file first, then open WA
    // User then taps attachment (📎) in WhatsApp to send the saved file
    doDownload();
    setRecStatus("File downloaded! Open WhatsApp → tap 📎 → select the file.");
    setTimeout(() => {
      const waText = `Voice reminder: ${c.name} - Rs.${fmt(c.amountDue)} pending. Attach the downloaded audio file.`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waText)}`, "_blank");
    }, 1500);
  };

  useEffect(() => () => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    stopRecording();
  }, []);

  const bars = [...Array(16)].map((_,i)=>i);
  const statusColor = {
    error:"#f87171", recorded:"#34d399", recording:"#a78bfa",
    speaking:"#34d399", done:"#34d399", loading:"#60a5fa", paused:"#fbbf24"
  }[status] || "#64748b";

  const statusLabel = {
    idle:"Press Play to hear, or Record to save audio",
    loading:"Loading voice...",
    speaking:"Playing voice...",
    paused:"Paused",
    done:"Done playing",
    recording:"Recording audio...",
    recorded:"Audio ready — download & send via WhatsApp!",
    error:"Error — please use Chrome or Edge browser",
  }[status] || "";

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", padding:16 }}
      onClick={e => e.target===e.currentTarget && (doStop(), onClose())}>
      <motion.div initial={{ y:60 }} animate={{ y:0 }} exit={{ y:60 }}
        style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:28, padding:20, width:"100%", maxWidth:420, maxHeight:"92vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <span style={{ fontWeight:800, fontSize:15, color:"#fff" }}>{t.voiceTitle}</span>
          <button onClick={()=>{doStop();onClose();}} style={{ color:"#64748b", background:"none", border:"none", cursor:"pointer", fontSize:18 }}>✕</button>
        </div>

        {/* Customer chip */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, background:"#0f172a", borderRadius:16, padding:12 }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(168,85,247,0.2)", border:"1px solid rgba(168,85,247,0.4)", display:"flex", alignItems:"center", justifyContent:"center", color:"#a855f7", fontWeight:800, fontSize:14, flexShrink:0 }}>
            {c.name[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight:800, color:"#fff", fontSize:14, margin:0 }}>{c.name}</p>
            <p style={{ color:"#fbbf24", fontFamily:"monospace", fontSize:12, margin:0 }}>Rs.{fmt(c.amountDue)}</p>
          </div>
        </div>

        {/* Script text + active voice info */}
        <div style={{ background:"#0f172a", border:"1px solid #1e3a5f", borderRadius:14, padding:12, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <p style={{ color:"#64748b", fontSize:10, fontWeight:700, margin:0 }}>{t.voiceMsg}</p>
            {/* Show which voice engine will be used */}
            {(() => {
              const v = getBestVoiceForTelugu();
              if (!v) return <span style={{ fontSize:9, color:"#ef4444", fontWeight:600 }}>No voice found</span>;
              const isTE = v.lang.startsWith("te");
              const isHI = v.lang.startsWith("hi");
              return (
                <span style={{ fontSize:9, fontWeight:700, color: isTE?"#34d399":isHI?"#fbbf24":"#94a3b8",
                  background: isTE?"rgba(16,185,129,0.15)":isHI?"rgba(245,158,11,0.15)":"rgba(100,116,139,0.15)",
                  padding:"2px 6px", borderRadius:6 }}>
                  {isTE ? "Telugu voice" : isHI ? "Hindi voice (closest)" : v.lang}
                </span>
              );
            })()}
          </div>
          <p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.9, margin:0 }}>{text}</p>
        </div>

        {/* Waveform animation */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:3, height:44, marginBottom:8 }}>
          {bars.map(i=>(
            <motion.div key={i}
              style={{ width:5, borderRadius:3, background:(status==="speaking"||status==="recording")?"#f59e0b":"#334155" }}
              animate={(status==="speaking"||status==="recording")?{height:[4,8+Math.random()*30,4]}:{height:4}}
              transition={(status==="speaking"||status==="recording")?{duration:0.35+i*0.025,repeat:Infinity,delay:i*0.04,ease:"easeInOut"}:{duration:0.15}}/>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ background:"#0f172a", borderRadius:8, height:4, marginBottom:8, overflow:"hidden" }}>
          <motion.div style={{ height:"100%", background:status==="recording"?"#a78bfa":"#f59e0b", borderRadius:8 }}
            animate={{ width:`${progress}%` }} transition={{ ease:"linear", duration:0.3 }}/>
        </div>

        {/* Status text */}
        <p style={{ textAlign:"center", fontSize:11, marginBottom:14, fontWeight:600, color:statusColor, minHeight:16 }}>
          {recStatus || statusLabel}
        </p>

        {!supported ? (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:14, padding:12, textAlign:"center", marginBottom:10 }}>
            <p style={{ color:"#f87171", fontSize:12, fontWeight:700, margin:"0 0 4px" }}>Browser not supported</p>
            <p style={{ color:"#94a3b8", fontSize:11, margin:0 }}>Please use Google Chrome on Android for voice recording.</p>
          </div>
        ) : (
          <>
            {/* ── Step 1: Play / Preview ── */}
            <div style={{ background:"rgba(30,41,59,0.8)", border:"1px solid #334155", borderRadius:16, padding:12, marginBottom:10 }}>
              <p style={{ color:"#94a3b8", fontSize:10, fontWeight:800, marginBottom:8, letterSpacing:1 }}>STEP 1 — PREVIEW VOICE</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {(status==="idle"||status==="done"||status==="error"||status==="recorded") ? (
                  <button onClick={doPlay} style={{ background:"#1e3a5f", border:"1px solid #3b82f6", borderRadius:12, padding:10, color:"#60a5fa", fontWeight:700, fontSize:12, cursor:"pointer" }}>▶ {t.play}</button>
                ) : status==="speaking" ? (
                  <button onClick={doPause} style={{ background:"#334155", border:"none", borderRadius:12, padding:10, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>⏸ {t.pause}</button>
                ) : status==="paused" ? (
                  <button onClick={doResume} style={{ background:"#1e3a5f", border:"1px solid #3b82f6", borderRadius:12, padding:10, color:"#60a5fa", fontWeight:700, fontSize:12, cursor:"pointer" }}>▶ Resume</button>
                ) : (
                  <button disabled style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:12, padding:10, color:"#475569", fontSize:12, cursor:"not-allowed" }}>▶ {t.play}</button>
                )}
                <button onClick={doPlay} style={{ background:"#334155", border:"none", borderRadius:12, padding:10, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>🔄 {t.replay}</button>
                <button onClick={doStop} style={{ background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:12, padding:10, color:"#f87171", fontWeight:700, fontSize:12, cursor:"pointer" }}>⏹ {t.stop}</button>
              </div>
            </div>

            {/* ── Step 2: Record ── */}
            <div style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.3)", borderRadius:16, padding:12, marginBottom:10 }}>
              <p style={{ color:"#a78bfa", fontSize:10, fontWeight:800, marginBottom:6, letterSpacing:1 }}>STEP 2 — RECORD AUDIO</p>
              <p style={{ color:"#64748b", fontSize:10, marginBottom:10, lineHeight:1.5 }}>
                Keep phone volume HIGH. The mic records what the speaker plays.
              </p>
              {status==="recording" ? (
                <button onClick={stopRecording}
                  style={{ width:"100%", background:"rgba(220,38,38,0.2)", border:"2px solid #ef4444", borderRadius:14, padding:12, color:"#f87171", fontWeight:800, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ repeat:Infinity, duration:1 }} style={{ width:10, height:10, borderRadius:"50%", background:"#ef4444", display:"inline-block" }}/>
                  RECORDING... Tap to Stop
                </button>
              ) : (
                <button onClick={doRecord} disabled={!canRecord || status==="speaking" || status==="loading"}
                  style={{ width:"100%", background:canRecord?"rgba(167,139,250,0.2)":"#1e293b", border:`1px solid ${canRecord?"rgba(167,139,250,0.5)":"#334155"}`, borderRadius:14, padding:12, color:canRecord?"#c4b5fd":"#475569", fontWeight:800, fontSize:13, cursor:canRecord?"pointer":"not-allowed" }}>
                  {canRecord ? "⏺  Record Audio File" : "Not supported — use Chrome on Android"}
                </button>
              )}
            </div>

            {/* ── Step 3: Audio player + share (shown after recording) ── */}
            {audioURL && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.35)", borderRadius:16, padding:14, marginBottom:10 }}>
                <p style={{ color:"#34d399", fontSize:10, fontWeight:800, marginBottom:10, letterSpacing:1 }}>STEP 3 — SEND VIA WHATSAPP</p>

                {/* Native HTML5 audio player — plays the recorded audio */}
                <div style={{ background:"#0f172a", borderRadius:12, padding:8, marginBottom:12 }}>
                  <p style={{ color:"#64748b", fontSize:10, marginBottom:6, fontWeight:600 }}>Listen before sending:</p>
                  <audio
                    controls
                    src={audioURL}
                    style={{ width:"100%", height:40, borderRadius:8 }}
                    preload="auto"
                  />
                </div>

                {/* Share button — Web Share API on mobile sends file directly to WhatsApp */}
                <button onClick={doShareAudio}
                  style={{ width:"100%", background:"#059669", border:"none", borderRadius:14, padding:13, color:"#fff", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>📲</span>  Share Audio on WhatsApp
                </button>

                {/* Download button */}
                <button onClick={doDownload}
                  style={{ width:"100%", background:"rgba(29,78,216,0.2)", border:"1px solid rgba(29,78,216,0.4)", borderRadius:14, padding:10, color:"#60a5fa", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                  Download Audio File
                </button>

                <p style={{ color:"#475569", fontSize:10, marginTop:8, lineHeight:1.6, textAlign:"center" }}>
                  On Android: tap Share → WhatsApp → select contact → send<br/>
                  On desktop: download file → open WhatsApp Web → tap 📎 → attach
                </p>
              </motion.div>
            )}

            {/* ── Fallback text WA ── */}
            <button onClick={() => {
              const waText = `Voice reminder: ${c.name} - Rs.${fmt(c.amountDue)} pending.\nPay via UPI: ${settings.upiId||"shop@upi"}`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waText)}`, "_blank");
            }}
              style={{ width:"100%", background:"rgba(5,150,105,0.1)", border:"1px solid rgba(5,150,105,0.25)", borderRadius:14, padding:10, color:"#34d399", fontWeight:700, fontSize:12, cursor:"pointer" }}>
              Send Text Reminder via WhatsApp (no audio)
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CALL MODAL
// ══════════════════════════════════════════════════════════════════
function CallModal({ c, settings, t, lang, onClose }) {
  const script = buildCall(c, settings, lang);
  const cleanPhone = c.phone.replace(/\D/g,"");
  const isValidPhone = cleanPhone.length >= 10;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", padding:16 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ y:60 }} animate={{ y:0 }} exit={{ y:60 }}
        style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:28, padding:20, width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <span style={{ fontWeight:800, fontSize:15, color:"#fff" }}>{t.callScript}</span>
          <button onClick={onClose} style={{ color:"#64748b", background:"none", border:"none", cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
        <div style={{ background:"#0f172a", border:"1px solid #334155", borderRadius:16, padding:14, marginBottom:14, fontSize:13, color:"#cbd5e1", lineHeight:1.8, whiteSpace:"pre-line" }}>{script}</div>
        {isValidPhone ? (
          <a href={`tel:${cleanPhone}`}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"#16a34a", borderRadius:16, padding:12, color:"#fff", fontWeight:800, fontSize:14, textDecoration:"none", marginBottom:8 }}>
            📞 {t.openDialer} — {c.phone}
          </a>
        ) : (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:16, padding:12, marginBottom:8, textAlign:"center" }}>
            <p style={{ color:"#f87171", fontSize:12, fontWeight:700, margin:0 }}>⛔ Invalid phone number — cannot dial</p>
          </div>
        )}
        <button onClick={onClose} style={{ width:"100%", background:"none", border:"none", color:"#64748b", fontSize:13, cursor:"pointer", padding:4 }}>{t.cancel}</button>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PAID RECEIPT MODAL
// ══════════════════════════════════════════════════════════════════
function PaidModal({ c, settings, t, onClose }) {
  const phone = c.phone.replace(/\D/g,"");
  const shop  = settings.shopName || "Shop";
  const receipt = `*Payment Confirmed — ${shop}*\n\nNameste ${c.name} garu\n\nMeeru *Rs.${fmt(c.amountDue)}* challinchaaru.\n${c.desc?`Vivrana: ${c.desc}\n`:""}\nDate: ${new Date().toLocaleDateString("en-IN")}\nShop: ${shop}\nUPI: ${settings.upiId||"shop@upi"}\n\nDhanyavaadaalu\n— *${shop}*`;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <motion.div initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }} transition={{ type:"spring", stiffness:300, damping:25 }}
        style={{ background:"#1e293b", border:"1px solid rgba(16,185,129,0.4)", borderRadius:28, padding:24, maxWidth:340, width:"100%", textAlign:"center" }}>
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.15, type:"spring" }} style={{ fontSize:52, marginBottom:8 }}>🎉</motion.div>
        <p style={{ color:"#34d399", fontWeight:800, fontSize:18, marginBottom:4 }}>చెల్లించారు!</p>
        <p style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:4 }}>{c.name}</p>
        <p style={{ color:"#34d399", fontFamily:"monospace", fontSize:28, fontWeight:900, marginBottom:4 }}>₹{fmt(c.amountDue)}</p>
        {c.desc && <p style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>📝 {c.desc}</p>}
        <p style={{ color:"#475569", fontSize:11, marginBottom:20 }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <a href={`https://wa.me/${phone}?text=${encodeURIComponent(receipt)}`} target="_blank" rel="noopener noreferrer"
            style={{ background:"#059669", borderRadius:14, padding:11, color:"#fff", fontWeight:700, fontSize:13, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
            🟢 రసీదు పంపు
          </a>
          <button onClick={onClose} style={{ background:"#334155", border:"none", borderRadius:14, padding:11, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>{t.cancel}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CUSTOMER CARD
// ══════════════════════════════════════════════════════════════════
function CustCard({ c, t, settings, lang, onEdit, onDel, onMarkPaid, onUndoPaid, onWA, onVoice, onQR, onCall, onReceipt }) {
  const days   = daysDiff(c.dueDate);
  const [open, setOpen] = useState(false);
  const urgBg     = c.paid ? "rgba(16,185,129,0.08)"  : days>7 ? "rgba(239,68,68,0.08)"  : days>0 ? "rgba(234,88,12,0.08)"  : "rgba(245,158,11,0.06)";
  const urgBorder = c.paid ? "rgba(16,185,129,0.28)"  : days>7 ? "rgba(239,68,68,0.28)"  : days>0 ? "rgba(234,88,12,0.28)"  : "rgba(245,158,11,0.18)";
  const amtClr    = c.paid ? "#34d399" : days>7 ? "#f87171" : days>0 ? "#fb923c" : "#fbbf24";
  const badgeBg   = c.paid ? "rgba(16,185,129,0.15)"  : days>7 ? "rgba(239,68,68,0.15)"  : days>0 ? "rgba(234,88,12,0.15)"  : "rgba(245,158,11,0.12)";
  const badgeClr  = c.paid ? "#34d399" : days>7 ? "#f87171" : days>0 ? "#fb923c" : "#fbbf24";
  const statusLabel = c.paid ? t.paid : days>7 ? `${days}d ${t.pendingDays}` : days===0 ? t.dueToday : t.pending;

  return (
    <motion.div layout initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-30 }}
      style={{ background:urgBg, border:`1px solid ${urgBorder}`, borderRadius:20, overflow:"hidden" }}>
      <div style={{ padding:"14px 14px 10px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          {/* Avatar */}
          <div style={{ width:40, height:40, borderRadius:"50%", background:c.paid?"rgba(16,185,129,0.2)":"rgba(245,158,11,0.2)", border:`1px solid ${c.paid?"rgba(16,185,129,0.4)":"rgba(245,158,11,0.35)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:c.paid?"#34d399":"#fbbf24", fontWeight:800, fontSize:14, flexShrink:0 }}>
            {c.name[0].toUpperCase()}
          </div>
          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:6, marginBottom:2 }}>
              <span style={{ fontWeight:800, color:"#fff", fontSize:14 }}>{c.name}</span>
              <span style={{ background:badgeBg, color:badgeClr, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{statusLabel}</span>
              {c.reminderCount>0 && !c.paid && (
                <span style={{ background:"rgba(100,116,139,0.2)", color:"#94a3b8", fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20 }}>#{c.reminderCount}</span>
              )}
            </div>
            <p style={{ color:"#64748b", fontSize:11, margin:0 }}>{c.phone}</p>
            {c.desc && <p style={{ color:"#94a3b8", fontSize:11, margin:"2px 0 0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>📝 {c.desc}</p>}
            {c.paid && c.paidAt && <p style={{ color:"#059669", fontSize:10, margin:"2px 0 0" }}>{t.paidOn}: {new Date(c.paidAt).toLocaleDateString()}</p>}
          </div>
          {/* Amount + toggle */}
          <div style={{ flexShrink:0, textAlign:"right" }}>
            <div style={{ fontSize:17, fontWeight:900, fontFamily:"monospace", color:amtClr }}>₹{fmt(c.amountDue)}</div>
            <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"none", color:"#475569", fontSize:10, cursor:"pointer", marginTop:2 }}>{open?"▲ hide":"▼ more"}</button>
          </div>
        </div>

        {/* Action buttons */}
        {!c.paid && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginTop:12 }}>
            {[
              { label:t.wa,    emoji:"💬", bg:"rgba(5,150,105,0.18)",   border:"rgba(5,150,105,0.35)",   clr:"#34d399", fn:onWA },
              { label:t.voice, emoji:"🎙️", bg:"rgba(168,85,247,0.18)", border:"rgba(168,85,247,0.35)", clr:"#c084fc", fn:onVoice },
              { label:t.qr,   emoji:"📱",  bg:"rgba(59,130,246,0.18)",  border:"rgba(59,130,246,0.35)",  clr:"#60a5fa", fn:onQR },
              { label:t.call, emoji:"📞",  bg:"rgba(100,116,139,0.18)", border:"rgba(100,116,139,0.25)", clr:"#94a3b8", fn:onCall },
            ].map(({ label, emoji, bg, border, clr, fn }) => (
              <button key={label} onClick={fn}
                style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:"8px 4px", color:clr, fontSize:10, fontWeight:700, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <span style={{ fontSize:15 }}>{emoji}</span><span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            style={{ borderTop:"1px solid rgba(100,116,139,0.2)", background:"rgba(15,23,42,0.5)", padding:"12px 14px", overflow:"hidden" }}>
            {c.notes && <p style={{ color:"#64748b", fontSize:12, background:"rgba(30,41,59,0.8)", borderRadius:10, padding:"8px 10px", marginBottom:10 }}>{c.notes}</p>}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {!c.paid && (
                <button onClick={onMarkPaid} style={{ background:"rgba(5,150,105,0.2)", border:"1px solid rgba(5,150,105,0.4)", borderRadius:12, padding:"7px 12px", color:"#34d399", fontSize:12, fontWeight:800, cursor:"pointer" }}>✓ {t.markPaid}</button>
              )}
              {c.paid && (
                <>
                  <button onClick={onReceipt} style={{ background:"rgba(5,150,105,0.15)", border:"1px solid rgba(5,150,105,0.3)", borderRadius:12, padding:"7px 12px", color:"#34d399", fontSize:12, fontWeight:700, cursor:"pointer" }}>🧾 Receipt</button>
                  <button onClick={onUndoPaid} style={{ background:"rgba(234,179,8,0.15)", border:"1px solid rgba(234,179,8,0.3)", borderRadius:12, padding:"7px 12px", color:"#fbbf24", fontSize:12, fontWeight:700, cursor:"pointer" }}>↩ {t.undoPaid}</button>
                </>
              )}
              <button onClick={onEdit} style={{ background:"rgba(100,116,139,0.2)", border:"1px solid rgba(100,116,139,0.3)", borderRadius:12, padding:"7px 12px", color:"#94a3b8", fontSize:12, fontWeight:700, cursor:"pointer" }}>✏️ {t.edit}</button>
              <button onClick={onDel}  style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:12, padding:"7px 12px", color:"#f87171", fontSize:12, fontWeight:700, cursor:"pointer" }}>🗑️ {t.del}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SETTINGS PAGE — with full validation
// ══════════════════════════════════════════════════════════════════
function SettingsPage({ settings, scriptUrl, onSave, t, lang, onLangChange }) {
  const [f, setF]       = useState({ shopName:"", upiId:"", ownerPhone:"", scriptUrl:scriptUrl||"", ...settings });
  const [errs, setErrs]   = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [testStatus, setTestStatus] = useState("idle"); // idle|testing|ok|fail

  const validate = (fields) => {
    const { errors } = validateSettings(fields, t);
    setErrs(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (k) => (e) => {
    const val = e.target.value;
    if (k === "ownerPhone" && /[a-zA-Z]/.test(val.slice(-1))) {
      setErrs(p => ({ ...p, ownerPhone: t.err_phoneLetters }));
      setF(p => ({ ...p, [k]: val.replace(/[a-zA-Z]/g,"") }));
      return;
    }
    const updated = { ...f, [k]: val };
    setF(updated);
    if (touched[k] || submitted) validate(updated);
  };

  const handleBlur = (k) => () => {
    setTouched(p => ({ ...p, [k]: true }));
    validate(f);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTouched({ shopName:true, upiId:true, ownerPhone:true, scriptUrl:true });
    const ok = validate(f);
    if (ok) onSave(f);
  };

  // Test the Script URL connection
  const testConnection = async () => {
    const url = f.scriptUrl || "";
    if (!url || url.includes("YOUR_DEPLOYMENT_ID")) {
      setTestStatus("fail");
      return;
    }
    setTestStatus("testing");
    try {
      const res  = await fetch(`${url}?action=ping&t=${Date.now()}`, { method:"GET", redirect:"follow" });
      const text = await res.text();
      const json = JSON.parse(text);
      if (json.ok) setTestStatus("ok");
      else { setTestStatus("fail"); }
    } catch(e) {
      setTestStatus("fail");
    }
    setTimeout(() => setTestStatus("idle"), 5000);
  };

  const inp = (k) => ({ ...INP(!!(errs[k] && (touched[k]||submitted))) });

  const testColors = { idle:"#475569", testing:"#60a5fa", ok:"#34d399", fail:"#f87171" };
  const testLabels = { idle:"Test Connection", testing:"Testing...", ok:"Connected!", fail:"Connection Failed" };

  const deployOptions = [
    { name:"Render.com",  e:"🟢", desc:"BEST free option — static sites + free tier, GitHub auto deploy.", url:"https://render.com" },
    { name:"Railway.app", e:"🚂", desc:"$5/mo free credit. Node.js + persistent disk. Ideal for this app.", url:"https://railway.app" },
    { name:"Fly.io",      e:"🪁", desc:"3 free VMs + persistent volumes. Full Node.js support.", url:"https://fly.io" },
    { name:"Vercel",      e:"▲",  desc:"Best for React frontend only. Zero config.", url:"https://vercel.com" },
    { name:"Netlify",     e:"🌐", desc:"Good for static frontend. 300 free build mins/month.", url:"https://netlify.com" },
  ];

  return (
    <div style={{ padding:16, maxWidth:480, margin:"0 auto", paddingBottom:40 }}>
      <p style={{ fontWeight:800, fontSize:18, color:"#fff", marginBottom:16 }}>{t.settings}</p>

      {/* Google Sheets Connection */}
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:20, padding:18, marginBottom:16 }}>
        <p style={{ color:"#fbbf24", fontWeight:800, fontSize:12, marginBottom:14 }}>☁️ Google Sheets Connection</p>

        {/* How-to steps */}
        <div style={{ background:"#0f172a", border:"1px solid #1e3a5f", borderRadius:14, padding:12, marginBottom:14 }}>
          <p style={{ color:"#60a5fa", fontWeight:800, fontSize:11, marginBottom:8 }}>How to get your Script URL:</p>
          {[
            "Go to script.google.com",
            "Paste Code.gs → Run setup()",
            "Deploy → New Deployment → Web App",
            "Execute as: Me | Access: Anyone",
            "Copy the URL and paste below",
          ].map((step,i) => (
            <p key={i} style={{ color:"#64748b", fontSize:11, margin:"0 0 4px", display:"flex", gap:6 }}>
              <span style={{ color:"#f59e0b", fontWeight:800, flexShrink:0 }}>{i+1}.</span>{step}
            </p>
          ))}
        </div>

        <div style={{ marginBottom:10 }}>
          <p style={{ color: errs.scriptUrl&&(touched.scriptUrl||submitted) ? "#f87171" : "#94a3b8", fontSize:11, fontWeight:700, marginBottom:5 }}>
            {t.scriptUrl} <span style={{ color:"#ef4444" }}>*</span>
          </p>
          <input value={f.scriptUrl||""} onChange={handleChange("scriptUrl")} onBlur={handleBlur("scriptUrl")}
            placeholder="https://script.google.com/macros/s/…/exec"
            style={{ ...inp("scriptUrl"), marginBottom:6 }} />
          <AnimatePresence>
            {errs.scriptUrl && (touched.scriptUrl||submitted) && <FieldError msg={errs.scriptUrl} />}
          </AnimatePresence>
        </div>

        {/* Test connection button */}
        <button onClick={testConnection} disabled={testStatus==="testing"}
          style={{ width:"100%", background:"rgba(96,165,250,0.1)", border:`1px solid ${testColors[testStatus]}40`, borderRadius:14,
            padding:10, color:testColors[testStatus], fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}>
          {testStatus==="testing" ? "⟳ Testing connection..." :
           testStatus==="ok"      ? "✅ "+testLabels.ok+" — Google Sheets is connected!" :
           testStatus==="fail"    ? "❌ "+testLabels.fail+" — Check URL & permissions" :
           "🔗 "+testLabels.idle}
        </button>
      </div>

      {/* Shop Details */}
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:20, padding:18, marginBottom:16 }}>
        <p style={{ color:"#fbbf24", fontWeight:800, fontSize:12, marginBottom:14 }}>🏪 Shop Details</p>
        {[
          { k:"shopName",   l:t.shopName,   ph:"Ravi Kirana / రవి కిరాణా",  req:true  },
          { k:"upiId",      l:t.upiId,      ph:"yourshop@upi",               req:false },
          { k:"ownerPhone", l:t.ownerPhone, ph:"919876543210 (with country code)", req:false },
        ].map(({ k, l, ph, req }) => {
          const hasErr = !!(errs[k] && (touched[k]||submitted));
          return (
            <div key={k} style={{ marginBottom:14 }}>
              <p style={{ color: hasErr ? "#f87171" : "#94a3b8", fontSize:11, fontWeight:700, marginBottom:5 }}>
                {l}{req && <span style={{ color:"#ef4444" }}> *</span>}
              </p>
              <input value={f[k]||""} onChange={handleChange(k)} onBlur={handleBlur(k)} placeholder={ph}
                style={inp(k)}
                inputMode={k==="ownerPhone" ? "numeric" : undefined} />
              <AnimatePresence>
                {hasErr && <FieldError msg={errs[k]} />}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Language */}
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:20, padding:18, marginBottom:16 }}>
        <p style={{ color:"#fbbf24", fontWeight:800, fontSize:12, marginBottom:14 }}>🌐 {t.language}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {["te","en"].map(l => (
            <button key={l} onClick={()=>onLangChange(l)}
              style={{ background:lang===l?"#f59e0b":"#334155", border:"none", borderRadius:14, padding:11, color:lang===l?"#1e293b":"#94a3b8", fontWeight:800, fontSize:14, cursor:"pointer" }}>
              {l==="te" ? "తెలుగు" : "English"}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit}
        style={{ width:"100%", background:"#f59e0b", border:"none", borderRadius:16, padding:14, color:"#1e293b", fontWeight:800, fontSize:14, cursor:"pointer", marginBottom:20 }}>
        {t.saveSettings}
      </button>

      {/* Deploy guide */}
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:20, padding:18 }}>
        <p style={{ color:"#fbbf24", fontWeight:800, fontSize:12, marginBottom:14 }}>🚀 Free Deployment Options</p>
        {deployOptions.map(({ name, e, desc, url }) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"flex-start", gap:12, background:"#0f172a", border:"1px solid #1e293b", borderRadius:14, padding:12, marginBottom:8, textDecoration:"none" }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{e}</span>
            <div>
              <p style={{ color:"#fff", fontWeight:700, fontSize:13, margin:"0 0 2px" }}>{name}</p>
              <p style={{ color:"#64748b", fontSize:11, margin:0, lineHeight:1.5 }}>{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// REMINDERS PAGE
// ══════════════════════════════════════════════════════════════════
function RemindersPage({ reminders, t }) {
  return (
    <div style={{ padding:16, maxWidth:480, margin:"0 auto" }}>
      <p style={{ fontWeight:800, fontSize:18, color:"#fff", marginBottom:16 }}>{t.reminderHistory}</p>
      {reminders.length===0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#475569" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
          <p>{t.noRem}</p>
        </div>
      ) : (
        reminders.slice(0,80).map((r,i) => {
          const typeClr  = { whatsapp:"#34d399", voice:"#c084fc", qr:"#60a5fa" }[r.type]||"#94a3b8";
          const typeEmoji = { whatsapp:"💬", voice:"🎙️", qr:"📱" }[r.type]||"📩";
          return (
            <div key={i} style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:16, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>{typeEmoji}</span>
                <div>
                  <p style={{ fontWeight:700, color:"#fff", fontSize:13, margin:0 }}>{r.name}</p>
                  <p style={{ color:typeClr, fontSize:11, margin:0, fontWeight:600 }}>{r.type==="whatsapp"?"WhatsApp":r.type==="voice"?"Voice":"QR Pay"}</p>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ color:"#fbbf24", fontFamily:"monospace", fontSize:13, fontWeight:800, margin:0 }}>₹{fmt(r.amount)}</p>
                <p style={{ color:"#475569", fontSize:10, margin:0 }}>{new Date(r.at).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
export default function BandhanPay() {
  const [lang,      setLang]      = useState(() => ldLS(S_LANG, "te"));
  const [customers, setCust]      = useState([]);
  const [settings,  setSettings]  = useState({ shopName:"మా షాప్", upiId:"shop@upi", ownerPhone:"" });
  const [scriptUrl, setScriptUrl] = useState(() => ldLS("bp_script_url", DEFAULT_SCRIPT_URL));
  const [reminders, setRem]       = useState([]);
  const [page,      setPage]      = useState("dashboard");
  const [modal,     setModal]     = useState(null);
  const [toasts,    setToasts]    = useState([]);   // [{id,msg,type}]
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [sort,      setSort]      = useState("name");
  const [loadState, setLoadState] = useState("loading");
  const [syncStatus,setSyncStatus]= useState("idle");

  const t = T[lang];

  // ── Bootstrap: load from Google Sheets on mount ──────────────
  useEffect(() => {
    const url = ldLS("bp_script_url", DEFAULT_SCRIPT_URL);
    if (!url || url.includes("YOUR_DEPLOYMENT_ID")) {
      // No script URL — load from cache
      setCust(ldLS("bp_cust_cache",[]));
      setSettings(s => ({ ...s, ...ldLS("bp_sett_cache",{}) }));
      setRem(ldLS("bp_rem_cache",[]));
      setLoadState("ready");
      return;
    }
    setLoadState("loading");
    setSyncStatus("syncing");
    apiGet(url, "all")
      .then(data => {
        if (data.customers && Array.isArray(data.customers)) setCust(data.customers);
        if (data.settings  && typeof data.settings==="object") setSettings(s => ({ ...s, ...data.settings }));
        if (data.reminders && Array.isArray(data.reminders))  setRem(data.reminders);
        setLoadState("ready");
        setSyncStatus("synced");
        setTimeout(() => setSyncStatus("idle"), 2000);
      })
      .catch(err => {
        console.error("Load from Sheets failed:", err.message);
        // Fallback to localStorage cache
        const cached = ldLS("bp_cust_cache",[]);
        const cachedS = ldLS("bp_sett_cache",{});
        const cachedR = ldLS("bp_rem_cache",[]);
        if (cached.length) setCust(cached);
        if (Object.keys(cachedS).length) setSettings(s => ({ ...s, ...cachedS }));
        if (cachedR.length) setRem(cachedR);
        setLoadState("ready");
        setSyncStatus("error");
        setTimeout(() => setSyncStatus("idle"), 5000);
      });
  }, []); // eslint-disable-line

  // ── Cache to localStorage ──────────────────────────────────────
  useEffect(() => { svLS("bp_cust_cache", customers); }, [customers]);
  useEffect(() => { svLS("bp_sett_cache", settings);  }, [settings]);
  useEffect(() => { svLS("bp_rem_cache",  reminders); }, [reminders]);
  useEffect(() => { svLS(S_LANG, lang); }, [lang]);

  // ── Toast helpers ──────────────────────────────────────────────
  const addToast = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, msg, type }]);
    setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), 3200);
  }, []);

  const close = () => setModal(null);

  // ── Sync helper — uses GET+params to bypass CORS ──────────────
  const sync = async (action, data) => {
    const url = ldLS("bp_script_url", DEFAULT_SCRIPT_URL);
    if (!url || url.includes("YOUR_DEPLOYMENT_ID")) return;
    setSyncStatus("syncing");
    try {
      await apiWrite(url, action, data);
      setSyncStatus("synced");
      setTimeout(() => setSyncStatus("idle"), 2500);
    } catch(err) {
      console.error("Sync failed:", action, err.message);
      setSyncStatus("error");
      addToast("⚠️ Sync failed: " + err.message, "error");
      setTimeout(() => setSyncStatus("idle"), 4000);
    }
  };

  // ── CRUD ───────────────────────────────────────────────────────
  const saveCust = async (form) => {
    const isEdit = modal?.data?.id;
    if (isEdit) {
      const updated = { ...modal.data, ...form, amountDue: Number(form.amountDue) };
      setCust(cs => cs.map(c => c.id===isEdit ? updated : c));
      close();
      addToast(t.t_saved);
      await sync("update_customer", updated);
    } else {
      const newC = { ...form, id: String(Date.now()), amountDue: Number(form.amountDue), paid:false, reminderCount:0, paidAt:"", createdAt:new Date().toISOString() };
      setCust(cs => [...cs, newC]);
      close();
      addToast(t.t_saved);
      await sync("save_customer", newC);
    }
  };

  const delCust = async (id) => {
    setCust(cs => cs.filter(c => c.id!==id));
    close();
    addToast(t.t_del, "warn");
    await sync("delete_customer", { id });
  };

  const markPaid = async (id) => {
    const paidAt = new Date().toISOString();
    setCust(cs => cs.map(c => c.id===id ? { ...c, paid:true, paidAt } : c));
    const c = customers.find(x => x.id===id);
    if (c) setModal({ type:"paid", data: { ...c, paid:true, paidAt } });
    addToast(t.t_paid);
    await sync("mark_paid", { id, paidAt });
  };

  const undoPaid = async (id) => {
    setCust(cs => cs.map(c => c.id===id ? { ...c, paid:false, paidAt:"" } : c));
    close();
    await sync("undo_paid", { id });
  };

  const sendWA = async (c) => {
    const msg   = buildWAMsg(c, settings, lang, c.reminderCount||0);
    const phone = c.phone.replace(/\D/g,"");
    if (phone.length < 10) { addToast("Invalid phone number — cannot send WhatsApp", "error"); return; }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    const newCount = (c.reminderCount||0) + 1;
    setCust(cs => cs.map(x => x.id===c.id ? { ...x, reminderCount: newCount } : x));
    addToast(t.t_wa);
    await sync("increment_reminder", { id: c.id });
    const rem = { name:c.name, amount:c.amountDue, type:"whatsapp", at:new Date().toISOString() };
    setRem(rs => [rem, ...rs]);
    await sync("log_reminder", rem);
  };

  const logRem = async (c, type) => {
    const rem = { name:c.name, amount:c.amountDue, type, at:new Date().toISOString() };
    setRem(rs => [rem, ...rs]);
    await sync("log_reminder", rem);
  };

  const saveSettingsFn = async (form) => {
    const { scriptUrl: newUrl, ...rest } = form;
    setSettings(rest);
    if (newUrl && newUrl !== scriptUrl) {
      setScriptUrl(newUrl);
      svLS("bp_script_url", newUrl);
    }
    addToast("✅ " + t.saveSettings);
    const url = newUrl || ldLS("bp_script_url", DEFAULT_SCRIPT_URL);
    if (url && !url.includes("YOUR_DEPLOYMENT_ID")) {
      setSyncStatus("syncing");
      try {
        await apiWrite(url, "save_settings", rest);
        setSyncStatus("synced");
        addToast("☁️ Settings synced to Google Drive!", "success");
        setTimeout(() => setSyncStatus("idle"), 2500);
      } catch(err) {
        setSyncStatus("error");
        addToast("⚠️ Settings save failed: " + err.message, "error");
      }
    }
  };

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.phone.includes(q) && !(c.desc||"").toLowerCase().includes(q)) return false;
    if (filter==="overdue") return !c.paid && daysDiff(c.dueDate)>0;
    if (filter==="paid")    return c.paid;
    if (filter==="unpaid")  return !c.paid;
    return true;
  }).sort((a,b) => {
    if (sort==="amount") return b.amountDue - a.amountDue;
    if (sort==="days")   return daysDiff(b.dueDate) - daysDiff(a.dueDate);
    return a.name.localeCompare(b.name);
  });

  const unpaid     = customers.filter(c => !c.paid);
  const overdue    = unpaid.filter(c => daysDiff(c.dueDate)>0);
  const paidToday  = customers.filter(c => c.paid && c.paidAt && new Date(c.paidAt).toDateString()===new Date().toDateString());
  const totalPend  = unpaid.reduce((s,c) => s+Number(c.amountDue), 0);
  const hasScript  = scriptUrl && !scriptUrl.includes("YOUR_DEPLOYMENT_ID");

  return (
    <div style={{ minHeight:"100vh", background:"#020817", color:"#fff", fontFamily:"'Plus Jakarta Sans','Noto Sans Telugu',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        input,textarea,select{font-family:inherit;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.6);}
        input:focus,textarea:focus{border-color:#f59e0b !important;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0f172a;}::-webkit-scrollbar-thumb{background:#334155;border-radius:4px;}
      `}</style>

      {/* Ambient glow */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", top:-80, left:"30%", width:320, height:320, background:"rgba(245,158,11,0.05)", borderRadius:"50%", filter:"blur(60px)" }}/>
        <div style={{ position:"absolute", bottom:0, right:"20%", width:260, height:260, background:"rgba(59,130,246,0.04)", borderRadius:"50%", filter:"blur(60px)" }}/>
      </div>

      {/* Banners */}
      {!hasScript && loadState==="ready" && (
        <div style={{ background:"#431407", borderBottom:"1px solid #c2410c", padding:"8px 16px", textAlign:"center", fontSize:11, color:"#fed7aa", fontWeight:600, position:"relative", zIndex:10 }}>
          {t.setupNeeded}
          <button onClick={()=>setPage("settings")} style={{ background:"none", border:"none", color:"#fb923c", fontWeight:800, fontSize:11, cursor:"pointer", textDecoration:"underline", marginLeft:6 }}>
            ⚙️ Settings →
          </button>
        </div>
      )}
      {syncStatus==="error" && hasScript && (
        <div style={{ background:"#1e293b", borderBottom:"1px solid #334155", padding:"6px 16px", textAlign:"center", fontSize:11, color:"#f87171", fontWeight:600, position:"relative", zIndex:10 }}>
          {t.offlineBanner}
        </div>
      )}

      {/* Header */}
      <header style={{ position:"sticky", top:0, zIndex:40, background:"rgba(2,8,23,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(51,65,85,0.6)", padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, background:"#f59e0b", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", color:"#1e293b", fontWeight:900, fontSize:15, boxShadow:"0 0 16px rgba(245,158,11,0.35)", flexShrink:0 }}>₹</div>
          <div>
            <div style={{ fontWeight:900, color:"#fbbf24", fontSize:16, lineHeight:1.1 }}>{t.appName}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:9, color:"#475569" }}>{t.tagline}</div>
              <SyncBadge status={syncStatus}/>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => setLang(l => l==="te"?"en":"te")}
            style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:10, padding:"5px 10px", color:"#94a3b8", fontSize:11, fontWeight:800, cursor:"pointer" }}>
            {lang==="te" ? "EN" : "తె"}
          </button>
          <button onClick={() => setModal({ type:"add" })}
            style={{ background:"#f59e0b", border:"none", borderRadius:12, padding:"6px 12px", color:"#1e293b", fontSize:11, fontWeight:900, cursor:"pointer" }}>
            + {t.addCustomer}
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav style={{ position:"sticky", top:57, zIndex:30, background:"rgba(2,8,23,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(51,65,85,0.4)", padding:"8px 12px", display:"flex", gap:6, overflowX:"auto" }}>
        {[
          { id:"dashboard", icon:"📊", l:t.dashboard },
          { id:"customers", icon:"👥", l:t.customers  },
          { id:"reminders", icon:"📋", l:t.remHist    },
          { id:"settings",  icon:"⚙️", l:t.settings   },
        ].map(({ id, icon, l }) => (
          <button key={id} onClick={() => setPage(id)}
            style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 12px", borderRadius:14, border:"none", cursor:"pointer", fontSize:11, fontWeight:800, whiteSpace:"nowrap", background:page===id?"#f59e0b":"transparent", color:page===id?"#1e293b":"#64748b", transition:"all 0.15s" }}>
            <span>{icon}</span><span>{l}</span>
          </button>
        ))}
      </nav>

      {/* Main */}
      <main style={{ paddingBottom:100, position:"relative", zIndex:1 }}>
        <AnimatePresence mode="wait">

          {/* Loading */}
          {loadState==="loading" && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 16px", gap:16 }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1, ease:"linear" }}
                style={{ width:40, height:40, border:"3px solid #334155", borderTopColor:"#f59e0b", borderRadius:"50%" }}/>
              <p style={{ color:"#64748b", fontSize:13 }}>{t.loading}</p>
            </motion.div>
          )}

          {/* Dashboard */}
          {loadState==="ready" && page==="dashboard" && (
            <motion.div key="dash" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ padding:16, maxWidth:480, margin:"0 auto" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                <SC icon="💰" label={t.totalPending}  value={`₹${fmt(totalPend)}`}      a="amber"/>
                <SC icon="👥" label={t.totalCust}     value={customers.length}           a="blue"/>
                <SC icon="⚠️" label={t.overdueCount}  value={overdue.length}
                  sub={overdue.length>0 ? `₹${fmt(overdue.reduce((s,c)=>s+c.amountDue,0))}` : "—"} a="red"/>
                <SC icon="✅" label={t.paidToday}     value={paidToday.length}
                  sub={paidToday.length>0 ? `₹${fmt(paidToday.reduce((s,c)=>s+c.amountDue,0))}` : "—"} a="green"/>
              </div>

              {unpaid.length>0 && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <span style={{ color:"#64748b", fontSize:12, fontWeight:800 }}>⏳ Pending Payments</span>
                    <button onClick={()=>setPage("customers")} style={{ background:"none", border:"none", color:"#f59e0b", fontSize:11, fontWeight:700, cursor:"pointer" }}>View all →</button>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[...unpaid].sort((a,b)=>daysDiff(b.dueDate)-daysDiff(a.dueDate)).slice(0,6).map(c => {
                      const d = daysDiff(c.dueDate);
                      return (
                        <motion.div key={c.id} whileHover={{ x:3 }}
                          style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(30,41,59,0.7)", border:"1px solid rgba(51,65,85,0.5)", borderRadius:16, padding:"10px 14px" }}>
                          <div style={{ width:34, height:34, borderRadius:"50%", background:d>7?"rgba(239,68,68,0.2)":d>0?"rgba(234,88,12,0.2)":"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:d>7?"#f87171":d>0?"#fb923c":"#fbbf24", flexShrink:0 }}>
                            {c.name[0]}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontWeight:700, color:"#fff", fontSize:13, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</p>
                            {c.desc && <p style={{ color:"#475569", fontSize:10, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.desc}</p>}
                            <p style={{ fontSize:10, margin:0, color:d>7?"#f87171":d>0?"#fb923c":"#64748b" }}>{d>0?`${d}d overdue`:d===0?"Due today":"Upcoming"}</p>
                          </div>
                          <div style={{ flexShrink:0, textAlign:"right" }}>
                            <p style={{ color:d>7?"#f87171":"#fbbf24", fontFamily:"monospace", fontWeight:900, fontSize:14, margin:0 }}>₹{fmt(c.amountDue)}</p>
                            <button onClick={()=>sendWA(c)}
                              style={{ background:"rgba(5,150,105,0.15)", border:"1px solid rgba(5,150,105,0.3)", borderRadius:8, padding:"2px 8px", color:"#34d399", fontSize:10, fontWeight:700, cursor:"pointer", marginTop:3 }}>
                              💬 Remind
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {customers.length===0 && (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ fontSize:56, marginBottom:12 }}>📒</div>
                  <p style={{ color:"#475569", fontSize:14, marginBottom:16 }}>{t.empty}</p>
                  <button onClick={()=>setModal({ type:"add" })}
                    style={{ background:"#f59e0b", border:"none", borderRadius:16, padding:"11px 24px", color:"#1e293b", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                    + {t.addCustomer}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Customers */}
          {loadState==="ready" && page==="customers" && (
            <motion.div key="custs" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ padding:16, maxWidth:480, margin:"0 auto" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search}
                style={{ width:"100%", background:"#1e293b", border:"1px solid #334155", borderRadius:16, padding:"10px 16px", color:"#fff", fontSize:13, outline:"none", marginBottom:12, fontFamily:"inherit" }}/>
              <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:12 }}>
                {[{id:"all",l:t.allF},{id:"overdue",l:t.overdueF},{id:"unpaid",l:t.unpaidF},{id:"paid",l:t.paidF}].map(({id,l})=>(
                  <button key={id} onClick={()=>setFilter(id)}
                    style={{ background:filter===id?"#f59e0b":"#1e293b", border:filter===id?"none":"1px solid #334155", borderRadius:12, padding:"6px 12px", color:filter===id?"#1e293b":"#64748b", fontSize:11, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>
                    {l}
                  </button>
                ))}
                <select value={sort} onChange={e=>setSort(e.target.value)}
                  style={{ marginLeft:"auto", background:"#1e293b", border:"1px solid #334155", borderRadius:12, padding:"6px 10px", color:"#94a3b8", fontSize:11, outline:"none", cursor:"pointer" }}>
                  <option value="name">{t.sortName}</option>
                  <option value="amount">{t.sortAmt}</option>
                  <option value="days">{t.sortDays}</option>
                </select>
              </div>
              {filtered.length===0 ? (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#475569" }}>
                  <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
                  <p>{t.empty}</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <AnimatePresence>
                    {filtered.map(c => (
                      <CustCard key={c.id} c={c} t={t} settings={settings} lang={lang}
                        onEdit={()=>setModal({ type:"add", data:c })}
                        onDel={()=>setModal({ type:"del", data:c })}
                        onMarkPaid={()=>markPaid(c.id)}
                        onUndoPaid={()=>undoPaid(c.id)}
                        onWA={()=>sendWA(c)}
                        onVoice={()=>{ setModal({ type:"voice", data:c }); logRem(c,"voice"); }}
                        onQR={()=>{ setModal({ type:"qr", data:c }); logRem(c,"qr"); }}
                        onCall={()=>setModal({ type:"call", data:c })}
                        onReceipt={()=>setModal({ type:"paid", data:c })}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* Reminders */}
          {loadState==="ready" && page==="reminders" && (
            <motion.div key="rem" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <RemindersPage reminders={reminders} t={t}/>
            </motion.div>
          )}

          {/* Settings */}
          {loadState==="ready" && page==="settings" && (
            <motion.div key="sett" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <SettingsPage settings={settings} scriptUrl={scriptUrl} t={t} lang={lang}
                onLangChange={l=>setLang(l)}
                onSave={saveSettingsFn}/>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FAB */}
      {page==="customers" && loadState==="ready" && (
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.93 }}
          onClick={() => setModal({ type:"add" })}
          style={{ position:"fixed", bottom:24, right:16, zIndex:40, width:56, height:56, background:"#f59e0b", border:"none", borderRadius:18, boxShadow:"0 8px 24px rgba(245,158,11,0.45)", fontSize:26, fontWeight:900, color:"#1e293b", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          +
        </motion.button>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal?.type==="add"   && <CustModal  key="cm"  init={modal.data} onSave={saveCust} onClose={close} t={t}/>}
        {modal?.type==="del"   && <DelModal   key="dm"  t={t} customerName={modal.data?.name} onConfirm={()=>delCust(modal.data.id)} onClose={close}/>}
        {modal?.type==="qr"    && <QRModal    key="qm"  c={modal.data} settings={settings} t={t} onClose={close}/>}
        {modal?.type==="voice" && <VoiceModal key="vm"  c={modal.data} settings={settings} t={t} onClose={close}/>}
        {modal?.type==="call"  && <CallModal  key="clm" c={modal.data} settings={settings} t={t} lang={lang} onClose={close}/>}
        {modal?.type==="paid"  && <PaidModal  key="pm"  c={modal.data} settings={settings} t={t} onClose={close}/>}
      </AnimatePresence>

      {/* Toast stack */}
      <div style={{ position:"fixed", bottom:88, left:"50%", transform:"translateX(-50%)", zIndex:300, display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none" }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={()=>setToasts(ts=>ts.filter(x=>x.id!==toast.id))}/>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
