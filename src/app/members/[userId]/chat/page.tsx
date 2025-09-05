import { CardHeader, Divider, CardBody } from '@heroui/react'
import React from 'react'

export default async function chatPage({params}:{params:Promise<{userId:string}>}) {
  const { userId } = await params;
  return (
    <>
     <CardHeader className='text-2xl font-semibold text-secondary'>
      chat
    </CardHeader>
    <Divider/>
    <CardBody>
     chat goes here
    </CardBody>
    </>
  )
}
