'use client'

import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { Services } from './Services'
import { HowItWorks } from './HowItWorks'
import { WhyChooseUs } from './WhyChooseUs'
import { CTABanner } from './CTABanner'
import { Footer } from './Footer'

export const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <CTABanner />
      <Footer />
    </main>
  )
}
