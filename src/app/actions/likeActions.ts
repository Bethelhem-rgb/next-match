'use server';
import prisma from "@/lib/prisma";
import { getAuthUserId } from "./authActions";

export async function toggleLikeMember(targetMemberId: string, isLiked: boolean) { 
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error('Not authenticated');

    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Logged-in user not found');

    // Ensure source member exists
    let sourceMember = await prisma.member.findFirst({ where: { userId } });
    if (!sourceMember) {
      sourceMember = await prisma.member.create({
        data: {
          userId,
          name: "Unknown",
          gender: "unknown",
          dateOfBirth: new Date("2000-01-01"),
          city: "Unknown",
          country: "Unknown",
        },
      });
    }

    // Ensure target member exists
    const targetMember = await prisma.member.findUnique({ where: { id: targetMemberId } });
    if (!targetMember) throw new Error("Target member does not exist");

    if (isLiked) {
      await prisma.like.delete({
        where: {
          sourceMemberId_targetMemberId: {
            sourceMemberId: sourceMember.id,
            targetMemberId: targetMember.id,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          sourceMemberId: sourceMember.id,
          targetMemberId: targetMember.id,
        },
      });
    }
  } catch (error) {
    console.error("toggleLikeMember error:", error);
    throw error;
  }
}

export async function fetchCurrentUserLikeIds() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return [];

    const member = await prisma.member.findFirst({ where: { userId } });
    if (!member) return [];

    const likes = await prisma.like.findMany({
      where: { sourceMemberId: member.id },
      select: { targetMemberId: true },
    });

    return likes.map(like => like.targetMemberId);
  } catch (error) {
    console.error("fetchCurrentUserLikeIds error:", error);
    throw error;
  }
}

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

// --- Helpers ---
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
