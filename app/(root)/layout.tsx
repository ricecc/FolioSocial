import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import TopNavBar from "@/components/navigation/TopNavBar";
import Footer from "@/components/navigation/Footer";
import { Navbar } from "flowbite-react";
import { EdgeStoreProvider } from "@/lib/edgestore";


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
        <body className={inter.className}>
          <main className="flex flex-col relative ">
            <TopNavBar></TopNavBar>
            <section className="main-container fontNew font-light">
              <EdgeStoreProvider>
                {children}
              </EdgeStoreProvider>
            </section>
            <Footer />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
