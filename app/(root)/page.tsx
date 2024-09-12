

import { fetchPostsFeed } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Post from "@/components/post/Post";
import NewFeedPost from "@/components/post/NewFeedPost";
export default async function Home() {

  let feed;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')
  if (userInfo)
    feed = await fetchPostsFeed();

  {/* <Post 
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
            /> */}

  return (
    <>
      <div className="h-full gap-x-7 sm:w-full sm:gap-x-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3   mx-auto  container mt-3 ">
        {feed && feed.length > 0 ? (
          feed.map((post, index) => (
            <NewFeedPost
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
    </>
  );
}
