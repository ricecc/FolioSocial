"use client";
import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HeartToggle from '../ui/HeartToggle';
import QuotePreview from './QuotePreview';
import ImagePostPreview from './ImagePostPreview';
import BookCoverPreview from './BookCoverPreview';
import DialogLike from '../UserProfile/DialogLike';
import LikeSection from '../post/LikeSection';
import CommentSection from '../post/CommentSection';
import Image from 'next/image';

interface UserProps {
    _id: string,
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
    usernameViewer: string,
    numComment: number,
    imageCurrentUser: string,
}

const SimilarFeedSection: React.FC<Props> = ({
    imageCurrentUser, numComment, usersLiked, isLiked, postId, quote, bookTitle, bookAuthor, bookCover, userImage, userId, username, postAuthorId, usernameViewer, imagePost, index
}) => {
    const pathname = usePathname();
    const isOnYourPosts = pathname === '/your-posts';

    const content = index % 4 === 0 && quote
        ? <QuotePreview quote={quote} />
        : index % 2 === 0
            ? <ImagePostPreview imagePost={imagePost} bookCover={bookCover} />
            : <BookCoverPreview bookCover={bookCover} />;

    return (
        <div className='flex flex-col cursor-pointer mb-10 w-[320px] sm:w-[250px] md:w-[450px] shadow-xl'>
            <div className="w-[320px] sm:w-[250px] md:w-[450px] h-[350px] flex justify-between flex-col items-center relative">
                <div className='flex flex-row items-center space-x-2 p-3 h-1/6 w-full'>
                    <Image src={userImage} alt={username} width={28} height={28} className="object-cover rounded-full w-8 h-8" />
                    <Link href={`/profile/${postAuthorId}`}>
                        <p>{username}</p>
                    </Link>
                </div>
                <Link href={`/post/${postId}`} className='h-5/6 w-full'>
                    {content}
                </Link>
            </div>
            <div className='flex flex-col p-3'>
                <div className='flex flex-col space-y-1 justify-between pt-2 pb-2'>
                    <LikeSection
                        fromUserImage={imageCurrentUser}
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
                <div>
                    <p className='font-md font-medium hover:text-hoverTag'>{bookTitle}</p>
                    <p className='text-sm'>{bookAuthor}</p>
                </div>
            </div>
        </div>
    );
};

export default memo(SimilarFeedSection);
