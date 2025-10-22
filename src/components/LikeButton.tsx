'use client';
import { toggleLikeMember } from '@/app/actions/likeActions';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import {AiFillHeart, AiOutlineHeart} from 'react-icons/ai';
type Props = {
    targetId: string;
    hasLiked: boolean;
    refreshLikes?:()=>void;
};
export default function LikeButton({targetId,hasLiked,refreshLikes}: Props) {
    const [liked,setLiked]= useState(hasLiked);
    async function toggleLike(){
       setLiked(!liked);
       
       await toggleLikeMember(targetId,liked);
        refreshLikes?.();
    
    }
  return (
    <div onClick = {toggleLike} className='relative hover: opacity-80 transition cursor-pointer'>
        <AiOutlineHeart size={28} className='fill-white absolute -top-[2px] -right-[2px]' />
        <AiFillHeart size ={24} className={hasLiked ? 'fill-rose-500':'fill-neutral-500 /70'}/>

        </div>
  );
}
