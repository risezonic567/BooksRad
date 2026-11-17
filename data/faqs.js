const faqs = [
  {
    q: 'Is BooksRad a booking engine or a request desk?',
    a: 'You search live flight offers, pick the itinerary you like, then submit a booking request. Our desk confirms availability and next steps — you are not charged automatically at request time.',
  },
  {
    q: 'Where do the flight prices come from?',
    a: 'Search results are powered by Duffel offer requests using airport and schedule data. Prices and seats can change until a booking is confirmed.',
  },
  {
    q: 'Can I book for children and infants?',
    a: 'Yes. Set adult, child, and infant counts in the search form. Infant without seat counts are supported in the passenger payload we send to the search API.',
  },
  {
    q: 'Do I need passenger names before searching?',
    a: 'No. Search with traveler counts first. You can add passenger names when you submit the booking request.',
  },
  {
    q: 'How quickly will someone reply?',
    a: 'We aim to reply within one business day. Complex multi-city or premium cabin requests may take a little longer while we verify seats.',
  },
  {
    q: 'What if an offer expires?',
    a: 'Airline offers can expire quickly. If your selected fare is gone, we will share the closest available alternatives for the same route and dates.',
  },
]

export default faqs
