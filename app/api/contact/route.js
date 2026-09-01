import nodemailer from "nodemailer";
import { generateReferenceWithTime } from "@/utilities/masterData";

function escHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const row = (label, value) => `
  <tr>
    <td width="38%" valign="top" style="padding:11px 0;border-bottom:1px solid #f3f4f6;font-size:12px;line-height:18px;color:#6b7280;font-weight:500;">${label}</td>
    <td valign="top" style="padding:11px 0 11px 18px;border-bottom:1px solid #f3f4f6;font-size:13px;line-height:19px;color:#111827;font-weight:600;word-break:break-word;">${value}</td>
  </tr>
`;

function buildAdminHtml({ reference, name, company, email, phone, subject, department, message }) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>New Contact: ${escHtml(reference)}</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0ea5e9,#0284c7);padding:32px;text-align:center;">
  <div style="font-size:22px;font-weight:800;color:#fff;">MahaveerTrans</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">New Contact Message</div>
  <div style="display:inline-block;margin-top:14px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.35);border-radius:8px;padding:6px 16px;font-size:12px;color:#fff;font-weight:600;">Ref: ${escHtml(reference)}</div>
</td></tr>
<tr><td style="padding:22px 32px 4px;">
  <div style="font-size:15px;font-weight:700;color:#111827;margin-bottom:10px;">Contact Details</div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #f3f4f6;">
    ${row("Full Name", escHtml(name))}
    ${row("Company", escHtml(company) || "—")}
    ${row("Email", escHtml(email))}
    ${row("Phone", escHtml(phone) || "—")}
    ${row("Subject", escHtml(subject))}
    ${row("Department", escHtml(department))}
  </table>
</td></tr>
<tr><td style="padding:22px 32px 4px;">
  <div style="font-size:15px;font-weight:700;color:#111827;margin-bottom:10px;">Message</div>
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px 18px;font-size:13px;line-height:20px;color:#374151;white-space:pre-wrap;">${escHtml(message)}</div>
</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #f3f4f6;text-align:center;">
  <div style="font-size:11px;color:#9ca3af;">Submitted via MahaveerTrans website contact form.</div>
</td></tr>
</table></td></tr></table></body></html>`;
}

function buildAutoReplyHtml({ reference, name }) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>We received your message</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0ea5e9,#0284c7);padding:32px;text-align:center;">
  <div style="font-size:22px;font-weight:800;color:#fff;">MahaveerTrans</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">Message Received ✓</div>
</td></tr>
<tr><td style="padding:32px;">
  <p style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Hi ${escHtml(name)},</p>
  <p style="font-size:14px;line-height:22px;color:#374151;margin:0 0 16px;">Thank you for reaching out to <strong>MahaveerTrans</strong>. We&rsquo;ve received your message and our team will get back to you within <strong>1 business hour</strong>.</p>
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
    <div style="font-size:12px;color:#0284c7;font-weight:600;margin-bottom:4px;">YOUR REFERENCE</div>
    <div style="font-size:18px;font-weight:800;color:#0ea5e9;letter-spacing:0.5px;">${escHtml(reference)}</div>
  </div>
  <p style="font-size:13px;line-height:20px;color:#6b7280;margin:0;">For urgent assistance call us at <a href="tel:+917039529129" style="color:#0ea5e9;font-weight:600;">+91 70395 29129</a>.</p>
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #f3f4f6;text-align:center;">
  <div style="font-size:11px;color:#9ca3af;">© 2025 MahaveerTrans Logistics Pvt. Ltd. All rights reserved.</div>
</td></tr>
</table></td></tr></table></body></html>`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, company, email, phone, subject, department, message } = body;

    const errs = [];
    if (!name?.trim()) errs.push("name");
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push("email");
    if (!subject?.trim()) errs.push("subject");
    if (!message?.trim()) errs.push("message");

    if (errs.length) {
      return Response.json({ ok: false, error: `Missing or invalid fields: ${errs.join(", ")}` }, { status: 400 });
    }

    const reference = generateReferenceWithTime();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"MahaveerTrans Website" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `[Contact] ${subject} — ${reference}`,
      html: buildAdminHtml({ reference, name, company, email, phone, subject, department, message }),
    });

    await transporter.sendMail({
      from: `"MahaveerTrans" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We received your message — ${reference}`,
      html: buildAutoReplyHtml({ reference, name }),
    });

    return Response.json({ ok: true, reference });
  } catch (err) {
    console.error("[/api/contact]", err);
    return Response.json({ ok: false, error: "Server error — please try again." }, { status: 500 });
  }
}
