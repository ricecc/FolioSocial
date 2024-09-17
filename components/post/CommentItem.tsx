import React, { lazy, Suspense, useState } from 'react';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { boolean } from 'zod';
import LoadingSubComment from './LoadingSubComment';



const ReplyComment = lazy(() => import('./ReplyComment'));
const ViewSubComment = lazy(() => import('./ViewSubComment'));
interface Comment {
    _id: string;
    text: string;
    author: {
        id: string;
        username: string;
        image: string;
    };
}

interface CommentItemProps {
    comment: Comment;
    isReplying: boolean;
    onReplyClick: () => void;
    viewSubComments: boolean;
    onViewSubComments: () => void;
    refType: 'Quote' | 'Review',
    refId: string,
    pathname: string,
    currentUser: string,
    imageCurrentUser: string,
    numChildren: number
}

const CommentItem: React.FC<CommentItemProps> = ({ viewSubComments, onViewSubComments, numChildren, comment, isReplying, onReplyClick, refType, refId, pathname, currentUser, imageCurrentUser }) => {


    return (
        <>
            <div className="mb-4 flex flex-row items-start space-x-2">
                <img
                    src={comment.author.image}
                    alt={comment.author.username}
                    className="w-7 h-7 rounded-full object-cover"
                />
                <div className="flex flex-col justify-center w-full space-y-2">
                    <div className="flex flex-col">
                        <Link href={`/profile/${comment.author.id}`} className="font-semibold">
                            {comment.author.username}
                        </Link>
                        <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className='flex flex-row'>
                        <p onClick={onReplyClick} className="text-xs cursor-pointer">
                            {isReplying ? 'Annulla' : 'Rispondi'}
                        </p>
                        {numChildren > 0 ? (
                            <div className='flex flex-row items-center'>
                                <div className='bg-gray-200 h-2 w-2 rounded-full mx-2'  />
                                <p onClick={onViewSubComments} className="text-xs cursor-pointer">
                                    {viewSubComments ? 'Mostra meno' : 'Visualizza altri commenti'}
                                </p>
                            </div>

                        ) : (<></>)}
                    </div>

                    {isReplying && (
                        <Suspense fallback={<div className='text-xs text-gray-300'>loading...</div>}>
                            <ReplyComment parentId={comment._id} refId={refId} refType={refType} pathname={pathname} currentUser={currentUser} imageCurrentUser={imageCurrentUser} />
                        </Suspense>
                    )}
                    {viewSubComments && (
                        <Suspense fallback={<div className='text-xs text-gray-300'><LoadingSubComment/></div>}>
                            <ViewSubComment parentId={comment._id} isClicked={viewSubComments} />
                        </Suspense>
                    )}
                </div>
            </div>
            <Separator className='my-2'></Separator>
        </>

    );
};

export default CommentItem;
