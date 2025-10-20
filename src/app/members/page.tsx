
import React from 'react'
import MemberCard from './MemberCard';
import { getMembers} from '../actions/memberActions';
import prisma from '@/lib/prisma';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';


export default async function MembersPage() {
  const members = await prisma.member.findMany();
  const likeIds = await fetchCurrentUserLikeIds();
  return (
    <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8'>
        {members && members.map(member =>(
          <MemberCard member={member} key={member.id} likeIds={likeIds}   />
          
        ))}

    </div>
  )
}
