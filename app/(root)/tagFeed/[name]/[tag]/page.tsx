import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { getPostsByTag } from "@/lib/actions/posts.actions";
import Post from "@/components/post/Post";
async function page({ params }: { params: { name: string, tag: string } }) {
    if (!params.tag) return null;
    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id)
    const feed = await getPostsByTag(params.tag)

    return (
        <>
            <div className="h-16 flex items-center bg-slate-800 pl-10">
            <p className="bg-zinc-50 px-3 font-fontMain text-start flex items-center justify-start pt-0.6em pr-0.8em pb-0.6em pl-0.8em rounded-md hover:text-hoverTag cursor-pointer text-slate-800 ">{params.name}</p> 
            </div>
            <div className="container mt-10">
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
                                link={`/feed/${post._id.toString()}`}
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
            </div>
        </>

    );
}
export default page;