import ImageDialog from "@/components/ImageDialog/ImageDialog";
import WantToRead from "@/components/saveButton/PostWantToRead";
import HeartToggle from "@/components/ui/HeartToggle";
import LikeSection from "@/components/post/LikeSection";
import SaveToggle from "@/components/ui/SaveToggle";

import { fetchPostById, fetchSimilarPosts } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import CommentSection from "@/components/post/CommentSection";
import Link from "next/link";
import SimilarPostsFeed from "@/components/Feed/SimilarPostsFeed";

// Funzione per la filtrazione degli utenti piuttosto che nel render
function filterUserLiked(users: any) {
  return users.map((user: any) => ({
    _id: user._id.toString(),
    id: user.id,
    image: user.image,
    username: user.username,
    name: user.name,
    lastName: user.lastName
  }));
}

// Componente per gestire i dettagli dei post
const PostDetails = ({ post, userInfo }: any) => {
  const elements = [
    ...post.quotes.map((quote: any) => ({ type: "quote", data: quote })),
    ...post.reviews.map((review: any) => ({ type: "review", data: review })),
    ...post.postImages.map((image: any) => ({ type: "image", data: image })),
  ];

  const dateObject = new Date(post.createdAt);
  const formattedDateTime = dateObject.toLocaleDateString();

  return (
    <section className="flex h-auto justify-center flex-col w-full">
      <div className="w-full flex flex-col lg:flex-row lg:h-[374px]">
        <div className="bg-zinc-50 min-h-48 pt-6 p-5 border flex flex-col justify-between lg:w-1/2">
          <div className="pt-5 space-y-2">
            <p className="font-montserrat font-medium lg:text-5xl text-3xl">{post.book.title}</p>
            <p className="font-montserrat font-light text-2xl">{post.book.author}</p>
          </div>
          <div className="flex flex-col items-end">

            <Link href={`/profile/${post.author.id}`} className="hover:text-hoverTag">{post.author.username}</Link>
          </div>
        </div>
        <div className="bg-gradient-to-b from-white to-zinc-200 min-h-48 flex justify-center items-center p-5 lg:p-0 lg:w-1/2">
          <img src={post.image} alt="" className="w-auto h-64 object-contain" />
        </div>
      </div>
      <div className="grid w-full md:grid-cols-2 grid-cols-1">
        {elements.map((element, index) => {
          if (element.type === "quote") {
            return (
              <div key={index} className="col-span-1 p-4 min-h-48 border flex justify-between flex-col">
                <div className="flex flex-row justify-between">
                  <span className="text-sm text-hoverTag">Page {element.data.page}</span>
                  <SaveToggle fromUserId={userInfo._id.toString()} type={"quote"} toElement={element.data._id.toString()} isSaved={userInfo.quoteSaved.includes(element.data._id)} />
                </div>
                <div className="flex justify-center items-center min-h-24">
                  <p>"{element.data.quote}"</p>
                </div>

                <div className="flex flex-col">
                  <LikeSection
                    fromUserImage={userInfo.image}
                    fromUserUsername={userInfo.username}
                    userLiked={filterUserLiked(element.data.like)}
                    numLike={element.data.like.length}
                    fromUserId={userInfo._id.toString()}
                    toElement={element.data._id.toString()}
                    liked={userInfo.quoteLiked.includes(element.data._id.toString())}
                    isSaved={userInfo.quoteSaved.includes(element.data._id)}
                    type="quote"
                  />
                  <CommentSection numComment={element.data.comments ? element.data.comments.length : 0} _idCurrentUser={userInfo._id.toString()} refId={element.data._id.toString()} refType="Quote" imageCurrentUser={userInfo.image} />
                </div>

              </div>
            );
          } else if (element.type === "review") {
            return (
              <div key={index} className="col-span-1 p-4 flex-col justify-between min-h-48 border border-gray-300 rounded space-y-4">
                <div className="flex justify-start min-h-28 flex-col space-y-5 pt-2">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-lg font-bold">{element.data.title}</h3>
                    <SaveToggle fromUserId={userInfo._id.toString()} type={"review"} toElement={element.data._id.toString()} isSaved={userInfo.reviewSaved.includes(element.data._id)} />
                  </div>
                  <p>{element.data.review}</p>
                </div>
                <div className="flex flex-col">
                  <LikeSection
                    fromUserImage={userInfo.image}
                    fromUserUsername={userInfo.username}
                    userLiked={filterUserLiked(element.data.like)}
                    numLike={element.data.like.length}
                    fromUserId={userInfo._id.toString()}
                    toElement={element.data._id.toString()}
                    liked={userInfo.reviewLiked.includes(element.data._id)}
                    isSaved={userInfo.reviewSaved.includes(element.data._id)}
                    type="review"
                  />
                  <CommentSection numComment={element.data.comments ? element.data.comments.length : 0} _idCurrentUser={userInfo._id.toString()} refId={element.data._id.toString()} refType="Review" imageCurrentUser={userInfo.image} />
                </div>

              </div>
            );
          } else if (element.type === "image") {
            return (
              <div key={index} className="row-span-2 flex justify-center relative">
                <ImageDialog imageSrc={element.data} />
                <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 flex flex-row space-x-2">
                  <SaveToggle fromUserId={userInfo._id.toString()} type={"picture"} toElement={element.data} isSaved={userInfo.imageSaved.includes(element.data._id)} />
                </div>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
};

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  const post = await fetchPostById(params.id);

  return (
    <div className="h-full">
      <div className="h-full flex-col flex justify-start items-center">
        <PostDetails post={post} userInfo={userInfo} />
        <section className="flex h-32 justify-center flex-col w-full bg-slate-950 text-zinc-50 mt-10 mb-10 ">
          <div className="w-full flex justify-start items-center hover:bg-slate-900 hover:text-zinc-50 cursor-pointer h-1/2 px-8 ">
            <p className="font-fontMain lg:text-2xl text-md">Compra</p>
          </div>
          <div className="w-full flex justify-start items-center cursor-pointer h-1/2">
            <WantToRead userId={userInfo._id.toString()} bookId={post.book._id.toString()} saved={userInfo.savedBooks.includes(post.book._id)} />
          </div>
        </section>
      </div>
      <section className="w-full h-full  flex justify-center items-center">
        {/**carosello post consigliati */}
        <SimilarPostsFeed postId={post._id.toString()} />
      </section>
    </div>
  );
}

export default page;
