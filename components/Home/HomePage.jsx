import HeroSearch from '@/components/Home/HeroSearch'
import WhyUs from '@/components/Home/WhyUs'
import DestinationsTeaser from '@/components/Home/DestinationsTeaser'
import AirlinesTeaser from '@/components/Home/AirlinesTeaser'
import HowItWorks from '@/components/Home/HowItWorks'
import Testimonials from '@/components/Home/Testimonials'
import Faq from '@/components/Home/Faq'
import Cta from '@/components/Home/Cta'

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <WhyUs />
      <DestinationsTeaser />
      <AirlinesTeaser />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  )
}
