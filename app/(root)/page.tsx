

import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";


import MainFeedSection from "@/components/Feed/MainFeedSection";
import Image from "next/image";



export default async function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="flex justify-center items-start  w-full h-full lg:flex-row flex-col">
        <div className="h-full flex pt-32 flex-col lg:pl-0 pl-7  space-y-7  ">
          <h1 className="text-5xl   font-bold">Benveunto su Book Board</h1>
          <p className="text-xl lg:text-2xl">
            il tuo spazio creativo per vivere i libri
            <span className="block">come mai prima d’ora!</span>
          </p>
          <div className="p-3  border rounded-lg w-48 flex justify-center items-center">
            <p>Come funziona?</p>
          </div>
        </div>
        <div>
          <Image src='/assets/homeSection.jpg' alt="home page" width={700} height={500}></Image>
        </div>
      </div>
    </div>
  )

}
