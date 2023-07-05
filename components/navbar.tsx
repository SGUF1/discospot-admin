import React from 'react'
import { MainNav } from './main-nav'
import Image from 'next/image'
import prismadb from '@/lib/prismadb'

const Navbar = ({ imageUrl }: { imageUrl: string }) => {


  return (
    <div className='flex flex-row w-full p-4 '>
      <MainNav imageUrl={imageUrl} />

    </div>
  )
}

export default Navbar