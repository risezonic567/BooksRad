const airlines = [
  {
    slug: 'american-airlines',
    name: 'American Airlines',
    short: 'US network strength',
    description:
      'A major US carrier with dense domestic coverage and solid transatlantic and Latin America links — useful when you need flexible US connections.',
  },
  {
    slug: 'delta-air-lines',
    name: 'Delta Air Lines',
    short: 'Reliable US–Europe links',
    description:
      'Known for consistent product and SkyTeam partnerships. Strong for US hubs into Europe and Asia with clear cabin choices.',
  },
  {
    slug: 'united-airlines',
    name: 'United Airlines',
    short: 'Pacific & domestic reach',
    description:
      'Broad Star Alliance connectivity with competitive Pacific routes and a large US domestic footprint for connecting itineraries.',
  },
  {
    slug: 'british-airways',
    name: 'British Airways',
    short: 'London hub specialist',
    description:
      'Heathrow-focused long-haul and short-haul options. A frequent pick when London is your gateway or destination.',
  },
  {
    slug: 'emirates',
    name: 'Emirates',
    short: 'Dubai long-haul hub',
    description:
      'One-stop long-haul via Dubai with a polished cabin experience — often competitive on Asia–Europe and Australia corridors.',
  },
  {
    slug: 'qatar-airways',
    name: 'Qatar Airways',
    short: 'Award-winning long-haul',
    description:
      'Doha hub flying with strong premium cabins and efficient Middle East connections across six continents.',
  },
  {
    slug: 'lufthansa',
    name: 'Lufthansa',
    short: 'German precision network',
    description:
      'Frankfurt and Munich hubs for Europe and beyond. Solid when you need Star Alliance continuity and European depth.',
  },
  {
    slug: 'singapore-airlines',
    name: 'Singapore Airlines',
    short: 'Asia hub excellence',
    description:
      'Changi-based service with excellent long-haul comfort — a go-to for Australia, Asia, and Europe via Singapore.',
  },
  {
    slug: 'air-france',
    name: 'Air France',
    short: 'Paris CDG gateway',
    description:
      'SkyTeam member with strong Paris connections into Africa, Europe, and North America — useful for CDG-centered trips.',
  },
]

export function getAirline(slug) {
  return airlines.find((a) => a.slug === slug) || null
}

export default airlines
