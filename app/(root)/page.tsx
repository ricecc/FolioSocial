// app/page.tsx
import HomePageFeed from "@/components/Feed/HomePageFeed";
import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const initialFeed = await fetchPostsFeed(1, 3);
  
  const currentUserInfo={
    imageCurrentUser:userInfo.image,
    usernameViewer:userInfo.username,
    postLiked:userInfo.postLiked,
    userId:userInfo._id.toString()
  }
  return (
    <HomePageFeed initialPosts={initialFeed.posts} currentUserInfo={currentUserInfo} />
  );
}
