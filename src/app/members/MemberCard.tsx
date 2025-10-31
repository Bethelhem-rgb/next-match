'use client';
import LikeButton from '@/components/LikeButton'
import { calculateAge } from '@/lib/util'
import { Card, CardFooter,Image } from '@heroui/react'
import { Member } from '@prisma/client'
import Link from 'next/link'
import React from 'react'
type Props = {
    member: Member
    likeIds: string[]
     
}
export default function MemberCard({member,likeIds}: Props) {
  const hasliked = likeIds.includes(member.userId);
  const PreventLinkAction = (e:React.MouseEvent)=>{
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <Card 
    fullWidth
    as={Link}
    href={`/members/${member.userId}`}
    isPressable>
        <Image
    isZoomed
    alt = {member.name??'Member image'}
    width={300}
    src={member.image || '/images/user.png'}
    className='aspect-square object-cover'
    />
    <div onClick={PreventLinkAction}>
    <div className='absolute top-3 right-3 z-50'>
      <LikeButton targetId={member.id} hasLiked={hasliked} />
    </div>
    </div>
    <CardFooter className='flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient'>
    < div className ='flex flex-col text-white'>
     <span className='font-semibold'>
      {member.name},{member.dateOfBirth ? calculateAge(member.dateOfBirth):''}
      </span>
      <span className='font-sm'>{member.city}</span>

     </div>
    </CardFooter>
    </Card>
    
  );
}
