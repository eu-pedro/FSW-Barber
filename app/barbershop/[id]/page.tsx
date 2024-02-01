import { db } from '@/app/_lib/prisma'

import { BarbershopInfo } from './_components/BarbershopInfo'
import { ServiceItem } from './_components/ServiceItem'

interface BarbershopDetailsPageProps {
  params: {
    id?: string
  }
}

export default async function BarbershopDetailsPage({
  params,
}: BarbershopDetailsPageProps) {
  if (!params.id) {
    // TODO: redirecionar para a home
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  })

  if (!barbershop) {
    // TODO: redirecionar para a home
    return null
  }

  return (
    <>
      <BarbershopInfo barbershop={barbershop} />
      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </>
  )
}
