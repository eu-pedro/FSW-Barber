import { getServerSession } from 'next-auth'
import { Header } from '../_components/Header'
import { redirect } from 'next/navigation'
import { db } from '../_lib/prisma'
import { BookingItem } from '../_components/BookingItem'
import { authOptions } from '../_lib/auth'
import { Booking } from '@prisma/client'
import { isFuture, isPast } from 'date-fns'

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/')
  }

  const bookings: Booking[] = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  })

  const confirmedBookings = bookings.filter((booking) => isFuture(booking.date))
  const finishedBookings = bookings.filter((booking) => isPast(booking.date))

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  )
}
