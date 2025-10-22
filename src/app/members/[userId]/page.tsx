import { getMemberByUserId } from '@/app/actions/memberActions'
import { CardBody, CardHeader, Divider } from '@heroui/react';
import { notFound } from 'next/navigation';
import React from 'react'
type Props = {
  params: {userId: string};
};
export default async function MemberDetailedPage({params}:Props){

  const{userId} = params;
  const member = await getMemberByUserId(userId);
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
