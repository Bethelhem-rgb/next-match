'use server';

import  { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/Schemas/registerSchema";
import {  User } from "@/generated/prisma";
import { ActionResult } from "@/types";
import bcrypt from "bcryptjs";
import { error } from "console";
import { LoginSchema } from "@/lib/Schemas/loginschema";
import { signIn } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";
export async function signInUser(data: LoginSchema): Promise<ActionResult<string>> {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });

    console.log(result);
 
    if (!result) {
      return { status: 'error', error: 'No response from authentication server' };
    }

    if (result.error) {
      console.error('Authentication error:', result.error);
      return { status: 'error', error: 'Invalid email or password' };
    }

    if (result.url) {
      // If we have a redirect URL, the login was successful
      return { status: 'success', data: result.url };
    }

    return { status: 'success', data: '/members' }; 
  } catch (error) {
    console.log( error);
    
    if (error instanceof AuthError) { 
      switch (error.type) {
        case 'CredentialsSignin':
          return { status: 'error', error: 'Invalid credentials' };
        default:
          return { status: 'error', error: 'Something went wrong' };
      }
    }else{
      return{status: 'error',error:'something else went wrong'}
    }
    
    
  }
}

  export async function  SignOutUser(){
    await SignOut({redirectTo: '/'});
  } 

export async function registerUser(data: RegisterSchema): Promise<ActionResult<Omit<User, "passwordHash">>> {
  try {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
      // Convert Zod errors to a string
      const errorMessage = validated.error.issues.map(issue => issue.message).join(", ");
      return { status: "error", error: errorMessage };
    }

    const { name, email, password } = validated.data;
    

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { status: "error", error: "User already exists" };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
      },
    });

    // remove passwordHash before returning
    const { passwordHash, ...userWithoutPassword } = newUser;

    return { status: "success", data: userWithoutPassword };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { status: "error", error: "A user with this email already exists" };
    }

    return { status: "error", error: "Failed to create user. Please try again." };
  }
}


export async function getUserByEmail(email: string){
    return prisma.user.findUnique({where:{email}});
}
export async function getUserById(id: string){
    return prisma.user.findUnique({where:{id}});
}


function nextAuthSignOut(arg0: { redirectTo: string; }) {
  throw new Error("Function not implemented.");
}

function SignOut(arg0: { redirectTo: string; }) {
  throw new Error("Function not implemented.");
}

