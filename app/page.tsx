import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const bookPrice = 19.9
const accentColor = "#C6A47E"
const author = "Blissody"

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen font-inter text-[#1A1A1A] flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-12 pb-10">
        <div className="w-full max-w-md mx-auto mb-8 relative">
          <Image
            src="/book-cover.jpg"
            alt="Couverture du livre"
            width={400}
            height={550}
            className="rounded-lg w-full object-cover border border-[#ececec]"
            priority
          />
          <div className="absolute left-2 top-2 bg-white/80 text-xs text-[#888] px-2 py-1 rounded font-mono tracking-tight shadow-sm">
            Ils disent que ma vie est un film... 16
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-2 tracking-tight">
          ils disent que ma vie est un film...<br className="hidden md:block" />
          <span className="font-normal">Moi, je n'avais pas choisi le réalisateur</span>
        </h1>
        <div className="text-lg text-[#555] font-medium mb-4 text-center">
          par {author}
        </div>
        <p className="text-xl md:text-2xl text-center mb-6 max-w-2xl font-light">
          « Un témoignage brut, poignant et porteur d’espoir. »
        </p>
        <Link href="/order">
          <Button
            size="lg"
            className="px-8 py-3 rounded-full text-base font-semibold"
            style={{
              background: accentColor,
              color: "#fff",
              transition: "background 0.2s",
            }}
          >
            Commander — {bookPrice.toFixed(2).replace('.', ',')} €
          </Button>
        </Link>
      </section>

      {/* Résumé */}
      <section className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-serif font-semibold mb-4 text-[#2C3E50]">Résumé</h2>
        <p className="text-lg leading-relaxed text-[#222]">
          Ce livre raconte l'histoire d'une femme qui a cru construire une vie de famille, et qui a découvert l'envers du décor : manipulations, trahisons, procès, solitude. Entre ombre et lumière. Blissody partage un récit autobiographique qui ressemble à un film... sauf qu'elle n'avait pas choisi le réalisateur. Un témoignage brut, poignant et porteur d'espoir.
        </p>
      </section>

      {/* Valeurs */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-[#2C3E50]">Pourquoi ce livre ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-3xl">🤍</span>
            <div className="font-semibold">Authenticité</div>
            <div className="text-[#666] text-sm">Un témoignage vrai, sans fard, écrit avec le cœur.</div>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-3xl">📖</span>
            <div className="font-semibold">Partage</div>
            <div className="text-[#666] text-sm">Pour accompagner celles et ceux qui traversent l’épreuve.</div>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-3xl">🌱</span>
            <div className="font-semibold">Espoir</div>
            <div className="text-[#666] text-sm">Un message de lumière et de reconstruction.</div>
          </div>
        </div>
      </section>

      {/* Avis lecteurs */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-[#2C3E50]">Ils en parlent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FAF8F6] rounded-lg p-5 border border-[#f0ece8]">
            <div className="text-base leading-relaxed mb-2">« Un livre qui m’a profondément touchée. Merci pour ce partage si sincère. »</div>
            <div className="text-xs text-[#888]">— Claire, 38 ans</div>
          </div>
          <div className="bg-[#FAF8F6] rounded-lg p-5 border border-[#f0ece8]">
            <div className="text-base leading-relaxed mb-2">« Une lecture bouleversante, mais pleine d’espoir. À mettre entre toutes les mains. »</div>
            <div className="text-xs text-[#888]">— Julien, 45 ans</div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="flex justify-center py-8">
        <Link href="/order">
          <Button
            size="lg"
            className="px-8 py-3 rounded-full text-base font-semibold"
            style={{
              background: accentColor,
              color: "#fff",
              transition: "background 0.2s",
            }}
          >
            Commander — {bookPrice.toFixed(2).replace('.', ',')} €
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#f0ece8] py-6 mt-auto">
        <div className="text-center text-xs text-[#888]">
          Vente réalisée par un particulier — envoi après réception du paiement.
        </div>
      </footer>
    </div>
  )
}
