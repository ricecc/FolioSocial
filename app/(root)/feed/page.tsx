

import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";


import MainFeedSection from "@/components/Feed/MainFeedSection";
import Loading from "./loading";

export default async function page() {
  try {
    const user = await currentUser();
    if (!user) return notFound();
    
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');
    
    const initialFeed = await fetchPostsFeed(1, 3);
    
    const currentUserInfo = {
      imageCurrentUser: user.imageUrl,
      usernameViewer: userInfo.username,
      postLiked: userInfo.postLiked,
      _idUser: userInfo._id.toString(),
      idUsre: userInfo.id
    };
  
    return (
      <Suspense fallback={<Loading></Loading>}>
          <MainFeedSection currentUserInfo={currentUserInfo} initalFeed={initialFeed.posts}/>
      </Suspense>
    );
  
    
  } catch (error) {
    console.error("Error loading page data:", error);
    return <div>Error loading page data</div>;
  }
}
