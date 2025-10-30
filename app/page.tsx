import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Package, Shield, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const bookPrice = 25
  const shippingCost = 5

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Blissody</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/track">
              <Button variant="ghost">Suivre ma commande</Button>
            </Link>
            <Link href="/order">
              <Button>Commander</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-balance">Découvrez Mon Nouveau Livre</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Un témoignage bouleversant et authentique, tiré d'une histoire vraie, qui aborde avec sensibilité des épreuves douloureuses. Disponible dès maintenant en édition limitée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order">
                <Button size="lg" className="w-full sm:w-auto">
                  Commander maintenant
                </Button>
              </Link>
              <Link href="#details">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Pourquoi commander chez nous ?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">Livraison rapide</h4>
                <p className="text-muted-foreground">Expédition sous 48h partout en France</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">Paiement sécurisé</h4>
                <p className="text-muted-foreground">Plusieurs options de paiement disponibles</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">Édition limitée</h4>
                <p className="text-muted-foreground">Exemplaires dédicacés et signés</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Book Details */}
      <section id="details" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <h3 className="text-3xl font-bold text-center">À propos du livre</h3>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg leading-relaxed">
                Ce livre est un témoignage authentique et bouleversant, inspiré d'une histoire vraie et marquée par des épreuves douloureuses. Chaque page partage une expérience de vie sincère et profonde.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="font-semibold">Format</p>
                  <p className="text-muted-foreground">Broché, 320 pages</p>
                </div>
                <div>
                  <p className="font-semibold">Prix</p>
                  <p className="text-muted-foreground">
                    {bookPrice}€ + {shippingCost}€ de frais de port
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Langue</p>
                  <p className="text-muted-foreground">Français</p>
                </div>
                <div>
                  <p className="font-semibold">Disponibilité</p>
                  <p className="text-muted-foreground">En stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center">
            <Link href="/order">
              <Button size="lg">Commander maintenant - {bookPrice + shippingCost}€</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Mon Livre. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Politique de confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Conditions générales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
