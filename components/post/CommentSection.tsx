"use client";
import { fetchComments } from '@/lib/actions/comment.actions';
import React, { useState,lazy,Suspense } from 'react';

import { usePathname } from 'next/navigation';

const DialogComment = lazy(() => import('./DialogComment'));
interface CommentSectionProps {
    numComment: number;
    _idCurrentUser: string;
    refId: string;
    imageCurrentUser: string;
    refType:'Quote'|'Review'
}

const CommentSection = ({refType, numComment, _idCurrentUser, refId, imageCurrentUser }: CommentSectionProps) => {
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1); 
    const [isClicked, setIsClicked] = useState(false); 
    
    const loadComments = async (pageNum: number) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { comments: newComments, isNext } = await fetchComments(refId,refType, pageNum, 5); // Carica 5 commenti per volta
           
            setComments(prevComments => [...prevComments, ...newComments]);
            setHasMore(isNext);
            setPage(pageNum + 1); 
            
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (hasMore) {
            loadComments(page);
        }
    };

    const pathname = usePathname();

    return (
        <div>
            <div className='text-sm' onClick={() => {
                setIsClicked(true);

                loadComments(page); 

            }} style={{ cursor: 'pointer', color: 'blue' }}>
                {numComment > 0 ? (
                    <p>Visualizza {numComment} commenti</p>
                ):(
                    <p>Ancora nessun commento</p>
                )}

            </div>
            {isClicked && (
                <Suspense fallback={<div className='text-xs text-gray-300'>loading...</div>}>
                <DialogComment
                    comments={comments}
                    totalComment={numComment}
                    refType={refType}
                    refId={refId}
                    currentUser={_idCurrentUser}
                    pathname={pathname}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    loadMoreComments={handleLoadMore}
                    imageCurrentUser={imageCurrentUser}
                    onClose={() => setIsClicked(false)} // Passa la funzione per chiudere il dialogo
                />
                </Suspense>
            )}
        </div>
    );
};

export default CommentSection;
