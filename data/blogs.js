const blogs = [
  {
    slug: 'how-to-compare-flight-offers',
    title: 'How to compare flight offers without the noise',
    excerpt: 'Price is only one line. Stops, cabin, and total time decide whether a fare is actually good.',
    date: '2026-09-12',
    body: [
      'When you search flights, the cheapest number is not always the best trip. A one-stop fare that adds four hours of layover can cost more in energy than a slightly higher nonstop.',
      'Start with your hard constraints: travel dates, cabin, and who is flying. Then sort by total journey time and number of stops before you look at price.',
      'Finally, check airline reliability for your route and baggage rules. BooksRad surfaces clear offer summaries so you can request a booking on the itinerary that fits — not just the flashiest price.',
    ],
  },
  {
    slug: 'round-trip-vs-one-way',
    title: 'Round trip vs one way: which should you search first?',
    excerpt: 'Round trips often price better, but one-ways unlock flexible returns and open-jaw plans.',
    date: '2026-08-03',
    body: [
      'Most leisure travelers should search round trip first. Airlines frequently discount return itineraries relative to two separate one-ways on the same dates.',
      'Choose one way when your return is uncertain, you are combining different airlines, or you need an open jaw (fly into one city and home from another).',
      'If you are unsure, run both searches. Compare total price and schedule quality, then submit a booking request with the option you prefer.',
    ],
  },
  {
    slug: 'cabin-classes-explained',
    title: 'Cabin classes explained in plain language',
    excerpt: 'Economy, premium economy, business, and first — what actually changes for most travelers.',
    date: '2026-07-18',
    body: [
      'Economy is the baseline: a seat and standard service. For short hops it is usually enough. On long-haul overnight flights, seat pitch and rest matter more.',
      'Premium economy adds space and better meal service without the full business price. Business typically includes a lie-flat or wide recliner seat and lounge access on many long-haul airlines.',
      'First class varies wildly by airline. Search the cabin you actually want, then review offers — BooksRad maps your cabin choice into the live search so results stay relevant.',
    ],
  },
]

export function getBlogPost(slug) {
  return blogs.find((b) => b.slug === slug) || null
}

export default blogs
