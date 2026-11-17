import { notFound } from 'next/navigation'
import AirlineDetail from '@/components/Airlines/AirlineDetail'
import airlines, { getAirline } from '@/data/airlines'
import { createPageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return airlines.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const airline = getAirline(slug)
  if (!airline) return {}
  return createPageMetadata({
    title: airline.name,
    description: airline.description,
    path: `/airlines/${airline.slug}`,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const airline = getAirline(slug)
  if (!airline) notFound()
  return <AirlineDetail airline={airline} />
}
