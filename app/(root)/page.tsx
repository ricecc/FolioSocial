

import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Post from "@/components/post/Post";
export default async function Home() {
 
  let feed;
  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboarding')
  if(userInfo)
     feed = await fetchPostsFeed();

  return (
    <>
      <div className="h-full gap-x-7 sm:w-full sm:gap-x-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  mx-auto  container mt-3 ">
      {feed && feed.length > 0 ? (
          feed.map((post) => (
            <Post 
              key={post._id.toString()} 
              bookId={post.book._id.toString()}
              userId={userInfo._id.toString()}
              src={post.image} 
              alt={`Image of ${post.book.title}`}
              userImage={post.author.image}
              link={`/post/${post._id.toString()}`}
              username={post.author.username}
              postAuthorId={post.author.id}
              postLike={post.like.length}
              saved={userInfo.savedBooks.includes(post.book._id)}
            />
          ))
  ) : (
    <h1>Il feed è vuoto</h1>
  )}
      </div>
    </>
  );
}
