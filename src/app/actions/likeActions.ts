'use server';

import prisma from "@/lib/prisma";
import { getAuthUserId } from "./authActions";
import { auth } from "@/auth";

// Toggle like/unlike for a member
export async function toggleLikeMember(targetMemberId: string, isLiked: boolean) { 
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Not authenticated");

    // Find source member (the logged-in user's member record)
    const sourceMember = await prisma.member.findFirst({
      where: { userId },
    });

    if (!sourceMember) throw new Error("Source member not found");

    if (isLiked) {
      // Unlike (delete)
      await prisma.like.delete({
        where: {
          sourceMemberId_targetMemberId: {
            sourceMemberId: sourceMember.id,
            targetMemberId,
          },
        },
      });
    } else {
      // Like (create)
      await prisma.like.create({
        data: {
          sourceMemberId: sourceMember.id,
          targetMemberId,
        },
      });
    }

    // Optional: return updated like count
    const likeCount = await prisma.like.count({
      where: { targetMemberId },
    });

    return { success: true, liked: !isLiked, likeCount };

  } catch (error) {
    console.error("toggleLikeMember error:", error);
    throw error;
  }
}

// --- Fetch IDs of liked members by current user ---
export async function fetchCurrentUserLikeIds() {
  try {
    const userId = await getAuthUserId(); 
    if (!userId) return [];

    const sourceMember = await prisma.member.findFirst({
      where: { userId },
    });

    if (!sourceMember) return [];

    const likeIds = await prisma.like.findMany({
      where: { sourceMemberId: sourceMember.id },
      select: { targetMemberId: true },
    });

    return likeIds.map(like => like.targetMemberId);

  } catch (error) {
    console.error("fetchCurrentUserLikeIds error:", error);
    throw error;
  }
}

// --- Fetch liked members (source / target / mutual) ---
export async function fetchLikedMembers(type: 'source' | 'target' | 'mutual' = 'source') {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Not authenticated");

    const member = await prisma.member.findFirst({ where: { userId } });
    if (!member) throw new Error("Logged-in user is not a member");

    switch (type) {
      case 'source':
        return await fetchSourceLikes(member.id);
      case 'target':
        return await fetchTargetLikes(member.id);
      case 'mutual':
        return await fetchMutualLikes(member.id);
      default:
        return [];
    }

  } catch (error) {
    console.error("fetchLikedMembers error:", error);
    throw error;
  }
}

// --- Helper functions ---
async function fetchSourceLikes(memberId: string) {
  const list = await prisma.like.findMany({
    where: { sourceMemberId: memberId },
    include: { targetMember: true },
  });
  return list.map(x => x.targetMember);
}

async function fetchTargetLikes(memberId: string) {
  const list = await prisma.like.findMany({
    where: { targetMemberId: memberId },
    include: { sourceMember: true },
  });
  return list.map(x => x.sourceMember);
}

async function fetchMutualLikes(memberId: string) {
  const liked = await prisma.like.findMany({
    where: { sourceMemberId: memberId },
    select: { targetMemberId: true },
  });
  const likeIds = liked.map(x => x.targetMemberId);

  const mutual = await prisma.like.findMany({
    where: {
      targetMemberId: memberId,
      sourceMemberId: { in: likeIds },
    },
    include: { sourceMember: true },
  });

  return mutual.map(x => x.sourceMember);
}
