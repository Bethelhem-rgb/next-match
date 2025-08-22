'use client';
import { HeroUIProvider } from '@heroui/system';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastContainer position='bottom-right' hideProgressBar className='Z-50' />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}

 