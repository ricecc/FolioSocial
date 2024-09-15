"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import HeartToggle from '../ui/HeartToggle'
import SaveToggle from '../ui/SaveToggle'
import DialogLike from '../UserProfile/DialogLike'

interface UserProps {
    _id:string,
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
    fromUserUsername: string
    toElement: string
    liked: boolean
    type: "quote" | "post" | "review" | "picture"
    isSaved: boolean,
    fromUserImage:string,
}

const LikeSection = ({ fromUserUsername, userLiked, numLike, fromUserId, toElement, liked, type, isSaved,fromUserImage }: likedProps) => {
    const [count, setCount] = useState<number>(numLike) 
    const [likedList, setLikedList] = useState<UserProps[]>(userLiked)


    const updateLikedList = (isLiked: boolean) => {
        if (isLiked) {
            setLikedList(likedList.filter(user => user._id !== fromUserId))
        } else {
            setLikedList([{ _id: fromUserId, username: fromUserUsername, image: fromUserImage, name: "", lastName: "",id:"" }, ...likedList])
        }
    }
    return (
        <div className="flex flex-row justify-between items-center w-full ">
            <div>
                {count === 1 ? (
                    <p className='text-sm'>
                        Piace a
                        <span className='font-semibold hover:text-hoverTag pl-1'>
                            <Link href={`/profile/${likedList[0].id}`}>
                                {likedList[0].username}
                            </Link>
                        </span>
                    </p>
                ) : count > 1 ? (
                    <div className='flex flex-row space-x-1'>
                        <p className='text-sm'>
                            Piace a
                            <span className='font-semibold hover:text-hoverTag pl-1'>
                                <Link href={`/profile/${likedList[0].id}`}>
                                    {likedList[0].username}
                                </Link>
                            </span>
                        </p>
                        <DialogLike userLiked={likedList} numLike={count - 1}></DialogLike>
                    </div>
                ) : count === 0 ? (
                    <></>
                ) : (<></>)}
            </div>

            <div className="flex flex-row items-center space-x-3">
                <HeartToggle
                    fromUserId={fromUserId}
                    toElement={toElement}
                    type={type}
                    liked={liked}
                    setCount={setCount} 
                    count={count}
                    updateLikedList={updateLikedList} 
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
