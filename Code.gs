// ═══════════════════════════════════════════════════════════════
//  BANDHAN PAY — Google Apps Script Backend
//  Paste this entire file into script.google.com
//  Then: Deploy → New Deployment → Web App → Anyone → Deploy
// ═══════════════════════════════════════════════════════════════

// ── CONFIG ───────────────────────────────────────────────────────
// After running setup() once, this ID will be auto-saved.
// You can also paste your Sheet ID here manually if you want.
var SHEET_ID_KEY = "BANDHANPAY_SHEET_ID";
var SHEET_NAME   = "Customers";
var SETTINGS_SHEET = "Settings";
var REMINDERS_SHEET = "Reminders";

// ── CORS HEADERS (allow any origin so your deployed site can call this) ──
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── SETUP: Run this ONCE manually to create the Sheet ────────────
function setup() {
  var ss = SpreadsheetApp.create("BandhanPay - Customer Data");
  var id = ss.getId();
  PropertiesService.getScriptProperties().setProperty(SHEET_ID_KEY, id);

  // Customers sheet
  var custSheet = ss.getSheets()[0];
  custSheet.setName(SHEET_NAME);
  custSheet.appendRow([
    "id","name","phone","amountDue","dueDate",
    "desc","notes","paid","paidAt","reminderCount","createdAt"
  ]);
  custSheet.setFrozenRows(1);
  custSheet.getRange(1,1,1,11).setFontWeight("bold").setBackground("#f59e0b");

  // Settings sheet
  var settSheet = ss.insertSheet(SETTINGS_SHEET);
  settSheet.appendRow(["key","value"]);
  settSheet.appendRow(["shopName","మా షాప్"]);
  settSheet.appendRow(["upiId","shop@upi"]);
  settSheet.appendRow(["ownerPhone",""]);
  settSheet.appendRow(["lang","te"]);

  // Reminders sheet
  var remSheet = ss.insertSheet(REMINDERS_SHEET);
  remSheet.appendRow(["name","amount","type","at"]);

  Logger.log("✅ Sheet created! ID: " + id);
  Logger.log("Sheet URL: " + ss.getUrl());
  Logger.log("Now deploy as Web App.");
}

// ── GET SHEET ─────────────────────────────────────────────────────
function getSpreadsheet() {
  var id = PropertiesService.getScriptProperties().getProperty(SHEET_ID_KEY);
  if (!id) throw new Error("Run setup() first!");
  return SpreadsheetApp.openById(id);
}

// ── doGet: Read all data ──────────────────────────────────────────
function doGet(e) {
  try {
    var action = e.parameter.action || "all";
    var ss = getSpreadsheet();

    if (action === "customers") {
      return jsonResponse({ ok: true, data: getCustomers(ss) });
    }
    if (action === "settings") {
      return jsonResponse({ ok: true, data: getSettings(ss) });
    }
    if (action === "reminders") {
      return jsonResponse({ ok: true, data: getReminders(ss) });
    }
    // Default: return everything
    return jsonResponse({
      ok: true,
      customers: getCustomers(ss),
      settings: getSettings(ss),
      reminders: getReminders(ss)
    });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── doPost: Write data ────────────────────────────────────────────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var ss = getSpreadsheet();

    if (action === "save_customer")   return jsonResponse(saveCustomer(ss, body.customer));
    if (action === "update_customer") return jsonResponse(updateCustomer(ss, body.customer));
    if (action === "delete_customer") return jsonResponse(deleteCustomer(ss, body.id));
    if (action === "mark_paid")       return jsonResponse(markPaid(ss, body.id, body.paidAt));
    if (action === "undo_paid")       return jsonResponse(undoPaid(ss, body.id));
    if (action === "increment_reminder") return jsonResponse(incrementReminder(ss, body.id));
    if (action === "save_settings")   return jsonResponse(saveSettings(ss, body.settings));
    if (action === "log_reminder")    return jsonResponse(logReminder(ss, body.reminder));

    return jsonResponse({ ok: false, error: "Unknown action: " + action });
  } catch(err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ── CUSTOMERS ─────────────────────────────────────────────────────
function getCustomers(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    // Convert booleans
    obj.paid = obj.paid === true || obj.paid === "TRUE" || obj.paid === "true";
    obj.amountDue = Number(obj.amountDue) || 0;
    obj.reminderCount = Number(obj.reminderCount) || 0;
    return obj;
  });
}

function saveCustomer(ss, customer) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var id = customer.id || String(Date.now());
  sheet.appendRow([
    id,
    customer.name || "",
    customer.phone || "",
    Number(customer.amountDue) || 0,
    customer.dueDate || "",
    customer.desc || "",
    customer.notes || "",
    false,
    "",
    0,
    customer.createdAt || new Date().toISOString()
  ]);
  return { ok: true, id: id };
}

function findRow(sheet, id) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return i + 1; // 1-indexed
  }
  return -1;
}

function updateCustomer(ss, customer) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, customer.id);
  if (row === -1) return { ok: false, error: "Customer not found" };
  sheet.getRange(row, 1, 1, 11).setValues([[
    customer.id,
    customer.name || "",
    customer.phone || "",
    Number(customer.amountDue) || 0,
    customer.dueDate || "",
    customer.desc || "",
    customer.notes || "",
    customer.paid || false,
    customer.paidAt || "",
    Number(customer.reminderCount) || 0,
    customer.createdAt || ""
  ]]);
  return { ok: true };
}

function deleteCustomer(ss, id) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok: false, error: "Not found" };
  sheet.deleteRow(row);
  return { ok: true };
}

function markPaid(ss, id, paidAt) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok: false, error: "Not found" };
  sheet.getRange(row, 8).setValue(true);
  sheet.getRange(row, 9).setValue(paidAt || new Date().toISOString());
  return { ok: true };
}

function undoPaid(ss, id) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok: false, error: "Not found" };
  sheet.getRange(row, 8).setValue(false);
  sheet.getRange(row, 9).setValue("");
  return { ok: true };
}

function incrementReminder(ss, id) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = findRow(sheet, id);
  if (row === -1) return { ok: false, error: "Not found" };
  var current = Number(sheet.getRange(row, 10).getValue()) || 0;
  sheet.getRange(row, 10).setValue(current + 1);
  return { ok: true, count: current + 1 };
}

// ── SETTINGS ──────────────────────────────────────────────────────
function getSettings(ss) {
  var sheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!sheet) return {};
  var rows = sheet.getDataRange().getValues().slice(1);
  var obj = {};
  rows.forEach(function(r) { obj[r[0]] = r[1]; });
  return obj;
}

function saveSettings(ss, settings) {
  var sheet = ss.getSheetByName(SETTINGS_SHEET);
  var keys = Object.keys(settings);
  keys.forEach(function(key) {
    var rows = sheet.getDataRange().getValues();
    var found = false;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(settings[key]);
        found = true;
        break;
      }
    }
    if (!found) sheet.appendRow([key, settings[key]]);
  });
  return { ok: true };
}

// ── REMINDERS ─────────────────────────────────────────────────────
function getReminders(ss) {
  var sheet = ss.getSheetByName(REMINDERS_SHEET);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  }).reverse(); // newest first
}

function logReminder(ss, reminder) {
  var sheet = ss.getSheetByName(REMINDERS_SHEET);
  sheet.appendRow([
    reminder.name || "",
    Number(reminder.amount) || 0,
    reminder.type || "whatsapp",
    reminder.at || new Date().toISOString()
  ]);
  return { ok: true };
}
