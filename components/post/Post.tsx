"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { saveBook } from '@/lib/actions/user.actions'
import Link from 'next/link';
import { Router } from 'next/router';
import { useRouter, usePathname } from 'next/navigation';
import SaveButton from '../saveButton/SaveButton';


interface Props {
    src: string,
    bookId: string,
    alt: string,
    userImage: string,
    userId: string,
    link: string,
    username: string,
    postAuthorId: string,
    postLike:number,
    saved:boolean
}
const Post = ({ src, alt, userImage, bookId, userId, link, username, postAuthorId,postLike,saved }: Props) => {

    const router = useRouter()
    const pathname = usePathname();
    const isOnYourPosts = pathname === '/your-posts';


    const redirectToLink = () => {
        router.push(link)
    }

    return (
        <div className="w-40 md:w-52 h-auto mb-4 flex-col drop-shadow-2xl ">
            <div className="group relative ">
                <figure>
                    <img src={src} className="transition-opacity duration-300 cursor-pointer  " alt={alt} />
                </figure>
                <div className="absolute inset-0 bg-transparent transition-opacity duration-300 group-hover:bg-slate-950 group-hover:bg-opacity-50 cursor-pointer" onClick={redirectToLink}>
                    <div className='absolute top-3 space-x-2 right-2 flex  items-center justify-center rounded-full invisible group-hover:visible'>
                        {!isOnYourPosts && (
                            <SaveButton userId={userId} bookId={bookId} saved={saved}  />
                        )}
                    </div>
                    <div className='absolute bottom-6 left-4 flex space-x-4 justify-center items-center invisible group-hover:visible'>
                        <div className='p-2 bg-white rounded-full flex justify-center items-center'>
                            <Link href={link}>
                                <Image src="/assets/repost.svg" alt="heart" width={18} height={18} className="cursor-pointer object-contain transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                        </div>
                    </div>
                    <div className='absolute bottom-6 right-2 invisible group-hover:visible'>
                    <div className='flex justify-center items-center flex-row space-x-1'>
                            <img
                                src="/assets/heart.svg"
                                alt="heart"
                                width={20}
                                height={20}
                            />
                            <p className='text-white '>{postLike}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row space-x-2 items-center pt-3'>
                <div className="avatar">
                    <div className="w-7 sm:w-7 rounded-full">
                        <img src={userImage} className="transition-opacity duration-300 group-hover:opacity-100 " />
                    </div>
                </div>
                <Link href={`/profile/${postAuthorId}`}>
                    <p className=' text-xs hover:text-slate-400 '>{username}</p>
                </Link>
            </div>
        </div>

    )
}

export default Post
