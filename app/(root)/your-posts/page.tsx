

import Post from "@/components/post/Post";
import MainSectionProfile from "@/components/UserProfile/MainSectionProfile";
import { UserPosts } from "@/components/UserProfile/UserPosts";
import { fetchUser, fetchUserInfoForProfile } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userData = await fetchUserInfoForProfile(user.id)
 
  if (!userData?.onboarded) redirect('/onboarding')

  return (
    <div className="flex justify-center items-center w-screen flex-col ">
      <div className="w-full  h-full ">
        <div className="flex flex-col justify-center items-center  w-full  bg-slate-100 h-60 ">
          <div className="h-auto  flex flex-col justify-center items-center md:w-1/4 md:ml-8  mb-3 md:mb-0 bg-slate-100 ">
            <img src={userData.image} className="w-24 h-24 rounded-full object-cover  border-spacing-52" alt=""/>
            <div>
              <p className="text-xl font-bold pt-2">{user.firstName} {user.lastName}</p>
              <p className="text-sm font-sans pb-2">@{userData.username} - {0} likes </p>
            </div>
          </div>
        </div>
      </div>
        <MainSectionProfile
          posts={userData.posts}
          quoteSaved={userData.quoteSaved}
          reviewSaved={userData.reviewSaved}
          savedBooks={userData.savedBooks}
          imageSaved={userData.imageSaved} />
    </div>
  )
}

export default Page
