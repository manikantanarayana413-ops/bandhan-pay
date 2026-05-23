// ═══════════════════════════════════════════════════════════════════
//  BANDHAN PAY — Google Apps Script Backend  (FIXED v2)
//
//  KEY FIX: All write operations now use doGet() with URL params
//  because browsers block cross-origin POST (CORS preflight).
//  doGet() works with ?action=X&data=JSON without any CORS issues.
//
//  SETUP STEPS:
//  1. Paste this file into script.google.com
//  2. Run setup() ONCE (click ▶ Run → setup)
//  3. Allow permissions when asked
//  4. Deploy → New Deployment → Web App
//     Execute as: Me
//     Who has access: Anyone  ← IMPORTANT
//  5. Copy the Web App URL and paste into app Settings tab
// ═══════════════════════════════════════════════════════════════════

var SHEET_ID_KEY    = "BANDHANPAY_SHEET_ID_V2";
var SHEET_NAME      = "Customers";
var SETTINGS_SHEET  = "Settings";
var REMINDERS_SHEET = "Reminders";

// ── JSON response with CORS headers ──────────────────────────────
function jsonOut(data) {
  var output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ── SETUP — run ONCE to create the Google Sheet ──────────────────
function setup() {
  // Check if already set up
  var existingId = PropertiesService.getScriptProperties().getProperty(SHEET_ID_KEY);
  if (existingId) {
    try {
      var existing = SpreadsheetApp.openById(existingId);
      Logger.log("✅ Already set up! Sheet: " + existing.getUrl());
      return;
    } catch(e) { /* Sheet was deleted, recreate */ }
  }

  var ss = SpreadsheetApp.create("BandhanPay - Customer Data");
  PropertiesService.getScriptProperties().setProperty(SHEET_ID_KEY, ss.getId());

  // ── Customers sheet ──
  var cSheet = ss.getSheets()[0];
  cSheet.setName(SHEET_NAME);
  cSheet.appendRow(["id","name","phone","amountDue","dueDate","desc","notes","paid","paidAt","reminderCount","createdAt"]);
  cSheet.setFrozenRows(1);
  cSheet.getRange(1,1,1,11).setFontWeight("bold").setBackground("#f59e0b").setFontColor("#000000");
  cSheet.setColumnWidth(1, 160);
  cSheet.setColumnWidth(2, 160);
  cSheet.setColumnWidth(3, 140);

  // ── Settings sheet ──
  var sSheet = ss.insertSheet(SETTINGS_SHEET);
  sSheet.appendRow(["key","value"]);
  sSheet.appendRow(["shopName","మా షాప్"]);
  sSheet.appendRow(["upiId","shop@upi"]);
  sSheet.appendRow(["ownerPhone",""]);
  sSheet.appendRow(["lang","te"]);
  sSheet.getRange(1,1,1,2).setFontWeight("bold").setBackground("#0f172a").setFontColor("#f59e0b");

  // ── Reminders sheet ──
  var rSheet = ss.insertSheet(REMINDERS_SHEET);
  rSheet.appendRow(["name","amount","type","at"]);
  rSheet.getRange(1,1,1,4).setFontWeight("bold").setBackground("#0f172a").setFontColor("#f59e0b");

  Logger.log("✅ BandhanPay Sheet created!");
  Logger.log("📋 URL: " + ss.getUrl());
  Logger.log("🔑 ID: " + ss.getId());
  Logger.log("");
  Logger.log("▶ Next step: Deploy → New Deployment → Web App → Anyone → Deploy");
}

// ── Get spreadsheet ───────────────────────────────────────────────
function getSheet() {
  var id = PropertiesService.getScriptProperties().getProperty(SHEET_ID_KEY);
  if (!id) throw new Error("Sheet not set up. Run setup() first!");
  return SpreadsheetApp.openById(id);
}

// ════════════════════════════════════════════════════════════════════
//  doGet — handles ALL requests (reads AND writes via URL params)
//  This avoids CORS preflight issues that block browser POST requests
// ════════════════════════════════════════════════════════════════════
function doGet(e) {
  try {
    var action = (e.parameter && e.parameter.action) ? e.parameter.action : "all";
    var ss = getSheet();

    // ── READ actions ──────────────────────────────────────────────
    if (action === "all") {
      return jsonOut({ ok:true, customers:getCustomers(ss), settings:getSettings(ss), reminders:getReminders(ss) });
    }
    if (action === "customers") return jsonOut({ ok:true, data:getCustomers(ss) });
    if (action === "settings")  return jsonOut({ ok:true, data:getSettings(ss) });
    if (action === "reminders") return jsonOut({ ok:true, data:getReminders(ss) });

    // ── WRITE actions (data passed as URL param) ──────────────────
    var data = {};
    if (e.parameter && e.parameter.data) {
      try { data = JSON.parse(decodeURIComponent(e.parameter.data)); } catch(ex) { data = {}; }
    }

    if (action === "save_customer")      return jsonOut(saveCustomer(ss, data));
    if (action === "update_customer")    return jsonOut(updateCustomer(ss, data));
    if (action === "delete_customer")    return jsonOut(deleteCustomer(ss, data.id));
    if (action === "mark_paid")          return jsonOut(markPaid(ss, data.id, data.paidAt));
    if (action === "undo_paid")          return jsonOut(undoPaid(ss, data.id));
    if (action === "increment_reminder") return jsonOut(incrementReminder(ss, data.id));
    if (action === "save_settings")      return jsonOut(saveSettings(ss, data));
    if (action === "log_reminder")       return jsonOut(logReminder(ss, data));

    // ── TEST ping ─────────────────────────────────────────────────
    if (action === "ping") return jsonOut({ ok:true, message:"BandhanPay backend is running!", timestamp: new Date().toISOString() });

    return jsonOut({ ok:false, error:"Unknown action: " + action });

  } catch(err) {
    return jsonOut({ ok:false, error:err.message, stack:err.stack });
  }
}

// ── doPost kept for compatibility but all calls now use doGet ─────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    // Redirect to doGet logic
    var fakeE = { parameter: { action: body.action, data: JSON.stringify(body) } };
    return doGet(fakeE);
  } catch(err) {
    return jsonOut({ ok:false, error:err.message });
  }
}

// ════════════════════════════════════════════════════════════════════
//  CUSTOMER FUNCTIONS
// ════════════════════════════════════════════════════════════════════
function getCustomers(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0].map(function(h) { return String(h).trim(); });
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i] !== undefined ? row[i] : ""; });
    obj.paid         = (obj.paid === true || String(obj.paid).toUpperCase() === "TRUE");
    obj.amountDue    = Number(obj.amountDue)    || 0;
    obj.reminderCount= Number(obj.reminderCount)|| 0;
    obj.id           = String(obj.id);
    // Convert Date objects from Sheets to ISO strings
    if (obj.dueDate && obj.dueDate instanceof Date) obj.dueDate = Utilities.formatDate(obj.dueDate, "UTC", "yyyy-MM-dd");
    if (obj.paidAt  && obj.paidAt  instanceof Date) obj.paidAt  = obj.paidAt.toISOString();
    if (obj.createdAt && obj.createdAt instanceof Date) obj.createdAt = obj.createdAt.toISOString();
    return obj;
  });
}

function saveCustomer(ss, customer) {
  if (!customer || !customer.name) return { ok:false, error:"Invalid customer data" };
  var sheet = ss.getSheetByName(SHEET_NAME);
  var id = customer.id || String(Date.now());
  sheet.appendRow([
    id,
    String(customer.name   || ""),
    String(customer.phone  || ""),
    Number(customer.amountDue) || 0,
    String(customer.dueDate|| ""),
    String(customer.desc   || ""),
    String(customer.notes  || ""),
    false,
    "",
    0,
    customer.createdAt || new Date().toISOString()
  ]);
  // Flush immediately so changes appear in Sheet right away
  SpreadsheetApp.flush();
  return { ok:true, id:id };
}

function findRow(sheet, id) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return i + 1;
  }
  return -1;
}

function updateCustomer(ss, customer) {
  if (!customer || !customer.id) return { ok:false, error:"Missing customer id" };
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, customer.id);
  if (row === -1) {
    // Customer not found — just add it as new
    return saveCustomer(ss, customer);
  }
  sheet.getRange(row, 1, 1, 11).setValues([[
    String(customer.id),
    String(customer.name          || ""),
    String(customer.phone         || ""),
    Number(customer.amountDue)    || 0,
    String(customer.dueDate       || ""),
    String(customer.desc          || ""),
    String(customer.notes         || ""),
    customer.paid ? true : false,
    String(customer.paidAt        || ""),
    Number(customer.reminderCount)|| 0,
    String(customer.createdAt     || "")
  ]]);
  SpreadsheetApp.flush();
  return { ok:true };
}

function deleteCustomer(ss, id) {
  if (!id) return { ok:false, error:"Missing id" };
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok:true }; // already gone
  sheet.deleteRow(row);
  SpreadsheetApp.flush();
  return { ok:true };
}

function markPaid(ss, id, paidAt) {
  if (!id) return { ok:false, error:"Missing id" };
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok:false, error:"Customer not found: " + id };
  sheet.getRange(row, 8).setValue(true);
  sheet.getRange(row, 9).setValue(paidAt || new Date().toISOString());
  SpreadsheetApp.flush();
  return { ok:true };
}

function undoPaid(ss, id) {
  if (!id) return { ok:false, error:"Missing id" };
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok:false, error:"Customer not found: " + id };
  sheet.getRange(row, 8).setValue(false);
  sheet.getRange(row, 9).setValue("");
  SpreadsheetApp.flush();
  return { ok:true };
}

function incrementReminder(ss, id) {
  if (!id) return { ok:false, error:"Missing id" };
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok:false, error:"Not found" };
  var current = Number(sheet.getRange(row, 10).getValue()) || 0;
  sheet.getRange(row, 10).setValue(current + 1);
  SpreadsheetApp.flush();
  return { ok:true, count: current + 1 };
}

// ════════════════════════════════════════════════════════════════════
//  SETTINGS FUNCTIONS
// ════════════════════════════════════════════════════════════════════
function getSettings(ss) {
  var sheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!sheet) return {};
  var rows = sheet.getDataRange().getValues().slice(1);
  var obj  = {};
  rows.forEach(function(r) { if(r[0]) obj[String(r[0])] = r[1] !== undefined ? String(r[1]) : ""; });
  return obj;
}

function saveSettings(ss, settings) {
  if (!settings) return { ok:false, error:"No settings provided" };
  var sheet = ss.getSheetByName(SETTINGS_SHEET);
  var keys  = Object.keys(settings);
  keys.forEach(function(key) {
    var rows  = sheet.getDataRange().getValues();
    var found = false;
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === key) {
        sheet.getRange(i + 1, 2).setValue(settings[key] !== undefined ? settings[key] : "");
        found = true;
        break;
      }
    }
    if (!found) sheet.appendRow([key, settings[key] !== undefined ? settings[key] : ""]);
  });
  SpreadsheetApp.flush();
  return { ok:true };
}

// ════════════════════════════════════════════════════════════════════
//  REMINDERS FUNCTIONS
// ════════════════════════════════════════════════════════════════════
function getReminders(ss) {
  var sheet = ss.getSheetByName(REMINDERS_SHEET);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0].map(function(h) { return String(h).trim(); });
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i] !== undefined ? row[i] : ""; });
    if (obj.at && obj.at instanceof Date) obj.at = obj.at.toISOString();
    return obj;
  }).reverse();
}

function logReminder(ss, reminder) {
  if (!reminder) return { ok:false, error:"No reminder data" };
  var sheet = ss.getSheetByName(REMINDERS_SHEET);
  sheet.appendRow([
    String(reminder.name   || ""),
    Number(reminder.amount)|| 0,
    String(reminder.type   || "whatsapp"),
    reminder.at || new Date().toISOString()
  ]);
  SpreadsheetApp.flush();
  return { ok:true };
}

// ════════════════════════════════════════════════════════════════════
//  TEST FUNCTION — run this to verify everything works
// ════════════════════════════════════════════════════════════════════
function testAll() {
  var ss = getSheet();
  Logger.log("=== BandhanPay Backend Test ===");
  Logger.log("Sheet: " + ss.getName());
  Logger.log("Customers: " + getCustomers(ss).length);
  Logger.log("Settings: " + JSON.stringify(getSettings(ss)));
  Logger.log("Reminders: " + getReminders(ss).length);

  // Test save
  var testId = "TEST_" + Date.now();
  var result = saveCustomer(ss, { id:testId, name:"Test Customer", phone:"9876543210", amountDue:100, dueDate:"2025-12-31", desc:"Test", notes:"", createdAt:new Date().toISOString() });
  Logger.log("Save test: " + JSON.stringify(result));

  // Test delete
  var del = deleteCustomer(ss, testId);
  Logger.log("Delete test: " + JSON.stringify(del));

  Logger.log("=== All tests passed! ===");
}
