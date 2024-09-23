"use client"
import React from 'react'
import { Suspense, useState, lazy } from "react";


import { fetchSimilarPosts } from '@/lib/actions/posts.actions';
import Loading from '@/app/(root)/feed/loading';

const SimilarPostsFeed = lazy(() => import("@/components/Feed/SimilarPostsFeed"));
interface Params{
    parentId:string;
    currentUserInfo:any;
}
const SimilarEntryPoint = ({parentId,currentUserInfo}:Params) => {
    const [similarPosts, setSimilarPosts] = useState<any[]>([]);
    const [showSimilarPosts, setShowSimilarPosts] = useState(false);

    const getSimilarPosts = async () => {
        try {
            const posts = await fetchSimilarPosts(parentId);
            setSimilarPosts(posts);
            setShowSimilarPosts(true); 
        } catch (error) {
            console.error("Error fetching similar posts:", error);
        }
    };
    return (
        <div>
            <div onClick={getSimilarPosts} className="text-black cursor-pointer flex flex-col justify-center items-center space-y-2">
                <p>Post simili a questo</p>
                <img src="/assets/loadMore.svg" className="animate-pulse" alt="plus" width={24} height={24} />
            </div>
            {showSimilarPosts && (
                <Suspense fallback={<Loading />}>
                    <SimilarPostsFeed initialPosts={similarPosts} currentUserInfo={currentUserInfo} parentId={parentId} />
                </Suspense>
            )}
        </div>
    )
}

export default SimilarEntryPoint
