

import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Post from "@/components/post/Post";

import MainFeedSection from "@/components/Feed/MainFeedSection";
import { Suspense } from "react";
export default async function Home() {

  let feed;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')
  if (userInfo)
    feed = await fetchPostsFeed();
 
  function filterUserLiked(users: any) {
    return users.map((user: any) => (
      {
        id: user.id,
        image: user.image,
        username: user.username,
        name:user.name,
        lastName:user.lastName
      }
    ))
  }
  return (

    <div className="h-full gap-8  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  mx-auto mt-3 flex justify-center  ">
      {feed && feed.length > 0 ? (
        feed.map((post, index) => (
         
            <MainFeedSection
              usersLiked={filterUserLiked(post.like)}
              isLiked={userInfo.postLiked.includes(post._id.toString())}
              index={index}
              postId={post._id.toString()}
              quote={post.quotes[0] ? post.quotes[0].quote : ""}
              imagePost={post.postImages[0]}
              bookCover={post.image}
              bookTitle={post.book.title}
              bookAuthor={post.book.author}
              bookId={post.book._id.toString()}
              userImage={post.author.image}
              userId={userInfo._id.toString()}
              username={post.author.username}
              postAuthorId={post.author.id}
              postLike={post.like.length}
              isSaved={userInfo.savedBooks.includes(post.book._id)}
            />
         
        ))
      ) : (
        <h1>Il feed è vuoto</h1>
      )}
    </div>


  );
}
