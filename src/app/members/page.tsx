'use server';
import React from 'react'
import MemberCard from './MemberCard';

import prisma from '@/lib/prisma';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';
import { getMembers } from '../actions/memberActions';



export default async function MembersPage() {
  const members = await getMembers();
  const likeIds = await fetchCurrentUserLikeIds();
    
    
     
      
  return (
     <div className='mt-10 grid grid-cols md:grid-cols-3 xl:grid-cols-6 gap-8'>
        { members && members.map(member =>(
          <MemberCard member ={member}key={member.id} likeIds={likeIds}   />
          
        ))}

    </div>
  )
}
