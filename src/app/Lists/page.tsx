import React from 'react'
import ListsTab from './Liststab'
import { fetchCurrentUserLikeIds, fetchLikedMembers } from '../actions/likeActions'
import { Member } from '@prisma/client';
type Props= {
  searchParams?:{type?: string};

};
export default async function ListsPage({searchParams}:Props)
{
  const allowedTypes =['source','target','mutual'] as const; 
  type MemberType = (typeof allowedTypes)[number]; 
  const rawType = searchParams?.type;
  const type: MemberType = allowedTypes.includes(rawType as MemberType)
    ? (rawType as MemberType)
    : 'source';

  let members: Member[] = [];
  let likeIds: string[] = [];
  
  try {
    members = await fetchLikedMembers(type);
    likeIds = await fetchCurrentUserLikeIds(); 
  } catch (error) {
    console.error('Error fetching likes/members:', error);
    // Optional: fallback to empty arrays if error occurs
  }
  return (
    <div>
      <h1>Members List</h1>
        <ListsTab members={members}likeIds={likeIds}/>
        
    </div>
  );
}
      
  

