import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();
  try {
    const data = await resend.emails.send({
      from: `Nathan Chavaudra <onboarding@resend.dev>`, // ou une adresse validée sur Resend
      to,
      subject,
      html,
    });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
