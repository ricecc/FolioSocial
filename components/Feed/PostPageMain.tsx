import { fetchPostById } from '@/lib/actions/posts.actions'
import React, { use } from 'react'
import SaveToggle from '../ui/SaveToggle';
import LikeSection from '../post/LikeSection';
import CommentSection from '../post/CommentSection';
import PostImage from '../post/PostPageComponent/PostImage';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';

export default async function PostPageMain({ postId }: { postId: string }) {
    const post = await fetchPostById(postId)
    const user = await currentUser();
    if (!user) return (<p>utente non trovato</p>);
    const userInfo = await fetchUser(user.id)

  
    const elements = [
        ...post.quotes.map((quote: any) => ({ type: "quote", data: quote })),
        ...post.reviews.map((review: any) => ({ type: "review", data: review })),
        ...post.postImages.map((image: any) => ({ type: "image", data: image })),
    ];


    return (
        <section className="flex h-auto justify-center flex-col w-full mt-5 mb-7">
            <div className="grid w-full gap-16 px-10 md:grid-cols-2 grid-cols-1">
                {elements.map((element, index) => {
                    if (element.type === "quote") {
                        return (
                            <div className='flex flex-col space-y-3 justify-center items-center'>
                                <div key={index} className="col-span-1 p-8 min-h-[299px] shadow-md  flex justify-center items-center flex-col rounded-[15px]  w-[441px] lg:w-[741px] bg-white" >
                                    <p className='text-[17px] font-montserrat'>{element.data.quote}</p>
                                </div>
                                <div className=' w-full px-8'>
                                    <LikeSection
                                        fromUserImage={userInfo.image}
                                        fromUserUsername={userInfo.username}
                                        userLiked={element.data.like}
                                        numLike={element.data.like.length}
                                        fromUserId={userInfo._id.toString()}
                                        toElement={element.data._id.toString()}
                                        liked={userInfo.reviewLiked.includes(element.data._id)}
                                        isSaved={userInfo.reviewSaved.includes(element.data._id)}
                                        type="quote"
                                    />
                                    <CommentSection numComment={element.data.comments ? element.data.comments.length : 0} _idCurrentUser={userInfo._id.toString()} refId={element.data._id.toString()} refType="Quote" imageCurrentUser={userInfo.image} />
                                </div>
                            </div>
                        );
                    } else if (element.type === "review") {
                        return (
                            <div className='flex flex-col space-y-3 justify-center items-center'>
                                <div key={index} className="col-span-1 p-8 min-h-[299px] shadow-md  rounded-[15px]  w-[441px] lg:w-[741px] bg-white justify-center items-center " >
                                    <div className='flex flex-col justify-center space-y-6'>
                                        <h2 className='font-semibold'>{element.data.title}</h2>
                                        <p className='text-[17px]'>{element.data.review}</p>
                                    </div>
                                </div>
                                <div className='w-full px-8'>
                                    <LikeSection
                                        fromUserImage={userInfo.image}
                                        fromUserUsername={userInfo.username}
                                        userLiked={element.data.like}
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
                            <div className='flex row-span-2 justify-center items-center  h-full '>
                                <img src={element.data} alt={""} className=' w-auto w-max-[420px] max-h-[350px] shadow-xl ' />
                            </div>
                        );
                    }
                })}
            </div>
        </section>
    )
}


