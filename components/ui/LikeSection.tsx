"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import HeartToggle from './HeartToggle'
import SaveToggle from './SaveToggle'
import DialogLike from '../UserProfile/DialogLike'
import { boolean } from 'zod'

interface UserProps {
    id: string,
    image: string,
    name: string,
    lastName: string,
    username: string
}

interface likedProps {
    userLiked: UserProps[]
    numLike: number
    fromUserId: string
    fromUserUsername: string,
    toElement: string
    liked: boolean
    type: "quote" | "post" | "review" | "picture"
    isSaved: boolean // Aggiunto per SaveToggle
}

const LikeSection = ({ fromUserUsername, userLiked, numLike, fromUserId, toElement, liked, type, isSaved }: likedProps) => {
    const [viewUsername, setViewUsername] = useState<boolean>(false)
    return (
        <div className="flex flex-row justify-between items-center w-full">
            <div>
                {numLike > 0 && numLike < 2 ? (
                    <p className='text-sm'>
                        Piace a
                        <span className='font-semibold hover:text-hoverTag pl-1'>
                            <Link href={`/profile/${userLiked[0].id}`}>
                                {userLiked[0].username}
                            </Link>
                        </span>
                    </p>
                ) : numLike > 1 ? (
                    <div className='flex flex-row space-x-1'>
                        <p className='text-sm'>
                            Piace a
                            <span className='font-semibold hover:text-hoverTag pl-1'>
                                <Link href={`/profile/${userLiked[0].id}`}>
                                    {userLiked[0].username}
                                </Link>
                            </span>
                        </p>
                        <DialogLike userLiked={userLiked} numLike={numLike - 1}></DialogLike>
                    </div>
                ) : (numLike === 0 && viewUsername) ? (
                    <p className='text-sm'>
                        Piace a
                        <span className='font-semibold hover:text-hoverTag pl-1'>
                            {fromUserUsername}
                        </span>
                    </p>
                ) : (<></>)}
            </div>

            <div className="flex flex-row items-center space-x-3">

                <HeartToggle
                    fromUserId={fromUserId}
                    toElement={toElement}
                    type={type}
                    liked={liked}
                    setViewUsername={setViewUsername}
                />


                {type !== "post" && (
                    <SaveToggle
                        fromUserId={fromUserId}
                        toElement={toElement}
                        type={type}
                        isSaved={isSaved}
                    />
                )}
            </div>
        </div>
    )
}

export default LikeSection
