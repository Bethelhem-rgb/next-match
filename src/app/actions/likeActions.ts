'use server';
import prisma from "@/lib/prisma";
import { getAuthUserId } from "./authActions";


export async function toggleLikeMember(targetMemberId: string, isLiked: boolean){ 
   try {
    
    
    const userId = await getAuthUserId();
        
if(!userId)throw new  Error('Not authenticated');
          
     if (isLiked) { 
       await prisma.like.delete ({ 
          where: {
              sourceMemberId_targetMemberId:{
                  sourceMemberId:userId,
                  targetMemberId: targetMemberId, 
             }, 
          },
      });
                
    } else {
        await prisma.like.create ({
           data: {
             sourceMemberId: userId,
             targetMemberId : targetMemberId,
         },
      });
    } 
     } catch (error) { 
         console.error( error); 
         throw error;

     }                                              
   } 
 export async function fetchCurrentUserLikeIds(){
   try { 
      const userId = await getAuthUserId();
       const likeIds = await prisma.like.findMany({
          where:{
              sourceMemberId:userId
          },
          select: {
             targetMemberId: true
         },
                              
                              
       })
      return likeIds.map(like=> like.targetMemberId);
   } catch (error) {
       console.error(error);
       throw error;
  }
}
export async function fetchLikedMembers(type='source'){
  try {
      const userId = await getAuthUserId();
      switch(type){
         case 'source':
               return await fetchSourceLikes(userId);
         case 'target':
               return await fetchTargetLikes(userId); 
         case 'mutual':
                                
               return await fetchMutualLikes(userId);
         default:
             return[];

      }
                            
 } catch (error) {
  console.error(error);
  throw error
 }
}
 async function fetchSourceLikes(userId: string) {
    const list = await prisma.like.findMany({
        where:{sourceMemberId:userId},
        select:{targetMember:true} ,                     
    }) 
    return list.map(x=>x.targetMember); 
 }  
async function fetchTargetLikes(userId: string) {
   const list =await prisma.like.findMany({
       where:{targetMemberId:userId},
       select:{sourceMember:true},
  });
  return list.map(x=>x.sourceMember);

}
 
async function fetchMutualLikes(userId: string){
  const liked = await prisma .like.findMany({
     where: { sourceMemberId: userId },
                              
     select: { targetMemberId: true},
  });
  const likeIds = liked.map(x=>x.targetMemberId);

   const mutual = await prisma.like.findMany({
       where:{
           AND:[
              {targetMemberId: userId},
              {sourceMemberId:{in: likeIds}},
           ],
        }, 
         select:{sourceMember: true},
   });
    return mutual.map(x=>x.sourceMember);
}

 
   
                           
                          

            

