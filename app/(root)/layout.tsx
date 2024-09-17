import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";

import Footer from "@/components/navigation/Footer";
import { Toaster } from "@/components/ui/sonner"
import { EdgeStoreProvider } from "@/lib/edgestore";
import MobileTopNavBar from "@/components/navigation/MobileTopNavBar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Folio',
  description: 'choose the next book',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Protest+Guerrilla&display=swap" rel="stylesheet"/>
        </head>
        <body className={inter.className}>
          <main className="flex flex-col relative ">
          <MobileTopNavBar/>
            <section className="main-container font-fontStrano">
              <EdgeStoreProvider>
             
                {children}
             
              </EdgeStoreProvider>
            </section>
            <Footer />
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
