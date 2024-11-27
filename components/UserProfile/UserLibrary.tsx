import { fetchUserInfoForProfile } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import React from 'react'
import DeletePost from './DeletePost';
import { Badge } from '../ui/badge';
import BookCoverPreview from '../Feed/BookCoverPreview';
import { FaHeart } from 'react-icons/fa';


const UserLibrary = async ({idUser}:{idUser:string}) => {
    const userInfo = await fetchUserInfoForProfile(idUser)
    const user = await currentUser();
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto mt-3">
            {userInfo.posts.length > 0 ? (
                userInfo.posts.map((post: any) => (
                    <div
                        key={post._id}
                        className="flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl"
                    >
                        <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
                            <div className="flex flex-row items-center justify-end space-x-2 p-3 h-1/6 w-full">

                                <div className='flex flex-row items-center'>
                                    {user?.id === idUser ? (
                                        <>
                                            <DeletePost postId={post._id} />
                                            <Badge variant="secondary">Modifica</Badge>
                                        </>
                                    ) : (
                                        <>

                                        </>
                                    )}

                                </div>
                            </div>
                            <BookCoverPreview bookCover={post.image} />
                        </div>
                        <div className="flex flex-col p-3">
                            <div className="flex flex-col items-end justify-end pt-2 pb-2">
                                <Badge className='flex flex-row space-x-1 items-center '>
                                    <FaHeart /> {post.like ? post.like.length : 0}
                                </Badge>
                            </div>
                            <div>
                                <p className="font-md font-medium hover:text-hoverTag">
                                    {post.book.title}
                                </p>
                                <p className="text-sm">{post.book.author}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </section>
    );
}

export default UserLibrary
