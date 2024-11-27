"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'; // Utilizza il router di Next.js
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { useFeed } from '@/context/FeedContext';


interface Params {
  currentPost: string;
}

const NavigationPosts = ({ currentPost }: Params) => {
  const {posts} = useFeed()
  const router = useRouter();

  
  const currentIndex = posts.findIndex((post: { _id: { toString: () => string; }; })=> post._id.toString() === currentPost);

  
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

 
  const goToPrevPost = () => {
    if (prevPost) {
      router.push(
        `/feed/${prevPost._id.toString()}?title=${encodeURIComponent(prevPost.book.title)}&author=${encodeURIComponent(prevPost.book.author)}&bookCover=${encodeURIComponent(prevPost.image)}&authorId=${encodeURIComponent(prevPost.author.id)}`
      );
    }
  };
  
  const goToNextPost = () => {
    if (nextPost) {
      router.push(
        `/feed/${nextPost._id.toString()}?title=${encodeURIComponent(nextPost.book.title)}&author=${encodeURIComponent(nextPost.book.author)}&bookCover=${encodeURIComponent(nextPost.image)}&authorId=${encodeURIComponent(nextPost.author.id)}`
      );
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
