

import Post from "@/components/post/Post";
import MainSectionProfile from "@/components/UserProfile/MainSectionProfile";
import { UserPosts } from "@/components/UserProfile/UserPosts";
import { fetchUser, fetchUserInfoForProfile } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userData = await fetchUserInfoForProfile(user.id)

  if (!userData?.onboarded) redirect('/onboarding')


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



  return (
    <div className="flex justify-center items-center w-screen flex-col ">
      <div className="w-full  h-full ">
        <div className="flex flex-col justify-center items-center  w-full  bg-slate-100 h-60 ">
          <div className="h-auto  flex flex-col justify-center items-center md:w-1/4 md:ml-8  mb-3 md:mb-0 bg-slate-100 ">
            <img src={userData.image} className="w-24 h-24 rounded-full object-cover  border-spacing-52" alt="" />
            <div>
              <p className="text-xl font-bold pt-2">{user.firstName} {user.lastName}</p>
              <p className="text-sm font-sans pb-2">@{userData.username} - {0} likes </p>
            </div>
          </div>
        </div>
      </div>
      <MainSectionProfile
            posts={filterUserPosts(userData.posts)}
            quoteSaved={filterQuoteLiked(userData.quoteSaved)}
            reviewSaved={filterReviewLiked(userData.reviewSaved)}
            savedBooks={filterSavedBooks(userData.savedBooks)}
            imageSaved={userData.imageSaved} />
    </div>
  )
}

export default Page
