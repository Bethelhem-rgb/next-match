'use server';

import  { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/Schemas/registerSchema";

import bcrypt from "bcryptjs";

import { LoginSchema } from "@/lib/Schemas/loginschema";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { ActionResult } from "@/types";
import { User}from '@prisma/client';


export async function signInUser(data: LoginSchema):Promise<ActionResult<string>>{
  try {
    const result = await signIn('credentials',{
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log(result);
    return {status:'success',data: 'Logged in'};
  } catch (error) {
    console.error(error);
    if(error instanceof AuthError){
      switch(error.type){
        case 'CredentialsSignin':
          return {status:'error',error:'Invalid credentials'};
          

          default:
       return {status:'error',error:'Something went wrong'};
          
      }
    } else{
      return {status:'error',error:'Something else went wrong'};
    }
  }
}
export async function signOutUser(){
  await signOut({redirectTo: '/'});
}
export async function registerUser(data: RegisterSchema):Promise<ActionResult<User>>{
  try {
    const validated = registerSchema.safeParse(data);
  if (!validated.success){
    
    const issues = validated.error.issues; 
return { status:'error',error: issues.map((e) => e.message).join(',')};
  }
  const {name,email,password}= validated.data;
  const hashedPassword = await bcrypt.hash(password,10);
  const existingUser = await prisma.user.findUnique({
    where:{email}
  });
  if(existingUser) return {status:'error',error:'User already exists'};
  const newUser = await prisma.$transaction(async (tx)=>{
    const createdUser = await tx.user.create({
  
    data: {
      name,
      email,
      passwordHash:hashedPassword
    }
  });
  await tx.member.create({
    data: {
      userId:createdUser.id,
      name:createdUser.name,
      gender:'Unknown',
      dateOfBirth: new Date('2000-01-01'),
      city:'Unknown',
      country:'Unknown',
    }
  })
  return createdUser;
});
return {status: 'success',data: newUser};
  } catch (error) {
    console.log(error);
    return{status:'error',error:'Something went wrong'};
  }
  
    }
    export async function getUserByEmail(email: string){
      return prisma.user.findUnique({where:{email}});

    }
    export async function getUserById(id: string){
      return prisma.user.findUnique({where:{id}});
    }
  
  export async function getAuthUserId(){
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) throw new Error('Unauthorised');
    return userId;
  }

  