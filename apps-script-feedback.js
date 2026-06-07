/* =============================================================================
   GOOGLE APPS SCRIPT — Feedback Form Backend
   FILE: apps-script-feedback.js
   
   HOW TO DEPLOY (one-time, 5 minutes):
   ──────────────────────────────────────────────────────────────────────────
   1. Go to https://script.google.com → New Project
   2. Paste THIS ENTIRE FILE into the editor
   3. Replace SHEET_ID below with your Google Sheet ID
      (from the sheet URL: docs.google.com/spreadsheets/d/SHEET_ID/edit)
   4. Click Deploy → New Deployment → Web App
      - Execute as: Me
      - Who has access: Anyone (anonymous)
   5. Copy the Web App URL — paste it into theme.js FEEDBACK_SCRIPT_URL
   6. Done! Every submission writes a row to your sheet.
   ──────────────────────────────────────────────────────────────────────────
   
   THIS FILE IS NOT PART OF THE MAIN BUNDLE.
   Do NOT include in minification/obfuscation — it runs on Google servers, not browser.
   =============================================================================*/

/* ── Your Google Sheet ID — replace this ── */
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";

/* ── Column headers written on first row ── */
const HEADERS = ["Timestamp", "Name", "School", "Rating", "Type", "Message", "UserAgent"];

/* =============================================================================
   doPost(e) — receives feedback form submissions
   Runs on Google's servers when the Web App URL receives a POST request.
=============================================================================*/
function doPost(e) {
    try {
        const data   = JSON.parse(e.postData.contents);
        const sheet  = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

        /* Write header row if sheet is empty */
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(HEADERS);
            sheet.getRange(1, 1, 1, HEADERS.length)
                 .setFontWeight("bold")
                 .setBackground("#b4c7e7");
        }

        /* Append feedback row */
        sheet.appendRow([
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            data.name    || "Anonymous",
            data.school  || "Not provided",
            data.rating  || "Not rated",
            data.type    || "Other",
            data.message || "",
            data.ua      || ""
        ]);

        /* Send email notification to you */
        MailApp.sendEmail({
            to:      "brijeshdavid.socials@gmail.com",
            subject: `[Register Suite v4] New feedback — ${data.type || "General"} from ${data.name || "Anonymous"}`,
            body:    `Name:    ${data.name || "Anonymous"}
School:  ${data.school || "Not provided"}
Rating:  ${data.rating || "Not rated"}
Type:    ${data.type || "Other"}

Message:
${data.message || "(empty)"}

Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
Browser: ${data.ua || "unknown"}`
        });

        return ContentService
            .createTextOutput(JSON.stringify({ status: "ok" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/* doGet — simple health check so you can verify the URL works */
function doGet(e) {
    return ContentService
        .createTextOutput("Register Suite v4 — Feedback endpoint is live.")
        .setMimeType(ContentService.MimeType.TEXT);
}
