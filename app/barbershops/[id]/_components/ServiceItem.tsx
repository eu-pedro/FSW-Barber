/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/app/_components/ui/button'
import { Calendar } from '@/app/_components/ui/calendar'
import { Card, CardContent } from '@/app/_components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/_components/ui/sheet'
import { Barbershop, Booking, Service } from '@prisma/client'
import { ptBR } from 'date-fns/locale/pt-BR'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { generateDayTimeList } from '../_helpers/Hours'
import { addDays, format, setHours, setMinutes } from 'date-fns'
import { saveBooking } from '../_actions/SaveBooking'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getDayBookings } from '../_actions/GetDayBookings'
import { BookingInfo } from '@/app/_components/BookingInfo'

interface ServiceItemProps {
  barbershop: Barbershop
  service: Service
  isAuthenticated: boolean
}

export function ServiceItem({
  barbershop,
  service,
  isAuthenticated,
}: ServiceItemProps) {
  const { data } = useSession()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>(undefined)
  const [submitIsLoading, setSubmitIsLoading] = useState(false)
  const [sheeIsOpen, setSheetIsOpen] = useState(false)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const router = useRouter()
  useEffect(() => {
    const refreshAvailableHours = async () => {
      if (!date) return
      const _dayBookings = await getDayBookings(barbershop.id, date)

      setDayBookings(_dayBookings)
    }

    refreshAvailableHours()
  }, [date, barbershop.id])

  function handleDateClick(date: Date | undefined) {
    setDate(date)
    setHour(undefined)
  }

  function handleBookingClick() {
    if (!isAuthenticated) {
      return signIn('google')
    }
  }

  function handleHourClick(time: string) {
    setHour(time)
  }

  const timeList = useMemo(() => {
    if (!date) return []
    return generateDayTimeList(date).filter((time) => {
      // se houver alguma reserva em 'dayBookings' com a hora e minutos igual a time, não incluir

      const timeHour = Number(time.split(':')[0])
      const timeMinutes = Number(time.split(':')[1])

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking?.date?.getHours()
        const bookingMinutes = booking?.date?.getMinutes()

        return bookingHour === timeHour && bookingMinutes === timeMinutes
      })

      if (!booking) {
        return true
      } else {
        return false
      }
    })
  }, [date, dayBookings])

  async function handleBookingSubmit() {
    try {
      if (!hour || !date || !data?.user) return

      const dateHour = Number(hour.split(':')[0])
      const dateMinutes = Number(hour.split(':')[1])

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data?.user as any).id,
      })

      setSheetIsOpen(false)
      setHour(undefined)
      setDate(undefined)
      toast('Reserva realizada com sucesso!', {
        description: format(newDate, "'Para' dd 'de' MM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: 'Visualizar',
          onClick: () => router.push('/bookings'),
        },
      })
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitIsLoading(false)
    }
  }

  const isDisableButton = !hour || !date

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold ">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary font-bold">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(service.price))}
              </p>
              <Sheet open={sheeIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-6">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={date}
                      onSelect={handleDateClick}
                      fromDate={addDays(new Date(), 1)}
                      styles={{
                        head_cell: {
                          width: '100%',
                          textTransform: 'capitalize',
                        },
                        cell: {
                          width: '100%',
                        },
                        button: {
                          width: '100%',
                        },
                        nav_button_previous: {
                          width: '32px',
                          height: '32px',
                        },
                        nav_button_next: {
                          width: '32px',
                          height: '32px',
                        },
                        caption: {
                          textTransform: 'capitalize',
                        },
                      }}
                    />
                  </div>

                  {/* Mostrar lista de horários apenas se alguma data estiver selecionada */}

                  {date && (
                    <div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden ">
                      {timeList.map((time) => (
                        <Button
                          variant={hour === time ? 'default' : 'outline'}
                          className="rounded-full"
                          key={time}
                          onClick={() => handleHourClick(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <BookingInfo
                      booking={{
                        barbershop,
                        date:
                          date &&
                          hour &&
                          setMinutes(
                            setHours(date, Number(hour.split(':')[0])),
                            Number(hour.split(':')[1]),
                          ),
                        service,
                      }}
                    />
                  </div>

                  <SheetFooter className="p-5">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={isDisableButton || submitIsLoading}
                    >
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confimar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
