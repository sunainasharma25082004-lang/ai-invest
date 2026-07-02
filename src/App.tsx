import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Compliance from './components/Compliance'
import RiskDisclaimer from './components/RiskDisclaimer'
import SignupForm from './components/SignupForm'
import Legal from './components/Legal'
import Footer from './components/Footer'
import LanguageSelector from './components/LanguageSelector'
import GoogleTranslateWidget from './components/GoogleTranslateWidget'
import { LanguageProvider } from './i18n/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <GoogleTranslateWidget />
      <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-200">
        <LanguageSelector />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Features />
          <Compliance />
          <RiskDisclaimer />
          <SignupForm />
          <Legal />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}