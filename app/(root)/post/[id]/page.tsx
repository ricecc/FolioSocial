import { fetchPostById, fetchSimilarPosts } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import Post from "@/components/post/Post";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import PostWantToRead from "@/components/saveButton/PostWantToRead";
import HeartToggle from "@/components/ui/HeartToggle";
import PostContent from "@/components/post/PostContent";


async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  const post = await fetchPostById(params.id)
  const suggestPost = await fetchSimilarPosts(params.id);

  const highestScorePost = suggestPost.reduce((prev, current) => {
    return (prev.score > current.score) ? prev : current;
  }, suggestPost[0]);

  
  const postContentProps = {
    authorImage: post.author.image,
    authorUsername: post.author.username,
    review: post.review,
    quotes: post.quotes
  };
  return (
    <div className="">
      <section className="flex md:flex-row flex-col-reverse h-5/6 w-full  ">
        <div className="flex md:w-1/2 h-full flex-col w-full   items-center md:justify-start justify-center  mt-7 md:mt-0  py-5 md:py-0  rounded-lg  ">
         <PostContent post={postContentProps}/>
          <div className="h-1/3  w-full flex flex-col  ">
            <div className="flex flex-row items-ceenter justify-between  p-10" >
              <div className="flex flex-row space-x-3 max-w-80 ">
                {post.tags?.map((tag: any) => (
                  <Link href={`/tagFeed/${tag.name}/${tag._id.toString()}`}>
                    <p className="bg-slate-200 px-3 font-fontMain text-start flex items-center justify-start pt-0.6em pr-0.8em pb-0.6em pl-0.8em rounded-md hover:text-hoverTag cursor-pointer ">{tag.name}</p>
                  </Link>
                ))}
              </div>
              <div className="flex items-center">
                <HeartToggle fromUserId={userInfo._id.toString()} toPostId={post._id.toString()} numLike={post.like.length} liked={post.like.includes(userInfo._id)} />
              </div>

            </div>
            <div >
              <PostWantToRead userId={userInfo._id.toString()} bookId={post.book._id.toString()} saved={userInfo.savedBooks.includes(post.book._id)} />
              <Link href={post.affiliateUrl}>

                <div className="h-16 bg-backgroundButton text-white hover:bg-white hover:text-backgroundButton flex items-center justify-between px-8 border-t border-b  border-slate-600 ">
                  <p className="font-fontMain text-2xl">Acquista</p>
                  <img src="/assets/arrow.svg" alt="notification" width={24} height={24} className="cursor-pointer object-contain" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex md:w-1/2 h-auto items-center justify-center md:justify-center border-l pt-4 md:pt-0 border-b border-slate-600  bg-zinc-50 ">
          <div className="flex flex-col space-y-7 justify-center items-center">
            <img src={post.image} className="w-60 shadow-2xl   " alt="" />
            <div className="flex flex-col text-sm ">
              <p className="font-bold  ">{post.book.title}</p>
              <p className="font-serif ">{post.book.author}</p>
            </div>
          </div>
        </div>

      </section>
      <div className="flex justify-center items center mt-10">
        <p className="text-lg font-bold font-fontMain   p-6 ">Ti potrebbero interessare</p>
      </div>
      <section className=" h-screen mt-10 rounded-lg  container">
        <div className="gap-x-7 sm:w-full sm:gap-x-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  mx-auto mt-3">
          {highestScorePost ? (
            <Post
              saved={userInfo.savedBooks.includes(highestScorePost.book._id)}
              bookId={highestScorePost.book._id.toString()}
              userId={userInfo._id.toString()}
              src={highestScorePost.image}
              alt={`Image of ${highestScorePost.book.title}`}
              userImage={highestScorePost.author.image}
              link={`/post/${highestScorePost._id.toString()}`}
              username={userInfo.username}
              postAuthorId={""}
              postLike={highestScorePost.like.length}
            />
          ) : (
            <h1>Al momento non abbiamo nulla da consigliarti</h1>
          )}


        </div>
      </section>
    </div>
  )
}

export default page;