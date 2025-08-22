import type { Metadata } from "next";
import "./globals.css";
import Topnav from "@/components/navbar/Topnav";
import  Providers  from "@/components/Providers";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Topnav />
          <main className="container mx-auto ">
          {children}
          </main>
         
        </Providers>
      </body>
    </html>
  );
}
