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
async function apiGet(url, action = "all") {
  const res  = await fetch(`${url}?action=${action}`, { method: "GET" });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "API error");
  return json;
}
async function apiPost(url, body) {
  const res  = await fetch(url, { method: "POST", body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "API error");
  return json;
}

// ── Message builders ──────────────────────────────────────────────
function buildWAMsg(c, settings, lang, count) {
  const days = daysDiff(c.dueDate), amt = fmt(c.amountDue);
  const upi  = settings.upiId || "shop@upi", shop = settings.shopName || "Shop";
  const desc = c.desc ? `\n📝 ${c.desc}` : "";
  const urgency = count >= 3
    ? `\n⚠️ ${lang==="te" ? "దయచేసి వెంటనే చెల్లించండి." : "Please pay immediately — urgent."}`
    : count >= 2 ? `\n📌 ${lang==="te" ? "మళ్ళీ గుర్తు చేస్తున్నాం." : "Follow-up reminder."}` : "";
  const upiLink = `upi://pay?pa=${upi}&am=${c.amountDue}&pn=${encodeURIComponent(shop)}&tn=${encodeURIComponent(c.desc||"Payment")}&cu=INR`;
  const daysText = lang==="te"
    ? (days>0 ? `\n📅 ${days} రోజులుగా పెండింగ్.` : days<0 ? `\n📅 ${Math.abs(days)} రోజుల్లో గడువు.` : "\n📅 ఈరోజే గడువు.")
    : (days>0 ? `\n📅 Pending for ${days} days.` : days<0 ? `\n📅 Due in ${Math.abs(days)} days.` : "\n📅 Due today.");
  if (lang==="te") {
    return `నమస్తే *${c.name}* గారు 🙏\n\n*${shop}* నుండి గుర్తు చేస్తున్నాం.\n\nబకాయి: *₹${amt}*${daysText}${desc}${urgency}\n\n💳 *UPI:* ${upi}\n🔗 ${upiLink}\n\nధన్యవాదాలు 🙏\n— *${shop}*`;
  }
  return `Hello *${c.name}* 🙏\n\nReminder from *${shop}*.\n\nDue: *₹${amt}*${daysText}${desc}${urgency}\n\n💳 *UPI:* ${upi}\n🔗 ${upiLink}\n\nThank you 🙏\n— *${shop}*`;
}

function buildSpeech(c, settings) {
  const days = daysDiff(c.dueDate), shop = settings.shopName||"మా షాప్", upi = settings.upiId||"UPI";
  const daysText = days>0 ? `${days} రోజుల నుండి` : days===0 ? "ఈరోజు" : "";
  const descText = c.desc ? `${c.desc} కోసం` : "";
  return `నమస్తే ${c.name} గారు. ${shop} నుండి మీకు గుర్తు చేస్తున్నాం. ${descText} మీ బకాయి ${c.amountDue} రూపాయలు ${daysText} పెండింగ్‌లో ఉంది. దయచేసి ఈరోజే ${upi} ద్వారా చెల్లించండి. ధన్యవాదాలు.`;
}

function buildCall(c, settings, lang) {
  const days = daysDiff(c.dueDate), amt = fmt(c.amountDue), shop = settings.shopName||"Shop", upi = settings.upiId||"shop@upi";
  const desc = c.desc ? `\n📝 ${c.desc}` : "";
  if (lang==="te") return `నమస్తే ${c.name} గారు 🙏\n\n${shop} నుండి మాట్లాడుతున్నాం.\n\nబకాయి: ₹${amt}${days>0 ? ` — ${days} రోజులు మించింది` : ""}${desc}\n\nదయచేసి ఈరోజే చెల్లించండి.\nUPI: ${upi}`;
  return `Hello ${c.name} 🙏\n\nCalling from ${shop}.\n\nDue: ₹${amt}${days>0 ? ` — ${days} days overdue` : ""}${desc}\n\nPlease pay today.\nUPI: ${upi}`;
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
  const waMsg  = `🔳 *QR Payment — ${shop}*\n\n${c.name} గారికి నమస్తే 🙏\nUPI: *${upi}*\nమొత్తం: *₹${fmt(amt)}*\n${c.desc?`📝 ${c.desc}\n`:""}\n${upiStr}`;
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
// VOICE MODAL
// ══════════════════════════════════════════════════════════════════
function VoiceModal({ c, settings, t, onClose }) {
  const [status,   setStatus]   = useState("idle");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const text  = buildSpeech(c, settings);
  const phone = c.phone.replace(/\D/g,"");
  const supported = "speechSynthesis" in window;

  const getBestVoice = () => {
    const v = window.speechSynthesis.getVoices();
    return v.find(x=>x.lang==="te-IN") || v.find(x=>x.lang.startsWith("te")) ||
      v.find(x=>x.lang==="hi-IN") || v.find(x=>x.lang.includes("IN")) ||
      v.find(x=>x.lang.startsWith("en")) || null;
  };

  const doSpeak = () => {
    if (!supported) { setStatus("error"); return; }
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    setProgress(0); setStatus("loading");
    const trySpeak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "te-IN"; utter.rate = 0.8; utter.pitch = 1.05; utter.volume = 1;
      const voice = getBestVoice();
      if (voice) utter.voice = voice;
      utter.onstart  = () => setStatus("speaking");
      utter.onend    = () => { setStatus("done"); setProgress(100); clearInterval(timerRef.current); };
      utter.onerror  = e => { if (e.error!=="interrupted" && e.error!=="canceled") setStatus("error"); };
      utter.onpause  = () => setStatus("paused");
      utter.onresume = () => setStatus("speaking");
      window.speechSynthesis.speak(utter);
      setStatus("speaking");
      const est = Math.max(4000, text.length*75);
      let el = 0;
      timerRef.current = setInterval(() => { el+=300; setProgress(Math.min(94,Math.round(el/est*100))); if(el>=est) clearInterval(timerRef.current); },300);
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length>0) setTimeout(trySpeak,80);
    else window.speechSynthesis.onvoiceschanged = () => setTimeout(trySpeak,80);
  };

  const doPause  = () => { window.speechSynthesis.pause(); setStatus("paused"); clearInterval(timerRef.current); };
  const doResume = () => { window.speechSynthesis.resume(); setStatus("speaking"); };
  const doStop   = () => { window.speechSynthesis.cancel(); setStatus("idle"); setProgress(0); clearInterval(timerRef.current); };

  useEffect(() => () => { window.speechSynthesis.cancel(); clearInterval(timerRef.current); }, []);

  const waMsg  = `🎙️ *వాయిస్ రిమైండర్ — ${settings.shopName||"Shop"}*\n\n${text}\n\nUPI: ${settings.upiId||"shop@upi"}`;
  const bars   = [...Array(16)].map((_,i)=>i);
  const statusMap = { idle:"Ready to play", loading:"Loading voice engine…", speaking:"🎙️ Speaking…", paused:"⏸ Paused", done:"✅ Done", error:"❌ Not supported — use Chrome/Edge" };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center", padding:16 }}
      onClick={e => e.target===e.currentTarget && (doStop(), onClose())}>
      <motion.div initial={{ y:60 }} animate={{ y:0 }} exit={{ y:60 }}
        style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:28, padding:20, width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
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
            <p style={{ color:"#fbbf24", fontFamily:"monospace", fontSize:12, margin:0 }}>₹{fmt(c.amountDue)}</p>
          </div>
        </div>
        {/* Script preview */}
        <div style={{ background:"#0f172a", border:"1px solid #1e3a5f", borderRadius:14, padding:12, marginBottom:14 }}>
          <p style={{ color:"#64748b", fontSize:10, fontWeight:700, marginBottom:4 }}>{t.voiceMsg}</p>
          <p style={{ color:"#94a3b8", fontSize:12, lineHeight:1.7, margin:0 }}>{text}</p>
        </div>
        {/* Waveform */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:3, height:48, marginBottom:10 }}>
          {bars.map(i=>(
            <motion.div key={i} style={{ width:5, borderRadius:3, background:status==="speaking"?"#f59e0b":"#334155" }}
              animate={status==="speaking"?{height:[4,8+Math.random()*32,4]}:{height:4}}
              transition={status==="speaking"?{duration:0.35+i*0.025,repeat:Infinity,delay:i*0.04,ease:"easeInOut"}:{duration:0.15}}/>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ background:"#0f172a", borderRadius:8, height:4, marginBottom:10, overflow:"hidden" }}>
          <motion.div style={{ height:"100%", background:"#f59e0b", borderRadius:8 }} animate={{ width:`${progress}%` }} transition={{ ease:"linear", duration:0.3 }}/>
        </div>
        <p style={{ textAlign:"center", fontSize:11, marginBottom:12, fontWeight:600, color:status==="error"?"#f87171":status==="done"?"#10b981":status==="speaking"?"#34d399":"#64748b" }}>
          {statusMap[status]}
        </p>
        {!supported ? (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:14, padding:12, textAlign:"center" }}>
            <p style={{ color:"#f87171", fontSize:12, fontWeight:700, margin:"0 0 6px" }}>⛔ Browser not supported</p>
            <p style={{ color:"#94a3b8", fontSize:11, margin:0 }}>Please use Google Chrome or Microsoft Edge for voice features.</p>
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
              {(status==="idle"||status==="done"||status==="error") ? (
                <button onClick={doSpeak} style={{ background:"#f59e0b", border:"none", borderRadius:14, padding:10, color:"#1e293b", fontWeight:800, fontSize:13, cursor:"pointer" }}>▶ {t.play}</button>
              ) : status==="speaking" ? (
                <button onClick={doPause} style={{ background:"#334155", border:"none", borderRadius:14, padding:10, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>⏸ {t.pause}</button>
              ) : (
                <button onClick={doResume} style={{ background:"#f59e0b", border:"none", borderRadius:14, padding:10, color:"#1e293b", fontWeight:800, fontSize:13, cursor:"pointer" }}>▶ Resume</button>
              )}
              <button onClick={doSpeak} style={{ background:"#334155", border:"none", borderRadius:14, padding:10, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>🔄 {t.replay}</button>
              <button onClick={doStop} style={{ background:"rgba(220,38,38,0.2)", border:"1px solid rgba(220,38,38,0.4)", borderRadius:14, padding:10, color:"#f87171", fontWeight:700, fontSize:13, cursor:"pointer" }}>⏹ {t.stop}</button>
            </div>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:"#065f46", border:"none", borderRadius:14, padding:10, color:"#6ee7b7", fontSize:13, fontWeight:700, textDecoration:"none" }}>
              🟢 {t.shareWA}
            </a>
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
  const receipt = `✅ *Payment Confirmed — ${shop}*\n\nనమస్తే ${c.name} గారు 🙏\n\nమీరు *₹${fmt(c.amountDue)}* చెల్లించారు.\n${c.desc?`\n📝 ${c.desc}\n`:""}\n📅 ${new Date().toLocaleDateString("en-IN")}\n🏪 ${shop}\n💳 ${settings.upiId||"shop@upi"}\n\nధన్యవాదాలు 🙏`;
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
  const [f, setF]     = useState({ shopName:"", upiId:"", ownerPhone:"", scriptUrl:scriptUrl||"", ...settings });
  const [errs, setErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (fields) => {
    const { errors } = validateSettings(fields, t);
    setErrs(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (k) => (e) => {
    const val = e.target.value;
    // Block letters in phone field
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

  const inp = (k) => ({ ...INP(!!(errs[k] && (touched[k]||submitted))) });

  const deployOptions = [
    { name:"Render.com",  e:"🟢", desc:"BEST free alt — static + Node.js, GitHub deploy in 2 min.", url:"https://render.com" },
    { name:"Railway.app", e:"🚂", desc:"$5/mo free credit. Node + SQLite + persistent disk.", url:"https://railway.app" },
    { name:"Fly.io",      e:"🪁", desc:"3 free VMs + persistent volumes. Node + SQLite perfect.", url:"https://fly.io" },
    { name:"Vercel",      e:"▲",  desc:"Best for React frontend only.", url:"https://vercel.com" },
    { name:"Netlify",     e:"🌐", desc:"Great for static frontend. 300 free build mins/month.", url:"https://netlify.com" },
  ];

  return (
    <div style={{ padding:16, maxWidth:480, margin:"0 auto", paddingBottom:40 }}>
      <p style={{ fontWeight:800, fontSize:18, color:"#fff", marginBottom:16 }}>{t.settings}</p>

      {/* Google Sheets */}
      <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:20, padding:18, marginBottom:16 }}>
        <p style={{ color:"#fbbf24", fontWeight:800, fontSize:12, marginBottom:14 }}>☁️ Google Sheets Connection</p>
        <div style={{ marginBottom:4 }}>
          <p style={{ color: errs.scriptUrl&&(touched.scriptUrl||submitted) ? "#f87171" : "#94a3b8", fontSize:11, fontWeight:700, marginBottom:5 }}>
            {t.scriptUrl}
          </p>
          <input value={f.scriptUrl||""} onChange={handleChange("scriptUrl")} onBlur={handleBlur("scriptUrl")}
            placeholder="https://script.google.com/macros/s/…/exec" style={inp("scriptUrl")} />
          <AnimatePresence>
            {errs.scriptUrl && (touched.scriptUrl||submitted) && <FieldError msg={errs.scriptUrl} />}
          </AnimatePresence>
          <p style={{ color:"#475569", fontSize:10, marginTop:4 }}>Paste your deployed Apps Script URL here</p>
        </div>
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

  // ── Bootstrap: load from Google Sheets ────────────────────────
  useEffect(() => {
    const url = ldLS("bp_script_url", DEFAULT_SCRIPT_URL);
    if (!url || url.includes("YOUR_DEPLOYMENT_ID")) { setLoadState("ready"); return; }
    setLoadState("loading");
    apiGet(url, "all")
      .then(data => {
        if (data.customers) setCust(data.customers);
        if (data.settings)  setSettings(s => ({ ...s, ...data.settings }));
        if (data.reminders) setRem(data.reminders);
        setLoadState("ready");
      })
      .catch(() => {
        setCust(ldLS("bp_cust_cache",[]));
        setSettings(s => ({ ...s, ...ldLS("bp_sett_cache",{}) }));
        setRem(ldLS("bp_rem_cache",[]));
        setLoadState("ready");
        setSyncStatus("error");
        addToast("⚠️ Could not load from Google Drive — showing cached data", "warn");
      });
  }, []);

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

  // ── Sync helper ────────────────────────────────────────────────
  const sync = async (action, body) => {
    const url = ldLS("bp_script_url", DEFAULT_SCRIPT_URL);
    if (!url || url.includes("YOUR_DEPLOYMENT_ID")) return;
    setSyncStatus("syncing");
    try {
      await apiPost(url, { action, ...body });
      setSyncStatus("synced");
      setTimeout(() => setSyncStatus("idle"), 2500);
    } catch {
      setSyncStatus("error");
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  // ── CRUD ───────────────────────────────────────────────────────
  const saveCust = async (form) => {
    const isEdit = modal?.data?.id;
    if (isEdit) {
      const updated = { ...modal.data, ...form, amountDue: Number(form.amountDue) };
      setCust(cs => cs.map(c => c.id===isEdit ? updated : c));
      await sync("update_customer", { customer: updated });
    } else {
      const newC = { ...form, id: String(Date.now()), amountDue: Number(form.amountDue), paid:false, reminderCount:0, paidAt:"", createdAt:new Date().toISOString() };
      setCust(cs => [...cs, newC]);
      await sync("save_customer", { customer: newC });
    }
    close();
    addToast(t.t_saved);
  };

  const delCust = async (id) => {
    setCust(cs => cs.filter(c => c.id!==id));
    await sync("delete_customer", { id });
    close();
    addToast(t.t_del, "warn");
  };

  const markPaid = async (id) => {
    const paidAt = new Date().toISOString();
    setCust(cs => cs.map(c => c.id===id ? { ...c, paid:true, paidAt } : c));
    await sync("mark_paid", { id, paidAt });
    const c = customers.find(x => x.id===id);
    if (c) setModal({ type:"paid", data: { ...c, paid:true, paidAt } });
    addToast(t.t_paid);
  };

  const undoPaid = async (id) => {
    setCust(cs => cs.map(c => c.id===id ? { ...c, paid:false, paidAt:"" } : c));
    await sync("undo_paid", { id });
    close();
  };

  const sendWA = async (c) => {
    const msg   = buildWAMsg(c, settings, lang, c.reminderCount||0);
    const phone = c.phone.replace(/\D/g,"");
    if (phone.length < 10) { addToast("⛔ Invalid phone number — cannot send WhatsApp", "error"); return; }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    const newCount = (c.reminderCount||0) + 1;
    setCust(cs => cs.map(x => x.id===c.id ? { ...x, reminderCount: newCount } : x));
    await sync("increment_reminder", { id: c.id });
    const rem = { name:c.name, amount:c.amountDue, type:"whatsapp", at:new Date().toISOString() };
    setRem(rs => [rem, ...rs]);
    await sync("log_reminder", { reminder: rem });
    addToast(t.t_wa);
  };

  const logRem = async (c, type) => {
    const rem = { name:c.name, amount:c.amountDue, type, at:new Date().toISOString() };
    setRem(rs => [rem, ...rs]);
    await sync("log_reminder", { reminder: rem });
  };

  const saveSettingsFn = async (form) => {
    const { scriptUrl: newUrl, ...rest } = form;
    setSettings(rest);
    if (newUrl) { setScriptUrl(newUrl); svLS("bp_script_url", newUrl); }
    const url = newUrl || ldLS("bp_script_url", DEFAULT_SCRIPT_URL);
    if (url && !url.includes("YOUR_DEPLOYMENT_ID")) {
      setSyncStatus("syncing");
      try {
        await apiPost(url, { action:"save_settings", settings: rest });
        setSyncStatus("synced");
        setTimeout(() => setSyncStatus("idle"), 2500);
      } catch { setSyncStatus("error"); }
    }
    addToast("✅ " + t.saveSettings);
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
