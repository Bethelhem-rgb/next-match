import { getMembersByUserId } from '@/app/actions/memberActions'
import { CardBody, CardHeader, Divider } from '@heroui/react';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function MemberDetailedPage({params}
  :{params:Promise<{userId:string}>}) {

  const{userId} =await params;
  const member = await getMembersByUserId(userId);
  if(!member) return notFound();
  return (
    <> 
    <CardHeader className='text-2xl font-semibold text-secondary'>
      Profile
    </CardHeader>
    <Divider/>
    <CardBody>
      {member.description}
    </CardBody>
    </>
  )
}
