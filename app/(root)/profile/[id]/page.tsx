import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUserPosts, fetchUserSavedBooks, saveBook } from "@/lib/actions/user.actions";
import { UserPosts } from "@/components/post/UserPosts";

async function page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userToWatch = await fetchUser(params.id)
  let userPosts = await fetchUserPosts(params.id);
 
  let userSavedBooks = await fetchUserSavedBooks(params.id)
  function filterUserPostsData(posts: any[]) {
    return posts.map((post: any) => ({
      _id: post._id.toString(),
      userId: userToWatch.id,
      username: userToWatch.username,
      userImage: userToWatch.image,
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
    return(
        <div className="flex justify-center ">
        <div className="w-full relative h-full ">
          <div className="flex flex-col justify-center items-center  w-full px-5 md:mt-9 ">
            <div className="h-auto w-full flex flex-col justify-center items-center md:w-1/4 md:ml-8  mb-3 md:mb-0 ">
              <img src={userToWatch.image} className="w-24 h-24 rounded-full  border-spacing-52" alt="" />
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


export default page;