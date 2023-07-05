import React from 'react'
import { AdminColumn } from './columns'
import Image from 'next/image'

interface CellUsernameProps {
  data: AdminColumn
}

const CellUsername = ({ data }: CellUsernameProps) => {
  const fakeImage = "https://asset.cloudinary.com/dg2hpjtdh/b7a513fd4bd30a908ce82e7960026a6e"
  const realImage = "https://res.cloudinary.com/dg2hpjtdh/image/upload/v1688595030/cqi5mouupo1g8vs7y6ql.jpg"
  return (
    <div className='flex gap-2 items-center'>
      <div className='h-9 w-9 rounded-full border overflow-hidden flex items-center justify-center'>
        <Image src={data.imageUrl === fakeImage ? realImage : data.imageUrl } width={120} height={50}  alt='image'/>
      </div>
      {data.username}
    </div>
  )
}

export default CellUsername