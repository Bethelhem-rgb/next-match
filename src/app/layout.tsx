import type { Metadata } from "next";
import "./globals.css";
import Topnav from "@/components/navbar/Topnav";
import Providers from "@/components/Providers";
import{Inter, JetBrains_Mono}from "next/font/google";
const inter = Inter({ subsets: ["latin"], weight: ["400","600"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400"] });
export const metadata: Metadata = {
  title: "Next Match",
  description: "Find your next match",
  icons: {
    icon: "/favicon.ico",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className= {inter.className}>
      <body className={jetbrains.className}>
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
