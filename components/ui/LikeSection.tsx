import React from 'react'
import DialogLike from '../UserProfile/DialogLike'
import Link from 'next/link'
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
}
const LikeSection = ({ userLiked, numLike }: likedProps) => {
    return (
        <div className='w-full '>
            {numLike > 0 && numLike < 2 ? (
                <p className='text-sm'>Piace a
                    <span className='font-semibold hover:text-hoverTag pl-1'>
                        <Link href={`/profile/${userLiked[0].id}`}>{userLiked[0].username}</Link>
                    </span>
                </p>
            ) : numLike > 1 ? (
                <div className='flex flex-row space-x-1'>
                    <p className='text-sm'>Piace a
                        <span className='font-semibold hover:text-hoverTag pl-1'>
                            <Link href={`/profile/${userLiked[0].id}`}>{userLiked[0].username}</Link>
                        </span>
                    </p>
                    <DialogLike userLiked={userLiked} numLike={numLike - 1}></DialogLike>
                </div>
            ) : (
                <></>
            )}
        </div>

    )
}

export default LikeSection
