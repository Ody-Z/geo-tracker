import { getAppUrl } from "./utils";

interface ScoreDropEmailParams {
  to: string;
  brandName: string;
  previousScore: number;
  currentScore: number;
  scanId: string;
}

export async function sendScoreDropEmail({
  to,
  brandName,
  previousScore,
  currentScore,
  scanId,
}: ScoreDropEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return;
  }

  const drop = previousScore - currentScore;
  const resultsUrl = `${getAppUrl()}/results/${scanId}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GEO Tracker <alerts@geotracker.app>",
      to: [to],
      subject: `⚠️ ${brandName} AI visibility dropped ${drop} points`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>AI Visibility Alert</h2>
          <p>Your brand <strong>${brandName}</strong> had a significant drop in AI visibility:</p>
          <table style="border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 16px; border: 1px solid #e2e8f0;">Previous Score</td>
              <td style="padding: 8px 16px; border: 1px solid #e2e8f0; font-weight: bold;">${previousScore}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px; border: 1px solid #e2e8f0;">Current Score</td>
              <td style="padding: 8px 16px; border: 1px solid #e2e8f0; font-weight: bold; color: #ef4444;">${currentScore}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px; border: 1px solid #e2e8f0;">Drop</td>
              <td style="padding: 8px 16px; border: 1px solid #e2e8f0; font-weight: bold; color: #ef4444;">-${drop} points</td>
            </tr>
          </table>
          <a href="${resultsUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px;">View Full Report</a>
          <p style="margin-top: 24px; color: #64748b; font-size: 14px;">— GEO Tracker</p>
        </div>
      `,
    }),
  });
}
