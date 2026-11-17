import BookingConfirmation from '@/components/Booking/BookingConfirmation'
import { createPageMetadata } from '@/lib/seo'

export const metadata = createPageMetadata({
  title: 'Booking request received',
  description: 'Your BooksRad booking request was submitted successfully.',
  path: '/booking-confirmation',
})

export default function BookingConfirmationPage() {
  return <BookingConfirmation />
}
