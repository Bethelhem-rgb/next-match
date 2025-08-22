import Credentials  from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./lib/Schemas/loginschema"
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";
 
export default {
  providers: [Credentials({
    name:'Credentials',
    async authorize(creds){
      try {
        const validated = loginSchema.safeParse(creds);
        if (!validated.success) {
          console.log('Validation failed:', validated.error);
          return null;
        }
        
        const { email, password } = validated.data;
        console.log('Attempting login for email:', email);
        
        const user = await getUserByEmail(email);
        if (!user) {
          console.log('User not found for email:', email);
          return null;
        }
        
        console.log('User found, comparing passwords...');
        const isPasswordValid = await compare(password, user.passwordHash);
        if (!isPasswordValid) {
          console.log('Invalid password for user:', email);
          return null;
        }
        
        console.log('Login successful for user:', email);
        return user;
      } catch (error) {
        console.error('Error during authentication:', error);
        return null;
      }
    }
  })],
} satisfies NextAuthConfig