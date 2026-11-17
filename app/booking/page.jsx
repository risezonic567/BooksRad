import BookingForm from '@/components/Booking/BookingForm'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Passenger details',
  description: 'Enter traveller details for your selected BooksRad flight offer.',
  path: '/booking',
})

export default function BookingPage() {
  return <BookingForm />
}
