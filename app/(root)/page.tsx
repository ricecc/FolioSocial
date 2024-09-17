// app/page.tsx
import HomePageFeed from "@/components/Feed/HomePageFeed";
import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Home() {
  try {
    const user = await currentUser();
    if (!user) return notFound();

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const initialFeed = await fetchPostsFeed(1, 3);

    const currentUserInfo = {
      imageCurrentUser: userInfo.image,
      usernameViewer: userInfo.username,
      postLiked: userInfo.postLiked,
      userId: userInfo._id.toString()
    };

    return (
      <Suspense fallback={<Loading></Loading>}>
        <HomePageFeed initialPosts={initialFeed.posts} currentUserInfo={currentUserInfo} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error loading page data:", error);
    return <div>Error loading page data</div>;
  }
}
