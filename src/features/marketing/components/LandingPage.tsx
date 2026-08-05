import { MarketingCtaBanner } from './MarketingCtaBanner'
import { MarketingFooter } from './MarketingFooter'
import { MarketingHero } from './MarketingHero'
import { MarketingHowItWorks } from './MarketingHowItWorks'
import { MarketingNavbar } from './MarketingNavbar'
import { MarketingServices } from './MarketingServices'
import { MarketingWhyChooseUs } from './MarketingWhyChooseUs'

export function LandingPage() {
  return (
    <main className="min-h-screen font-sans antialiased">
      <MarketingNavbar />
      <MarketingHero />
      <MarketingServices />
      <MarketingHowItWorks />
      <MarketingWhyChooseUs />
      <MarketingCtaBanner />
      <MarketingFooter />
    </main>
  )
}
