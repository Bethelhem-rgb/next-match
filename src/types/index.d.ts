import { ZodIssue } from 'zod';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

type ActionResult<T> =
  { status: 'success', data: T } | { status: 'error', error: string | ZodIssue[] };