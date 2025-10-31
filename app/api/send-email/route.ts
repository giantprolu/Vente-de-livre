import { NextResponse } from "next/server";
import { Resend } from "resend";

// Correction : autorise explicitement Vercel (production) et localhost (dev)
export const runtime = "edge";

export async function POST(request: Request) {
  // Vérifie l'origine si besoin (optionnel, pour plus de sécurité)
  // const allowedOrigins = [
  //   "https://ton-domaine.vercel.app",
  //   "https://ton-domaine.fr",
  //   "http://localhost:3000"
  // ];
  // const origin = request.headers.get("origin");
  // if (origin && !allowedOrigins.includes(origin)) {
  //   return NextResponse.json({ ok: false, error: "Unauthorized origin" }, { status: 401 });
  // }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ ok: false, error: "RESEND_API_KEY missing" }, { status: 500 });
  }
  const resend = new Resend(resendApiKey);

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
    // Ajoute le message d'erreur Resend si possible
    return NextResponse.json({ ok: false, error: String(error) }, { status: 401 });
  }
}
