import "server-only";
import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "NeuroDesk <hello@neurodesk.app>";

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping send.");
    return { skipped: true };
  }

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to NeuroDesk",
    html: welcomeEmailHtml(name),
  });
}
function welcomeEmailHtml(name: string): string {
  return `
  <div style="font-family: 'Inter', -apple-system, sans-serif; background:#F8FAFC; padding:40px 0;">
    <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:24px; padding:40px; box-shadow: 0 8px 24px -8px rgba(15,23,42,0.08);">
      <div style="width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,#6366F1,#A855F7); margin-bottom:24px;"></div>
      <h1 style="font-size:22px; color:#0F172A; margin:0 0 12px;">Welcome, ${name} 👋</h1>
      <p style="font-size:15px; line-height:1.6; color:#475569; margin:0 0 24px;">
        Your NeuroDesk workspace is ready. One place for your whiteboards, documents,
        and AI tools — all connected.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard"
         style="display:inline-block; background:#6366F1; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 24px; border-radius:9999px;">
        Open your dashboard
      </a>
      <p style="font-size:13px; color:#94A3B8; margin-top:32px;">— The NeuroDesk team</p>
    </div>
  </div>`;
}
