'use client'

import Image from 'next/image'
import { Button } from '@/app/_components/ui/button'
import { Barbershop } from '@prisma/client'
import { ChevronLeftIcon, MenuIcon, MapPinIcon, StarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Sheet, SheetContent, SheetTrigger } from '@/app/_components/ui/sheet'
import { SideMenu } from '@/app/_components/SideMenu'

interface BarbershopInfoProps {
  barbershop: Barbershop
}

export function BarbershopInfo({ barbershop }: BarbershopInfoProps) {
  const router = useRouter()
  function handleBackClick() {
    router.replace('/')
  }

  return (
    <>
      <div className="h-[250px] w-full relative">
        <Button
          size="icon"
          variant="outline"
          className="z-50 absolute top-4 left-4"
        >
          <ChevronLeftIcon onClick={handleBackClick} />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="z-50 absolute top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>

        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{ objectFit: 'cover' }}
          className="opacity-85"
        />
      </div>
      <div className="px-5 py-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">5,0 (899 avaliações)</p>
        </div>
      </div>
    </>
  )
}
