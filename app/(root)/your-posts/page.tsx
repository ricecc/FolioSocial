
import Post from "@/components/post/Post";
import { UserPosts } from "@/components/post/UserPosts";
import { fetchUser, fetchUserPosts, fetchUserSavedBooks } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { UserInfo } from "os";
import { use } from "react";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')
  let userPosts = await fetchUserPosts(user.id);
  let userSavedBooks = await fetchUserSavedBooks(user.id)

  

  function filterUserPostsData(posts: any[]) {
    return posts.map((post: any) => ({
      _id: post._id.toString(),
      userId: userInfo.id,
      username: userInfo.username,
      userImage: userInfo.image,
      book: post.book._id.toString(),
      review: post.review,
      likeCount: post.like.length,
      image: post.image,
      createdAt: post.createdAt.toString(),
      postAuthorId:post.author._id.toString()
    }));
  }

  function filterUserSavedBooks(books: any[]) {
    return books.map((book: any) => ({
      id: book._id.toString(),
      largeImage: book.largeImage
    }));
  }

  function totalLikes(userPosts: any) {
    let totaleLike = 0;

    for (let i = 0; i < userPosts.length; i++) {
      totaleLike += userPosts[i].like.length;
    }

    return totaleLike;
  }

  return (
    <div className="flex justify-center ">
      <div className="w-full relative h-full ">
        <div className="flex flex-col justify-center items-center  w-full px-5 md:mt-9 ">
          <div className="h-auto w-full flex flex-col justify-center items-center md:w-1/4 md:ml-8  mb-3 md:mb-0 ">
            <img src={userInfo.image} className="w-24 h-24 rounded-full  border-spacing-52" alt="" />
            <div>
              <p className="text-xl font-bold pt-2">{user.firstName} {user.lastName}</p>
              <p className="text-sm font-sans pb-2">@{userPosts.username} - {totalLikes(userPosts)} likes </p>
            </div>
          </div>
            
          <UserPosts userPosts={filterUserPostsData(userPosts.posts)} userSavedBooks={filterUserSavedBooks(userSavedBooks.savedBooks)} />
        </div>
      </div>
    </div>
  )
}

export default Page
