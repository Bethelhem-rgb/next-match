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
    async function handletoggleLike(){
       const newLiked = !liked ;

       setLiked(newLiked);
       try{
       
       await toggleLikeMember(targetId,liked);
       startTransition(() => {
        refreshLikes?.();
    
    });
  } catch (error){
    console.error('error toggling like:',error);
    setLiked(!newLiked);
  }
  }
  return (
    <div onClick = {handletoggleLike} className= {`relative  cursor-pointer transition ${
      
      isPending ? 'opacity-60' :'hover:opacity-80'}`}
      title={liked ? 'unlike' : 'like'}>
        <AiOutlineHeart size={28} className='fill-white absolute -top-[2px] -right-[2px]' />
        <AiFillHeart size ={24} className={hasLiked ? 'fill-rose-500':'fill-neutral-500 /70'}/>

        </div>
  );
}
