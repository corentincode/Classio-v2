import Link from "next/link"
import { ArrowRight, ChevronRight, BarChart3, Shield, Users, Zap, Clock, Lock, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#141414] text-[#f3f3f3] overflow-hidden">
      {/* Header */}
      <header className="border-b border-[#f3f3f3]/10 backdrop-blur-sm fixed w-full z-50 bg-[#141414]/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-md flex items-center justify-center">
                <span className="font-bold text-[#141414]">C</span>
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]">
                CLASSIO
              </span>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden flex items-center text-[#f3f3f3]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-[#f3f3f3]/80 hover:text-[#f2e0b5] transition-colors text-sm">
                Plateforme
              </Link>
              <Link href="#" className="text-[#f3f3f3]/80 hover:text-[#f2e0b5] transition-colors text-sm">
                Tokenomics
              </Link>
              <Link href="#" className="text-[#f3f3f3]/80 hover:text-[#f2e0b5] transition-colors text-sm">
                Roadmap
              </Link>
              <Link href="#" className="text-[#f3f3f3]/80 hover:text-[#f2e0b5] transition-colors text-sm">
                Communauté
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="hidden md:inline-flex text-[#f2e0b5] hover:text-[#f2e0b5]/90 transition-colors text-sm font-medium"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] text-[#141414] px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu - hidden by default */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#141414] border-t border-[#f3f3f3]/10">
            <Link href="#" className="block px-3 py-2 text-[#f3f3f3] hover:bg-[#f3f3f3]/5 rounded-md">
              Plateforme
            </Link>
            <Link href="#" className="block px-3 py-2 text-[#f3f3f3] hover:bg-[#f3f3f3]/5 rounded-md">
              Tokenomics
            </Link>
            <Link href="#" className="block px-3 py-2 text-[#f3f3f3] hover:bg-[#f3f3f3]/5 rounded-md">
              Roadmap
            </Link>
            <Link href="#" className="block px-3 py-2 text-[#f3f3f3] hover:bg-[#f3f3f3]/5 rounded-md">
              Communauté
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Link
                href="/auth/login"
                className="px-3 py-2 text-center text-[#f2e0b5] border border-[#f2e0b5]/30 rounded-md"
              >
                Se connecter
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-2 text-center bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] text-[#141414] rounded-md"
              >
                Lancer l'app
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#d0e4f3]/5 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-[#f2e0b5]/5 blur-[100px]"></div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTIgMGgydjJoLTJ2LTJ6bS0yLTRoMnYyaC0ydi0yek0zNCAzMGgydjJoLTJ2LTJ6bTAtNHYyaC0ydi0yaDJ6bTAgMGgydjJoLTJ2LTJ6bS00LTRoMnYyaC0ydi0yek0zMCAyNmgydjJoLTJ2LTJ6bS0yLTRoMnYyaC0ydi0yek0zMCAyMmgydjJoLTJ2LTJ6bTAtNHYyaC0ydi0yaDJ6bTQgMGgydjJoLTJ2LTJ6bTQgNGgydjJoLTJ2LTJ6bTAgMHYyaC0ydi0yaDJ6bTAgMGgydjJoLTJ2LTJ6bTIgNGgydjJoLTJ2LTJ6bTAgMHYyaC0ydi0yaDJ6bTAgMGgydjJoLTJ2LTJ6bTIgNGgydjJoLTJ2LTJ6bTAgMHYyaC0ydi0yaDJ6bTAgMGgydjJoLTJ2LTJ6bTIgNGgydjJoLTJ2LTJ6bTAgMHYyaC0ydi0yaDJ6bTAgMGgydjJoLTJ2LTJ6bTIgNGgydjJoLTJ2LTJ6bTAgMHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1 border border-[#f2e0b5]/30 rounded-full bg-[#141414]/50 backdrop-blur-sm">
              <span className="text-[#f2e0b5] text-sm font-medium">La révolution éducative est en marche</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              L'éducation décentralisée <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]">
                pour l'ère numérique
              </span>
            </h1>
            <p className="text-[#f3f3f3]/70 mb-8 text-lg max-w-2xl mx-auto">
              Classio transforme la gestion scolaire avec une technologie de pointe, offrant sécurité, transparence et
              efficacité sans précédent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] text-[#141414] px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
              >
                S'inscrire
              </Link>
              <Link
                href="#"
                className="bg-[#141414] border border-[#f3f3f3]/20 text-[#f3f3f3] px-6 py-3 rounded-md font-medium hover:bg-[#f3f3f3]/5 transition-colors flex items-center justify-center w-full sm:w-auto"
              >
                Whitepaper <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stats ticker */}
          <div className="mt-12 md:mt-16 bg-[#141414]/50 backdrop-blur-sm border border-[#f3f3f3]/10 rounded-xl p-4 overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="text-center px-4 w-[calc(50%-1rem)] md:w-auto">
                <div className="text-xl md:text-2xl font-bold text-[#f2e0b5]">500+</div>
                <div className="text-[#f3f3f3]/60 text-xs md:text-sm">Établissements</div>
              </div>
              <div className="hidden md:block h-8 border-r border-[#f3f3f3]/10"></div>
              <div className="text-center px-4 w-[calc(50%-1rem)] md:w-auto">
                <div className="text-xl md:text-2xl font-bold text-[#f2e0b5]">1M+</div>
                <div className="text-[#f3f3f3]/60 text-xs md:text-sm">Utilisateurs</div>
              </div>
              <div className="hidden md:block h-8 border-r border-[#f3f3f3]/10"></div>
              <div className="text-center px-4 w-[calc(50%-1rem)] md:w-auto">
                <div className="text-xl md:text-2xl font-bold text-[#f2e0b5]">99.9%</div>
                <div className="text-[#f3f3f3]/60 text-xs md:text-sm">Uptime</div>
              </div>
              <div className="hidden md:block h-8 border-r border-[#f3f3f3]/10"></div>
              <div className="text-center px-4 w-[calc(50%-1rem)] md:w-auto">
                <div className="text-xl md:text-2xl font-bold text-[#f2e0b5]">24/7</div>
                <div className="text-[#f3f3f3]/60 text-xs md:text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 border border-[#d0e4f3]/30 rounded-full bg-[#141414]/50">
              <span className="text-[#d0e4f3] text-sm font-medium">Fonctionnalités innovantes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Une technologie <span className="text-[#f2e0b5]">révolutionnaire</span>
            </h2>
            <p className="text-[#f3f3f3]/70">
              Découvrez comment Classio redéfinit la gestion scolaire avec des outils de pointe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 hover:border-[#f2e0b5]/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f2e0b5]/20 to-[#d0e4f3]/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#f2e0b5]/30 group-hover:to-[#d0e4f3]/30 transition-all">
                <Shield className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#f2e0b5] transition-colors">Sécurité avancée</h3>
              <p className="text-[#f3f3f3]/70 mb-4">
                Protection des données de niveau bancaire avec chiffrement de bout en bout et authentification
                multi-facteurs.
              </p>
              <Link
                href="#"
                className="text-[#f2e0b5] font-medium flex items-center text-sm hover:underline group-hover:translate-x-1 transition-transform"
              >
                En savoir plus <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 hover:border-[#f2e0b5]/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f2e0b5]/20 to-[#d0e4f3]/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#f2e0b5]/30 group-hover:to-[#d0e4f3]/30 transition-all">
                <BarChart3 className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#f2e0b5] transition-colors">
                Analytics en temps réel
              </h3>
              <p className="text-[#f3f3f3]/70 mb-4">
                Visualisez les performances et l'activité avec des tableaux de bord dynamiques et des métriques
                personnalisables.
              </p>
              <Link
                href="#"
                className="text-[#f2e0b5] font-medium flex items-center text-sm hover:underline group-hover:translate-x-1 transition-transform"
              >
                En savoir plus <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 hover:border-[#f2e0b5]/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-[#f2e0b5]/20 to-[#d0e4f3]/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#f2e0b5]/30 group-hover:to-[#d0e4f3]/30 transition-all">
                <Users className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[#f2e0b5] transition-colors">
                Gestion décentralisée
              </h3>
              <p className="text-[#f3f3f3]/70 mb-4">
                Contrôle d'accès granulaire et traçabilité complète des actions pour une gouvernance transparente.
              </p>
              <Link
                href="#"
                className="text-[#f2e0b5] font-medium flex items-center text-sm hover:underline group-hover:translate-x-1 transition-transform"
              >
                En savoir plus <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 relative bg-[#141414]/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-[#d0e4f3]/5 blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#f2e0b5]/5 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 border border-[#f2e0b5]/30 rounded-full bg-[#141414]/50">
              <span className="text-[#f2e0b5] text-sm font-medium">Comment ça marche</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Une expérience <span className="text-[#d0e4f3]">simplifiée</span>
            </h2>
            <p className="text-[#f3f3f3]/70">
              Classio rend la gestion scolaire aussi simple que possible, sans compromettre la sécurité ou les
              fonctionnalités.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center text-[#141414] font-bold">
                1
              </div>
              <div className="w-12 h-12 bg-[#f3f3f3]/5 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Inscription</h3>
              <p className="text-[#f3f3f3]/70">
                Créez votre compte et configurez votre établissement en quelques minutes.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center text-[#141414] font-bold">
                2
              </div>
              <div className="w-12 h-12 bg-[#f3f3f3]/5 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Activation</h3>
              <p className="text-[#f3f3f3]/70">
                Activez les modules dont vous avez besoin et personnalisez votre expérience.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center text-[#141414] font-bold">
                3
              </div>
              <div className="w-12 h-12 bg-[#f3f3f3]/5 rounded-xl flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Intégration</h3>
              <p className="text-[#f3f3f3]/70">
                Importez vos données existantes ou commencez à zéro avec nos assistants.
              </p>
            </div>

            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-6 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center text-[#141414] font-bold">
                4
              </div>
              <div className="w-12 h-12 bg-[#f3f3f3]/5 rounded-xl flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-[#f2e0b5]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sécurisation</h3>
              <p className="text-[#f3f3f3]/70">
                Configurez les permissions et les accès pour chaque type d'utilisateur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 border border-[#d0e4f3]/30 rounded-full bg-[#141414]/50">
              <span className="text-[#d0e4f3] text-sm font-medium">Tokenomics</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Le token <span className="text-[#f2e0b5]">$CLASS</span>
            </h2>
            <p className="text-[#f3f3f3]/70">
              Découvrez comment notre écosystème tokenisé révolutionne l'économie de l'éducation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#f2e0b5]">Distribution des tokens</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs md:text-sm text-[#f3f3f3]/70">Écosystème éducatif</span>
                      <span className="text-xs md:text-sm font-medium">40%</span>
                    </div>
                    <div className="w-full bg-[#f3f3f3]/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] h-2 rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs md:text-sm text-[#f3f3f3]/70">Réserve de développement</span>
                      <span className="text-xs md:text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-[#f3f3f3]/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] h-2 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs md:text-sm text-[#f3f3f3]/70">Équipe & Conseillers</span>
                      <span className="text-xs md:text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-[#f3f3f3]/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] h-2 rounded-full"
                        style={{ width: "15%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs md:text-sm text-[#f3f3f3]/70">Marketing & Partenariats</span>
                      <span className="text-xs md:text-sm font-medium">10%</span>
                    </div>
                    <div className="w-full bg-[#f3f3f3]/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs md:text-sm text-[#f3f3f3]/70">Liquidité</span>
                      <span className="text-xs md:text-sm font-medium">10%</span>
                    </div>
                    <div className="w-full bg-[#f3f3f3]/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6">
                <h3 className="text-xl font-bold mb-4 text-[#f2e0b5]">Utilité du token</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#f2e0b5]/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-[#f2e0b5]" />
                    </div>
                    <span className="text-sm text-[#f3f3f3]/80">
                      Accès aux fonctionnalités premium de la plateforme
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#f2e0b5]/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-[#f2e0b5]" />
                    </div>
                    <span className="text-sm text-[#f3f3f3]/80">Récompenses pour les contributions à l'écosystème</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#f2e0b5]/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-[#f2e0b5]" />
                    </div>
                    <span className="text-sm text-[#f3f3f3]/80">
                      Gouvernance et vote sur les futures fonctionnalités
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#f2e0b5]/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-[#f2e0b5]" />
                    </div>
                    <span className="text-sm text-[#f3f3f3]/80">Réductions sur les abonnements et services</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#f2e0b5]/20 to-[#d0e4f3]/20 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#f2e0b5]">Token $CLASS</h3>
                    <p className="text-[#f3f3f3]/70 text-sm">Prix actuel</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-bold">$0.42</div>
                    <div className="text-[#f2e0b5] text-sm">
                      +5.3% <span className="text-xs">24h</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-32 md:h-40 w-full bg-[#f3f3f3]/5 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-[#f2e0b5] mx-auto mb-2" />
                      <p className="text-[#f3f3f3]/70 text-xs md:text-sm">Graphique de prix en temps réel</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                  <div className="bg-[#f3f3f3]/5 rounded-lg p-3 md:p-4">
                    <div className="text-xs md:text-sm text-[#f3f3f3]/70 mb-1">Market Cap</div>
                    <div className="text-base md:text-lg font-bold">$42M</div>
                  </div>
                  <div className="bg-[#f3f3f3]/5 rounded-lg p-3 md:p-4">
                    <div className="text-xs md:text-sm text-[#f3f3f3]/70 mb-1">Volume 24h</div>
                    <div className="text-base md:text-lg font-bold">$3.2M</div>
                  </div>
                  <div className="bg-[#f3f3f3]/5 rounded-lg p-3 md:p-4">
                    <div className="text-xs md:text-sm text-[#f3f3f3]/70 mb-1">Circulation</div>
                    <div className="text-base md:text-lg font-bold">100M</div>
                  </div>
                  <div className="bg-[#f3f3f3]/5 rounded-lg p-3 md:p-4">
                    <div className="text-xs md:text-sm text-[#f3f3f3]/70 mb-1">Total Supply</div>
                    <div className="text-base md:text-lg font-bold">1B</div>
                  </div>
                </div>

                <Link
                  href="#"
                  className="block w-full bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] text-[#141414] text-center py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
                >
                  Acheter des tokens $CLASS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-20 relative bg-[#141414]/50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#d0e4f3]/5 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full bg-[#f2e0b5]/5 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 px-3 py-1 border border-[#f2e0b5]/30 rounded-full bg-[#141414]/50">
              <span className="text-[#f2e0b5] text-sm font-medium">Roadmap</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Notre vision pour <span className="text-[#d0e4f3]">l'avenir</span>
            </h2>
            <p className="text-[#f3f3f3]/70 text-sm md:text-base">
              Découvrez les étapes clés de notre développement et les fonctionnalités à venir.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line - visible uniquement sur desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#f2e0b5] to-[#d0e4f3] hidden md:block"></div>

            {/* Version mobile de la timeline */}
            <div className="space-y-6 md:space-y-12">
              <div className="md:flex md:flex-row items-center">
                {/* Point de timeline mobile */}
                <div className="flex items-center mb-3 md:hidden">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-[#141414] rounded-full"></div>
                  </div>
                  <div className="h-0.5 flex-grow bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]/10 ml-2"></div>
                </div>

                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6 hover:border-[#f2e0b5]/30 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-[#f2e0b5]/10 rounded-full text-[#f2e0b5] text-xs md:text-sm font-medium mb-3">
                      Q2 2025
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Lancement de la plateforme</h3>
                    <p className="text-sm text-[#f3f3f3]/70">
                      Déploiement de la version initiale avec les fonctionnalités de base pour la gestion scolaire.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10 my-4 mx-auto hidden md:flex">
                  <div className="w-6 h-6 bg-[#141414] rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 invisible md:visible"></div>
              </div>

              <div className="md:flex md:flex-row items-center">
                {/* Point de timeline mobile */}
                <div className="flex items-center mb-3 md:hidden">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-[#141414] rounded-full"></div>
                  </div>
                  <div className="h-0.5 flex-grow bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]/10 ml-2"></div>
                </div>

                <div className="md:w-1/2 md:pr-12 invisible md:visible"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10 my-4 mx-auto hidden md:flex">
                  <div className="w-6 h-6 bg-[#141414] rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6 hover:border-[#f2e0b5]/30 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-[#f2e0b5]/10 rounded-full text-[#f2e0b5] text-xs md:text-sm font-medium mb-3">
                      Q3 2025
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Token $CLASS</h3>
                    <p className="text-sm text-[#f3f3f3]/70">
                      Introduction du token $CLASS et mise en place de l'écosystème tokenisé.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:flex md:flex-row items-center">
                {/* Point de timeline mobile */}
                <div className="flex items-center mb-3 md:hidden">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-[#141414] rounded-full"></div>
                  </div>
                  <div className="h-0.5 flex-grow bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]/10 ml-2"></div>
                </div>

                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6 hover:border-[#f2e0b5]/30 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-[#f2e0b5]/10 rounded-full text-[#f2e0b5] text-xs md:text-sm font-medium mb-3">
                      Q4 2025
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Marketplace éducative</h3>
                    <p className="text-sm text-[#f3f3f3]/70">
                      Lancement de la marketplace pour l'échange de ressources pédagogiques et de services.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10 my-4 mx-auto hidden md:flex">
                  <div className="w-6 h-6 bg-[#141414] rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12 invisible md:visible"></div>
              </div>

              <div className="md:flex md:flex-row items-center">
                {/* Point de timeline mobile */}
                <div className="flex items-center mb-3 md:hidden">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10">
                    <div className="w-4 h-4 bg-[#141414] rounded-full"></div>
                  </div>
                  <div className="h-0.5 flex-grow bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]/10 ml-2"></div>
                </div>

                <div className="md:w-1/2 md:pr-12 invisible md:visible"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-full flex items-center justify-center z-10 my-4 mx-auto hidden md:flex">
                  <div className="w-6 h-6 bg-[#141414] rounded-full"></div>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-[#141414] border border-[#f3f3f3]/10 rounded-xl p-4 md:p-6 hover:border-[#f2e0b5]/30 transition-all duration-300">
                    <div className="inline-block px-3 py-1 bg-[#f2e0b5]/10 rounded-full text-[#f2e0b5] text-xs md:text-sm font-medium mb-3">
                      Q1 2026
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Expansion mondiale</h3>
                    <p className="text-sm text-[#f3f3f3]/70">
                      Déploiement international et intégration avec les systèmes éducatifs locaux.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#141414] to-[#141414]/80"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f2e0b5]/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d0e4f3]/50 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Rejoignez la{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]">
                révolution éducative
              </span>
            </h2>
            <p className="text-[#f3f3f3]/70 mb-8 text-lg max-w-2xl mx-auto">
              Soyez parmi les premiers à adopter la technologie qui transforme l'éducation pour les générations futures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3] text-[#141414] px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
              >
                Commencer maintenant
              </Link>
              <Link
                href="#"
                className="bg-[#141414] border border-[#f3f3f3]/20 text-[#f3f3f3] px-6 py-3 rounded-md font-medium hover:bg-[#f3f3f3]/5 transition-colors flex items-center justify-center w-full sm:w-auto"
              >
                Rejoindre la communauté <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141414] text-[#f3f3f3]/70 py-12 border-t border-[#f3f3f3]/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-[#f2e0b5] to-[#d0e4f3] rounded-md flex items-center justify-center">
                  <span className="font-bold text-[#141414]">C</span>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#f2e0b5] to-[#d0e4f3]">
                  CLASSIO
                </span>
              </div>
              <p className="text-sm">La révolution éducative pour l'ère numérique.</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-[#f3f3f3]/70 hover:text-[#f2e0b5] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-[#f3f3f3]/70 hover:text-[#f2e0b5] transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-[#f3f3f3] mb-4 text-sm md:text-base">Plateforme</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-[#f3f3f3] mb-4 text-sm md:text-base">Ressources</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Tutoriels
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-[#f3f3f3] mb-4 text-sm md:text-base">Entreprise</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#f2e0b5] transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#f3f3f3]/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs md:text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Classio. Tous droits réservés.
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-[#f3f3f3]/50" />
            <select className="bg-transparent border border-[#f3f3f3]/10 rounded text-xs md:text-sm py-1 px-2 text-[#f3f3f3]/70 focus:outline-none focus:ring-1 focus:ring-[#f2e0b5]/50">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </footer>

      {/* Script pour le menu mobile */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuButton = document.querySelector('button.md\\:hidden');
            const mobileMenu = document.querySelector('.md\\:hidden.hidden');
            
            if (mobileMenuButton && mobileMenu) {
              mobileMenuButton.addEventListener('click', function() {
                if (mobileMenu.classList.contains('hidden')) {
                  mobileMenu.classList.remove('hidden');
                } else {
                  mobileMenu.classList.add('hidden');
                }
              });
            }
          });
        `,
        }}
      />
    </div>
  )
}
