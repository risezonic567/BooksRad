const destinations = [
  {
    slug: 'new-york',
    name: 'New York',
    country: 'United States',
    intro: 'Skyline energy, museums, and nonstop flights into JFK, EWR, and LGA.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'london',
    name: 'London',
    country: 'United Kingdom',
    intro: 'Historic streets and a dense web of long-haul options via Heathrow and Gatwick.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    intro: 'A global hub for East–West connections with polished airport transfers.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    intro: 'Neon nights, quiet temples, and efficient arrivals at Haneda and Narita.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    intro: 'Cafés, galleries, and classic European gateways through CDG and Orly.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    intro: 'A seamless Asia hub with Changi’s world-class connections and layover comfort.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    intro: 'Harbour views and long-haul routes into Australia’s busiest international gateway.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    intro: 'Mediterranean light, Gaudí landmarks, and strong European short-haul links.',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'istanbul',
    name: 'Istanbul',
    country: 'Türkiye',
    intro: 'Where continents meet — a natural stop between Europe, Asia, and Africa.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
  },
]

export function getDestination(slug) {
  return destinations.find((d) => d.slug === slug) || null
}

export default destinations
