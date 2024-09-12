import ImageDialog from "@/components/ImageDialog/ImageDialog";
import WantToRead from "@/components/saveButton/PostWantToRead";
import HeartToggle from "@/components/ui/HeartToggle";
import SaveToggle from "@/components/ui/SaveToggle";
import { fetchPostById, fetchSimilarPosts } from "@/lib/actions/posts.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";


async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  const post = await fetchPostById(params.id);

  const elements = [
    ...post.quotes.map((quote: any) => ({ type: "quote", data: quote })),
    ...post.reviews.map((review: any) => ({ type: "review", data: review })),
    ...post.postImages.map((image: string) => ({ type: "image", data: image })),
  ];

  const dateObject = new Date(post.createdAt);
  const formattedDateTime = dateObject.toLocaleDateString();


  return (
    <div className="h-full flex-col flex justify-start items-center">
      <section className="flex h-auto justify-center flex-col w-2/3">
        <div className="grid w-full md:grid-cols-2 grid-cols-1 ">
          <div className="bg-zinc-50 min-h-48 pt-6 p-5 border flex flex-col justify-between">
            <div>
              <p className="text-2xl">{post.book.title}</p>
              <p>{post.book.author}</p>
            </div>
            <div className="flex flex-col items-end">
              <p>{post.author.username}</p>
              <p>{formattedDateTime} </p>
            </div>
          </div>
          <div className="bg-zinc-100 md:row-span-2 min-h-48 flex justify-center items-center">
            <img src={post.image} alt="" className="max-h-96" />
          </div>
          {elements.map((element: any, index: number) => {
            if (element.type === "quote") {
              return (
                <div key={index} className="col-span-1  p-4 min-h-48 border flex justify-between flex-col ">
                  <div className="flex justify-center items-center min-h-24">
                    <p className="font-fontMain">"{element.data.quote}"</p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <span>page:12</span>
                    <div className="flex fle-row">
                      <SaveToggle fromUserId={userInfo._id.toString()} type={"quote"} toElement={element.data._id.toString()}  isSaved={userInfo.quoteSaved.includes(element.data._id)}></SaveToggle>
                      <HeartToggle fromUserId={userInfo._id.toString()} type={"quote"} toElement={element.data._id.toString()} numLike={element.data.like.length} liked={userInfo.quoteLiked.includes(element.data._id)}></HeartToggle>
                    </div>
                  </div>

                </div>
              );
            } else if (element.type === "review") {
              return (
                <div key={index} className="col-span-1 p-4 min-h-48 border border-gray-300 rounded  space-y-4">
                  <h3 className="text-lg font-bold">{element.data.title}</h3>
                  <p>{element.data.review}</p>
                  <div className="flex justify-end">
                    <div className="flex flex-row">
                    <SaveToggle fromUserId={userInfo._id.toString()} type={"review"} toElement={element.data._id.toString()}  isSaved={userInfo.reviewSaved.includes(element.data._id)}></SaveToggle>
                    <HeartToggle fromUserId={userInfo._id.toString()} type={"review"} toElement={element.data._id.toString()} numLike={element.data.like.length} liked={userInfo.reviewLiked.includes(element.data._id)}></HeartToggle>
                    </div>
                    
                  </div>
                </div>
              );
            } else if (element.type === "image") {
              return (
                <div key={index} className="row-span-2 flex justify-center relative">
                  <ImageDialog imageSrc={element.data} />
                  <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 flex flex-row space-x-2">
                  <SaveToggle fromUserId={userInfo._id.toString()} type={"picture"} toElement={element.data}  isSaved={userInfo.imageSaved.includes(element.data._id)}></SaveToggle>
                    <HeartToggle fromUserId={userInfo._id.toString()} type={"picture"} toElement={element.data} numLike={0} liked={userInfo.imageLiked.includes(element.data)} ></HeartToggle>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </section>
      <section className="flex h-16 justify-center flex-row w-2/3 bg-slate-950 text-zinc-50 mt-10">
        <div className="w-1/2 flex justify-center items-center hover:bg-slate-900  cursor-pointer ">
          <p className="font-fontMain text-2xl">Compra</p>
        </div>
        <div className="w-1/2 flex justify-center items-center  cursor-pointer" >
          <WantToRead userId={userInfo._id.toString()} bookId={post.book._id.toString()} saved={userInfo.savedBooks.includes(post.book._id)}></WantToRead>
        </div>
      </section >
    </div>
  )
}

export default page;
