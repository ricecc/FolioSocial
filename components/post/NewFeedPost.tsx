"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { saveBook } from '@/lib/actions/user.actions'
import Link from 'next/link';
import { Router } from 'next/router';
import { useRouter, usePathname } from 'next/navigation';
import SaveButton from '../saveButton/SaveButton';


import { AspectRatio } from "@/components/ui/aspect-ratio"
import HeartToggle from '../ui/HeartToggle';
import { userInfo } from 'os';

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
    postLike: number,
    isSaved: boolean,
    index: number,
    quote: string,
    isLiked:boolean
}
const NewFeedPost = ({ isLiked,postId, quote, bookTitle, bookAuthor, bookCover, userImage, bookId, userId, username, postAuthorId, postLike, isSaved, imagePost, index }: Props) => {

    const router = useRouter()
    const pathname = usePathname();
    const isOnYourPosts = pathname === '/your-posts';


    const redirectToLink = () => {
        router.push(`/post/${postId}`)
    }

    let content;

    if (index % 4 === 0 && quote != "") {
        content = <p className='text-md font-fontMain p-5 bg-slate-800 text-white'>"{quote.slice(0,140)}..."</p>;
    } else if (index % 2 === 0) {
        content = <img src={imagePost || bookCover} alt={""} className='w-auto h-60 shadow-xl' />;
    } else {
        content = <img src={bookCover} alt={""} className='w-auto h-60 shadow-xl' />;
    }

    return (
        <div className='flex flex-col cursor-pointer mb-28'>
            <div className="w-[450px] h-80 flex justify-center items-center bg-zinc-50 relative">
                <Link href={`/post/${postId}`}>
                    {content}
                </Link>
                <div className='flex flex-row space-x-2 p-3 absolute top-0 left-3'>
                    <img src={userImage} className="transition-opacity duration-300 group-hover:opacity-100 w-7 sm:w-7 rounded-full" />
                    <p>{username}</p>
                </div>
                <div className='absolute bottom-3 right-3 flex flex-row space-x-2 '>
                    <HeartToggle fromUserId={userId} toElement={postId} numLike={postLike} liked={isLiked} type={'post'}></HeartToggle>
                </div>
            </div>
            <div className='pl-3 '>
                <div>
                    <p className='font-md font-medium hover:text-hoverTag '><Link href={`/book/${bookId}`}>{bookTitle}</Link></p>
                    <p className='text-sm'>{bookAuthor}</p>
                </div>
            </div>
        </div>
    )
}

export default NewFeedPost
