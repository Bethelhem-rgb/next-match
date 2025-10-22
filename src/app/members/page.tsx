'use server';
import React from 'react'
import MemberCard from './MemberCard';

import prisma from '@/lib/prisma';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';


export default async function MembersPage() {
  const [members,likeIds] = await Promise.all([
    prisma.member.findMany({
      orderBy:{createdAt:'desc'},
    }),
    fetchCurrentUserLikeIds(),
  ]);
  if(!members?. length){
    return(
      <div className='text-center text-gray-500 py-10'>

      </div>
    )
  }
  return (
    <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
        { members.map((member) =>(
          <MemberCard key={member.id} member={member} likeIds={likeIds}   />
          
        ))}

    </div>
  )
}
