

import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";


import MainFeedSection from "@/components/Feed/MainFeedSection";
import Loading from "../loading";


export default async function page() {
  try {

    const user = await currentUser();
    if (!user) return notFound();
    
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');
    const currentUserInfo = {
      imageCurrentUser: userInfo.image,
      usernameViewer: userInfo.username,
      postLiked: userInfo.postLiked,
      _idUser: userInfo._id.toString(),
      idUsre: userInfo.id
    };
   if(user){
    return (
      <Suspense fallback={<Loading></Loading>}>
          <MainFeedSection currentUserInfo={currentUserInfo} />
      </Suspense>
    );
   }else{
    return(
      <div>
        <p>home page</p>
      </div>
    )
   }
    
  } catch (error) {
    console.error("Error loading page data:", error);
    return <div>Error loading page data</div>;
  }
}
