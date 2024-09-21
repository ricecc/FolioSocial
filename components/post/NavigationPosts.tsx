"use client"

import React from 'react'
import { useRouter } from 'next/navigation'; // Utilizza il router di Next.js
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { useFeed } from '@/context/FeedContent';

interface Params {
  currentPost: string;
}

const NavigationPosts = ({ currentPost }: Params) => {
  const { feed, hasMore, loadMorePosts, loading } = useFeed();
  const router = useRouter();

  
  const currentIndex = feed.findIndex(post => post._id.toString() === currentPost);

  
  const prevPost = currentIndex > 0 ? feed[currentIndex - 1] : null;
  const nextPost = currentIndex < feed.length - 1 ? feed[currentIndex + 1] : null;

 
  const goToPrevPost = () => {
    if (prevPost) {
      router.push(`/feed/${prevPost._id.toString()}`);
    } else if (!loading && hasMore) {
   
      loadMorePosts();
    }
  };

  const goToNextPost = () => {
    if (nextPost) {
      router.push(`/feed/${nextPost._id.toString()}`);
    } else if (!loading && hasMore) {
     
      loadMorePosts();
    }
  };

  return (
      <Pagination className="w-full">
        <PaginationContent className="w-full flex justify-between">
          <PaginationItem>
            <PaginationPrevious onClick={goToPrevPost}  />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={goToNextPost} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
  )
}

export default NavigationPosts;
