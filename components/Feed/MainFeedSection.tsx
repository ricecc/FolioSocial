"use client";
import React, { useState } from 'react'


import Link from 'next/link';

import { usePathname } from 'next/navigation';

import HeartToggle from '../ui/HeartToggle';
import QuotePreview from './QuotePreview';
import ImagePostPreview from './ImagePostPreview';
import BookCoverPreview from './BookCoverPreview';
import DialogLike from '../UserProfile/DialogLike';
import LikeSection from '../ui/LikeSection';

interface UserProps {
    id: string,
    image: string,
    name: string,
    lastName: string,
    username: string
}
interface Props {
    bookCover: string,
    postId: string,
    imagePost: string,
    bookId: string,
    bookTitle: string,
    bookAuthor: string,
    userImage: string,
    userId: string,
    username: string,
    postAuthorId: string,
    index: number,
    quote: string,
    isLiked: boolean,
    usersLiked: UserProps[],
    usernameViewer:string,
}
const MainFeedSection = ({ usersLiked, isLiked, postId, quote, bookTitle, bookAuthor, bookCover, userImage, bookId, userId, username, postAuthorId, usernameViewer, imagePost, index }: Props) => {


    const pathname = usePathname();
    const isOnYourPosts = pathname === '/your-posts';




    let content;

    if (index % 4 === 0 && quote != "") {
        content = <QuotePreview quote={quote}></QuotePreview>
    } else if (index % 2 === 0) {
        content = <ImagePostPreview imagePost={imagePost} bookCover={bookCover}></ImagePostPreview>
    } else {
        content = <BookCoverPreview bookCover={bookCover}></BookCoverPreview>
    }

    return (
        <div className='flex flex-col cursor-pointer mb-10  w-[320px] sm:w-[250px] md:w-[450px] shadow-xl ' >
            <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center  relative">
                <div className='flex flex-row items-center space-x-2 p-3 h-1/6 w-full '>
                    <img src={userImage} className="w-7 h-7 object-cover rounded-full" />
                    <Link href={`/profile/${postAuthorId}`}>
                        <p>{username}</p>
                    </Link>
                </div>
                <Link href={`/post/${postId}`} className='h-5/6 w-full '>
                    {content}
                </Link>
            </div>
            <div className=' flex flex-col p-3 '>
                <div className='flex flex-row space-x-2  justify-between pt-2 pb-2  '>
                    <LikeSection
                        fromUserUsername={usernameViewer}
                        userLiked={usersLiked}
                        numLike={usersLiked.length}
                        fromUserId={userId}
                        toElement={postId}
                        liked={isLiked}
                        isSaved={false}
                        type="post"
                    />

                </div>
                <div className=''>
                    <p className='font-md font-medium hover:text-hoverTag '><Link href={`/book/${bookId}`}>{bookTitle}</Link></p>
                    <p className='text-sm'>{bookAuthor}</p>
                </div>
            </div>
        </div>
    )
}

export default MainFeedSection
