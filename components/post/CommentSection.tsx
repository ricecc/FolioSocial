"use client";
import { fetchComments } from '@/lib/actions/comment.actions';
import React, { useState } from 'react';
import { DialogComment } from './DialogComment';
import { usePathname } from 'next/navigation';

interface CommentSectionProps {
    numComment: number;
    _idCurrentUser: string;
    postId: string;
    imageCurrentUser: string;
}

const CommentSection = ({ numComment, _idCurrentUser, postId, imageCurrentUser }: CommentSectionProps) => {
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1); // Stato per la paginazione
    const [isClicked, setIsClicked] = useState(false); // Stato per il dialogo

    const loadComments = async (pageNum: number) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { comments: newComments, isNext } = await fetchComments(postId, pageNum, 5); // Carica 5 commenti per volta
            setComments(prevComments => [...prevComments, ...newComments]);
            setHasMore(isNext);
            setPage(pageNum + 1); // Incrementa la pagina
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

                loadComments(page); // Carica i primi 5 commenti quando il dialogo viene aperto

            }} style={{ cursor: 'pointer', color: 'blue' }}>
                {numComment > 0 ? (
                    <p>Visualizza {numComment} commenti</p>
                ):(
                    <p>Ancora nessun commento</p>
                )}

            </div>
            {isClicked && (
                <DialogComment
                    comments={comments}
                    totalComment={comments.length}
                    postId={postId}
                    currentUser={_idCurrentUser}
                    pathname={pathname}
                    hasMore={hasMore}
                    isLoading={isLoading}
                    loadMoreComments={handleLoadMore}
                    imageCurrentUser={imageCurrentUser}
                    onClose={() => setIsClicked(false)} // Passa la funzione per chiudere il dialogo
                />
            )}
        </div>
    );
};

export default CommentSection;
