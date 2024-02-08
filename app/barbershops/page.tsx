/* eslint-disable react/no-unescaped-entities */
import { Barbershop } from '@prisma/client'
import { BarbershopItem } from '../(home)/_components/BarbershopItem'
import { Header } from '../_components/Header'
import { db } from '../_lib/prisma'

interface BarbershopsPageProps {
  searchParams: {
    search?: string
  }
}

export default async function BarbershopPage({
  searchParams,
}: BarbershopsPageProps) {
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive',
      },
    },
  })

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-gray-400 text-bold text-xs uppercase">
          Resultados para &apos;{searchParams.search}&apos;
        </h1>

        <div className="grid grid-cols-2 mt-3">
          {barbershops.map((barbershop: Barbershop) => (
            <>
              <div className="w-full" key={barbershop.id}>
                <BarbershopItem barbershop={barbershop} />
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  )
}
