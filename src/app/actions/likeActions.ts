"use server";

import prisma from "@/lib/prisma";
import { getAuthUserId } from "./authActions";

async function getCurrentMember() {
  const userId = await getAuthUserId();
  if (!userId) throw new Error("Not authenticated");
  const member = await prisma.member.findFirst({ where: { userId } });
  if (!member) throw new Error("No member profile found for this user");
  return member;
}
export async function toggleLikeMember(targetMemberId: string, isLiked: boolean) {
  
  
  try {
    
   const userId = await getAuthUserId();
   if (!userId) throw new Error('Not authenticated');
   
    // Find current user's member record
    const sourceMember = await prisma.member.findUnique({
      where: { userId },
    });
    if (!sourceMember) throw new Error('Source member not found for this user');

    // Ensure target member exists
    const targetMember = await prisma.member.findUnique({
      where: { id: targetMemberId },
    });
    if (!targetMember) throw new Error('Target member not found');

    // Check if Like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        sourceMemberId_targetMemberId: {
          sourceMemberId: sourceMember.id,
          targetMemberId,
        },
      },
    });

    //if (!isLiked) {
      // Remove like
      //
   // } else {
      // Remove existing like
      if(existingLike){
      await prisma.like.delete({
        where: {
           sourceMemberId_targetMemberId: {
          sourceMemberId: sourceMember.id,
          targetMemberId,
        },
      },
      });
    
  
    console.log(`💔 Unliked member ${targetMemberId}`);
    
  } else {

await prisma.like.create({
        data: {
          
            sourceMemberId: sourceMember.id,
            targetMemberId,
          },
        
     });
     console.log(`❤️ Liked member ${targetMemberId}`);
    }
       return { success: true };
  } catch (error) {
    console.error('Error in toggleLikeMember:', error);
    throw error;
  }
}
export async function fetchCurrentUserLikeIds() {
  
    const member = await getCurrentMember();

    const likes = await prisma.like.findMany({
      where: {
        sourceMemberId: member.id,
      },
      select: { targetMemberId: true },
    });
    return likes.map((like) => like.targetMemberId);
  }

  // Fix this and you will see list of liked members
  export async function fetchLikeMembers( type = 'source') {
  
    const member = await getCurrentMember();
    switch(type){
      case 'source':
        return await fetchSourceLikes(member.id);

        case 'target':
          return await fetchTargetLikes(member.id);

          case 'mutual':
            return await fetchMutualLikes(member.id);
            default:
              return [];
    }

  } 
async function fetchSourceLikes(memberId: string) {
const likes = await prisma.like.findMany({
  where:{sourceMemberId:memberId},
  include:{targetMember:true}
})
return likes.map((like)=>like.targetMember);
}
async function fetchTargetLikes(memberId: string) {
  const likes = await prisma.like.findMany({
  where:{targetMemberId:memberId},
  include:{sourceMember:true}
})
return likes.map((like)=>like.sourceMember);
}
async function fetchMutualLikes(memberId: string) {
  const likedMembers = await prisma.like.findMany({
    where:{sourceMemberId:memberId},
    select:{targetMemberId:true}
  })
  const likedIds = likedMembers.map((x)=> x.targetMemberId);
  const mutuals = await prisma .like.findMany({
    where:{
      AND:[
        {targetMemberId:memberId},
        {sourceMemberId:{in: likedIds}}
      ]
    },
    include: {sourceMember: true}
  });
  return mutuals.map((like)=>like.sourceMember);
}

