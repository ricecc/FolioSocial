import { currentUser } from "@clerk/nextjs";
import { fetchUser, fetchUserInfoForProfile, fetchUserPosts, fetchUserSavedBooks } from "@/lib/actions/user.actions";
import MainSectionProfile from "@/components/UserProfile/MainSectionProfile";


async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userToWatch = await fetchUserInfoForProfile(params.id)
  function filterUserPosts(posts: any) {
    return posts.map((post: any) => (
      {
        id: post._id.toString(),
        book: {
          id: post.book._id.toString(),
          title: post.book.title,
          author: post.book.author,
        },
        image: post.image
      }
    ))
  }

  function filterQuoteLiked(quoteSaved: any) {
    return quoteSaved.map((quote: any) => ({
      id: quote._id.toString(),
      page: quote.page,
      quote: quote.quote
    }))
  }

  function filterReviewLiked(reviewSaved: any) {
    return reviewSaved.map((review: any) => ({
      id: review._id.toString(),
      title: review.title,
      review: review.review
    }))
  }

  function filterSavedBooks(savedBooks: any) {
    return savedBooks.map((savedBook: any) => ({
      id: savedBook._id.toString(),
      title:savedBook.title,
      author:savedBook.author,
      largeImage:savedBook.largeImage
      
    }))
  }
  console.log(userToWatch)
  {/**  <UserPosts userPosts={filterUserPostsData(userPosts.posts)} userSavedBooks={filterUserSavedBooks(userSavedBooks.savedBooks)} /> */ }
  return (
    <div className="flex justify-center items-center w-screen flex-col ">
      <div className="w-full  h-full ">
        <div className="flex flex-col justify-center items-center  w-full  bg-slate-100 h-60 ">
          <div className="h-auto  flex flex-col justify-center items-center md:w-1/4 md:ml-8  mb-3 md:mb-0 bg-slate-100 ">
            <img src={userToWatch.image} className="w-24 h-24 rounded-full object-cover  border-spacing-52" alt="" />
            <div>
              {userToWatch.lastName?(
                <p className="text-xl font-bold pt-2">{userToWatch.name} {userToWatch.lastName}</p>
              ):(
                <p className="text-xl font-bold pt-2 flex justify-center items-center"><span>{userToWatch.name}</span></p>
              )}
           
              <p className="text-sm font-sans pb-2">@{userToWatch.username} - {0} likes </p>
            </div>
          </div>
        </div>
      </div>
      <MainSectionProfile
            posts={filterUserPosts(userToWatch.posts)}
            quoteSaved={filterQuoteLiked(userToWatch.quoteSaved)}
            reviewSaved={filterReviewLiked(userToWatch.reviewSaved)}
            savedBooks={filterSavedBooks(userToWatch.savedBooks)}
            imageSaved={userToWatch.imageSaved} />
    </div>
  )
}


export default page;