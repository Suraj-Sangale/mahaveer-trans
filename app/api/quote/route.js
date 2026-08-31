import nodemailer from "nodemailer";
import { generateReferenceWithTime } from "@/utilities/masterData";

// ── helpers ──────────────────────────────────────────────────────────────────

const row = (label, value) => `
  <tr>
    <td
      width="38%"
      valign="top"
      style="
        padding:11px 0;
        border-bottom:1px solid #f3f4f6;
        font-size:12px;
        line-height:18px;
        color:#6b7280;
        font-weight:500;
      "
    >
      ${label}
    </td>

    <td
      valign="top"
      style="
        padding:11px 0 11px 18px;
        border-bottom:1px solid #f3f4f6;
        font-size:13px;
        line-height:19px;
        color:#111827;
        font-weight:600;
        word-break:break-word;
      "
    >
      ${value}
    </td>
  </tr>
`;

const section = (title, content) => `
  <tr>
    <td style="padding:22px 32px 4px;">

      <div style="
        margin:0 0 10px 0;
        font-size:15px;
        line-height:21px;
        font-weight:700;
        color:#111827;
      ">
        ${title}
      </div>

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        role="presentation"
        style="
          width:100%;
          border-collapse:collapse;
          border-top:1px solid #e5e7eb;
        "
      >
        ${content}
      </table>

    </td>
  </tr>
`;



function buildHtml(data, reference) {
  const {
    selectedSvc,
    commodity, hscode, weight, volume, pieces, packaging, cargoValue, specialHandling,
    origin, destination, pickupType, deliveryType, incoterm, readyDate, frequency,
    selectedAddons,
    cName, cCompany, cEmail, cPhone, cNotes,
    estimate,
  } = data;

  const specialText =
    Array.isArray(specialHandling) && specialHandling.length
      ? specialHandling.join(", ")
      : "None";

  const addonsText =
    Array.isArray(selectedAddons) && selectedAddons.length
      ? selectedAddons.join(", ")
      : "None";
      function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function formatINR(value) {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return '&#8377; ' + num.toLocaleString('en-IN');
}
  const mailtoHref = encodeURI(`mailto:${cEmail || ''}`);
const safeEmail = escapeHtml(cEmail);
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Quote Request</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f3f4f6;
  font-family:Arial,'Segoe UI',sans-serif;
  color:#111827;
  -webkit-text-size-adjust:100%;
  -ms-text-size-adjust:100%;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    role="presentation"
    style="
      width:100%;
      margin:0;
      padding:0;
      background-color:#f3f4f6;
      border-collapse:collapse;
    "
  >
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Main Container -->
        <table
          width="650"
          cellpadding="0"
          cellspacing="0"
          border="0"
          role="presentation"
          style="
            width:100%;
            max-width:650px;
            background-color:#ffffff;
            border-collapse:separate;
            border-spacing:0;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(17,24,39,0.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                padding:28px 32px;
                background-color:#5b21b6;
                background-image:linear-gradient(135deg,#2563eb 0%,#818cf8 100%);
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="border-collapse:collapse;"
              >
                <tr>
                  <td valign="middle">
                    <div style="
                      font-size:22px;
                      line-height:28px;
                      font-weight:700;
                      color:#ffffff;
                      margin:0;
                    ">
                      &#128674; New Quote Request
                    </div>

                    <div style="
                      font-size:13px;
                      line-height:20px;
                      color:#e9d5ff;
                      margin-top:6px;
                    ">
                      A new quotation request has been submitted.
                    </div>
                  </td>

                  <td
                    align="right"
                    valign="middle"
                    style="padding-left:20px;"
                  >
                    <div style="
                      font-size:10px;
                      line-height:14px;
                      letter-spacing:1px;
                      color:#ddd6fe;
                      font-weight:600;
                    ">
                      REFERENCE
                    </div>

                    <div style="
                      margin-top:4px;
                      font-size:15px;
                      line-height:20px;
                      font-weight:700;
                      color:#ffffff;
                      white-space:nowrap;
                    ">
                      ${escapeHtml(reference)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px 32px 8px;">

              <!-- Route Summary -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  width:100%;
                  border-collapse:separate;
                  border-spacing:0;
                  background-color:#f5f3ff;
                  border:1px solid #e9d5ff;
                  border-radius:12px;
                "
              >
                <tr>
                  <td width="45%" valign="middle" style="padding:18px 20px;">
                    <div style="
                      font-size:10px;
                      line-height:14px;
                      letter-spacing:.8px;
                      text-transform:uppercase;
                      color:#7c3aed;
                      font-weight:700;
                    ">
                      Origin
                    </div>

                    <div style="
                      margin-top:5px;
                      font-size:16px;
                      line-height:22px;
                      font-weight:700;
                      color:#111827;
                    ">
                      ${escapeHtml(origin)}
                    </div>
                  </td>

                  <td
                    width="10%"
                    align="center"
                    valign="middle"
                    style="
                      font-size:22px;
                      color:#7c3aed;
                      font-weight:700;
                    "
                  >
                    &#8594;
                  </td>

                  <td width="45%" valign="middle" style="padding:18px 20px;">
                    <div style="
                      font-size:10px;
                      line-height:14px;
                      letter-spacing:.8px;
                      text-transform:uppercase;
                      color:#2563eb;
                      font-weight:700;
                    ">
                      Destination
                    </div>

                    <div style="
                      margin-top:5px;
                      font-size:16px;
                      line-height:22px;
                      font-weight:700;
                      color:#111827;
                    ">
                      ${escapeHtml(destination)}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${section(
            '&#128666; Service Information',
            [
              row('Service type', escapeHtml(selectedSvc)),
              row('Pickup type', escapeHtml(pickupType)),
              row('Delivery type', escapeHtml(deliveryType)),
              row('Incoterm', escapeHtml(incoterm)),
              row('Ready date', escapeHtml(readyDate)),
              row('Frequency', escapeHtml(frequency || 'One-time')),
            ].join('')
          )}

          ${section(
            '&#128230; Cargo Details',
            [
              row('Commodity', escapeHtml(commodity)),
              row('HS Code', escapeHtml(hscode || 'Not provided')),
              row('Weight', weight ? `${escapeHtml(weight)} kg` : '—'),
              row('Volume', volume ? `${escapeHtml(volume)} CBM` : '—'),
              row('Pieces', escapeHtml(pieces || '—')),
              row('Packaging', escapeHtml(packaging || '—')),
              row('Cargo value', formatINR(cargoValue)),
              row('Special handling', escapeHtml(specialText || 'None')),
            ].join('')
          )}

          ${section(
            '&#9881;&#65039; Additional Services',
            row(
              'Selected add-ons',
              escapeHtml(addonsText || 'None')
            )
          )}

          <!-- Estimate -->
          <tr>
            <td style="padding:14px 32px 6px;">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  width:100%;
                  border-collapse:separate;
                  border-spacing:0;
                  background-color:#eff6ff;
                  border:1px solid #bfdbfe;
                  border-radius:12px;
                "
              >
                <tr>
                  <td style="padding:20px 22px;">
                    <div style="
                      font-size:10px;
                      line-height:14px;
                      letter-spacing:.8px;
                      text-transform:uppercase;
                      color:#2563eb;
                      font-weight:700;
                    ">
                      Live Estimate
                    </div>

                    <div style="
                      margin-top:5px;
                      font-size:26px;
                      line-height:32px;
                      font-weight:800;
                      color:#111827;
                    ">
                      ${formatINR(estimate)}
                    </div>

                    <div style="
                      margin-top:4px;
                      font-size:11px;
                      line-height:16px;
                      color:#6b7280;
                    ">
                      Indicative estimate based on the submitted details.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${section(
            '&#128100; Contact Information',
            [
              row('Full name', escapeHtml(cName)),
              row('Company', escapeHtml(cCompany || '—')),
              row(
                'Email',
                `<a
                  href="${mailtoHref}"
                  style="
                    color:#6d28d9;
                    text-decoration:none;
                    font-weight:600;
                  "
                >
                  ${safeEmail}
                </a>`
              ),
              row('Phone / WhatsApp', escapeHtml(cPhone)),
              row('Notes', escapeHtml(cNotes || '—')),
            ].join('')
          )}

          <!-- CTA -->
          <tr>
            <td style="padding:18px 32px 28px;">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  width:100%;
                  background-color:#f9fafb;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  border-collapse:separate;
                  border-spacing:0;
                "
              >
                <tr>
                  <td style="padding:20px 22px;">

                    <div style="
                      font-size:14px;
                      line-height:20px;
                      font-weight:700;
                      color:#111827;
                    ">
                      &#128233; Follow-up Required
                    </div>

                    <div style="
                      margin-top:6px;
                      font-size:13px;
                      line-height:20px;
                      color:#6b7280;
                    ">
                      Please review this request and contact the customer
                      for quotation details and further discussion.
                    </div>

                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      role="presentation"
                      style="margin-top:16px;"
                    >
                      <tr>
                        <td
                          align="center"
                          bgcolor="#6d28d9"
                          style="
                            border-radius:8px;
                            background-color:#6d28d9;
                          "
                        >
                          <a
                            href="${mailtoHref}"
                            style="
                              display:inline-block;
                              padding:11px 20px;
                              font-size:13px;
                              line-height:18px;
                              font-weight:700;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:8px;
                            "
                          >
                            Reply to Customer
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding:20px 32px;
                background-color:#f9fafb;
                border-top:1px solid #e5e7eb;
              "
            >
              <div style="
                font-size:11px;
                line-height:18px;
                color:#9ca3af;
              ">
                This email was automatically generated from the
                <strong style="color:#6b7280;">Mahaveer Trans</strong>
                quote form.
                <br />
                Reference:
                <strong style="color:#6b7280;">
                  ${escapeHtml(reference)}
                </strong>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const data = await request.json();
    const reference = generateReferenceWithTime();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = buildHtml(data, reference);

    await transporter.sendMail({
      from: `"Mahaveer Trans Quote" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: data.cEmail || undefined,
      subject: `[Quote Request] ${reference} — ${data.cName || "New enquiry"} (${data.selectedSvc || "—"})`,
      html,
    });

    return Response.json({ ok: true, reference });
  } catch (err) {
    console.error("[/api/quote] Email send error:", err);
    return Response.json(
      { ok: false, error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
