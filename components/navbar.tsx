import React from 'react'
import { MainNav } from './main-nav'

const Navbar = async () => {
  return (
    <div className='flex flex-row w-full p-4 '>
      <MainNav/>
    </div>
  )
}

export default Navbar