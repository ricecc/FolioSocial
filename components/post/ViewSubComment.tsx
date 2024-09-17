"use client";
import React, { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { fetchSubComments } from '@/lib/actions/comment.actions';
import { Skeleton } from '../ui/skeleton';

const ViewSubComments: React.FC<{ parentId: string; isClicked: boolean }> = ({ parentId, isClicked }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const loadComments = async (pageNum: number, reset = false) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { comments: newComments, isNext } = await fetchSubComments(parentId, pageNum, 3);

            // Se è la prima pagina o reset è true, sovrascrivi l'array dei commenti
            setComments(prevComments => {
                const combinedComments = reset ? newComments : [...prevComments, ...newComments];

                // Rimuovi i duplicati usando l'_id come chiave univoca
                const uniqueComments = Array.from(new Set(combinedComments.map((comment: any) => comment._id)))
                    .map(id => combinedComments.find((comment: any) => comment._id === id));

                return uniqueComments;
            });

            setHasMore(isNext);
            setPage(pageNum + 1);
        } catch (error) {
            console.error("Failed to fetch sub-comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isClicked) {
            // Carica i commenti da zero quando il pulsante viene cliccato per la prima volta
            loadComments(1, true);  // Il true indica che stiamo facendo un reset dell'array dei commenti
        }
    }, [isClicked]);


    return (
        <div>
            {comments.map((comment) => (
                <div key={comment._id} className=' mt-4'>
                    <div className="flex items-start space-x-2 mb-4">
                        <div className='flex flex-row items-start space-x-1'>
                            <div className=' border-l-2 border-b-2 border-gray-300 w-5 h-3'>

                            </div>
                            <img src={comment.author.image} alt={comment.author.username} className="w-6 h-6 rounded-full" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold">{comment.author.username}</p>
                            <p className="text-xs">{comment.text}</p>
                        </div>
                    </div>
                    
                </div>
            ))}
            {hasMore && (
                <div className="text-center mt-4">
                    {isLoading ? (
                        <div className="flex flex-col space-y-4">
                            {[...Array(1)].map((_, index) => (
                                <div key={index} className="flex flex-row space-x-2">
                                <div className='flex flex-row items-start space-x-1'>
                                    <div className='border-l-2 border-b-2 border-gray-300 w-5 h-3'></div>
                                    <Skeleton className="w-6 h-6 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <Skeleton className="w-24 h-4 rounded" />
                                    <Skeleton className="w-36 h-3 mt-2 rounded" />
                                </div>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <div onClick={() => loadComments(page)} className="text-black cursor-pointer flex flex-col justify-center items-center space-y-2">
                            <img src="/assets/loadMore.svg" className="" alt="loadComments" width={24} height={24} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewSubComments;
