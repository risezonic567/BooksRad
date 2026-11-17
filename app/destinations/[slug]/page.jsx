import { notFound } from 'next/navigation'
import DestinationDetail from '@/components/Destinations/DestinationDetail'
import destinations, { getDestination } from '@/data/destinations'
import { createPageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const destination = getDestination(slug)
  if (!destination) return {}
  return createPageMetadata({
    title: `${destination.name} flights`,
    description: destination.intro,
    path: `/destinations/${destination.slug}`,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const destination = getDestination(slug)
  if (!destination) notFound()
  return <DestinationDetail destination={destination} />
}
