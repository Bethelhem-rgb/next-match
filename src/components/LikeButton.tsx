'use client';
import { toggleLikeMember } from '@/app/actions/likeActions';

import React, { useState ,useTransition} from 'react'
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai';
type Props = {
    targetId: string;
    hasLiked: boolean;
    refreshLikes?:()=>void;
};
export default function LikeButton({targetId,hasLiked,refreshLikes}: Props) {
    const [liked,setLiked]= useState(hasLiked);
    const [isPending,startTransition]= useTransition();
    async function handleToggleLike() {
      const newLiked = !liked;
      console.log('targetId',targetId);
      setLiked(newLiked);
      try {
          await toggleLikeMember(targetId, newLiked);
           startTransition(() => refreshLikes?.()); 
      } catch (error) {
          console.error('error toggling like:', error);
          setLiked(!newLiked); // revert on error
      }
}
  return (
    <div onClick = { handleToggleLike} className= {`relative  cursor-pointer transition ${
      
      isPending ? 'opacity-60' :'hover:opacity-80'}`}
      title={liked ? 'unlike' : 'like'}>
        <AiOutlineHeart size={28} className='fill-white absolute -top-[2px] -right-[2px]' />
        <AiFillHeart size ={24}
         className={liked ? 'fill-rose-500':'fill-neutral-500 /70'}/>

        </div>
  );
}
