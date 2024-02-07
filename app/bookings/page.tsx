import { getServerSession } from 'next-auth'
import { Header } from '../_components/Header'
import { redirect } from 'next/navigation'
import { db } from '../_lib/prisma'
import { BookingItem } from '../_components/BookingItem'
import { authOptions } from '../_lib/auth'
import { Booking } from '@prisma/client'

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

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  )
}
