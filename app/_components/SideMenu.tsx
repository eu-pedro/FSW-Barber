'use client'

import { Avatar, AvatarImage } from './ui/avatar'
import {
  LogOutIcon,
  UserIcon,
  LogInIcon,
  HomeIcon,
  CalendarIcon,
} from 'lucide-react'
import { Button } from './ui/button'
import { SheetHeader, SheetTitle } from './ui/sheet'
import { useSession, signOut, signIn } from 'next-auth/react'
import Link from 'next/link'

export function SideMenu() {
  const { data } = useSession()

  const handleLogOutClick = () => signOut()

  const handleLogInClick = () => signIn()
  return (
    <>
      <SheetHeader className="text-left border-b border-solid border-secondary p-5">
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {data?.user ? (
        <div className="flex justify-between px-5 py-6 items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={data?.user?.image ?? ''} />
            </Avatar>

            <h2 className="font-bold">{data.user.name}</h2>
          </div>

          <Button variant="secondary" size="icon">
            <LogOutIcon onClick={handleLogOutClick} />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3  px-5 py-6">
          <div className="flex items-center gap-2">
            <UserIcon size={32} />
            <h2>Olá, faça seu login!</h2>
          </div>
          <Button
            className="w-full justify-start"
            variant="secondary"
            onClick={handleLogInClick}
          >
            <LogInIcon className="mr-2" size={18} />
            Fazer Login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button className="justify-start" variant="outline" asChild>
          <Link href="/">
            <HomeIcon size={18} className="mr-2" />
            Início
          </Link>
        </Button>

        {data?.user && (
          <Button className="justify-start" variant="outline" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} className="mr-2" />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </>
  )
}
