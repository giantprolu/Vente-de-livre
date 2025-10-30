import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  const { to, subject, html } = await request.json()
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  try {
    // Vérification de la connexion SMTP
    await transporter.verify()
    const info = await transporter.sendMail({
      from: `"Nathan Chavaudra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log("Email envoyé:", info)
    return NextResponse.json({ ok: true, info })
  } catch (error) {
    console.error("Erreur envoi email:", error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}
