'use client';

import React, { useState } from 'react';

import Post from "@/components/post/Post";
import BookPreview from '../BookPreview/BookPreview';

interface userPost {
    _id: string;
    userId: string;
    username:string;
    userImage:string;
    book: string;
    review: string;
    likeCount: number;
    image: string;
    createdAt: string;
    postAuthorId:string;
}

interface userSavedBook{
  id: string;
  largeImage:string;
}


  
  interface Props {
    userPosts: userPost[];  // Modifica qui per accettare un array di oggetti
    userSavedBooks: userSavedBook[];
  }

export function UserPosts({userPosts, userSavedBooks }:Props) {
    const [activeTab, setActiveTab] = useState<'reviews' | 'saved'>('reviews');
    
    const handleTabChange = (tab: 'reviews' | 'saved') => {
      setActiveTab(tab);
    };
  
    return (
      <div className="h-full w-full  mt-14 container">
        <div className="bg-white flex flex-row justify-center items-center space-x-5  mb-6">
          <div
            className={`border-b-2  cursor-pointer flex flex-row space-x-2 pb-3 justify-center items-center ${
              activeTab === 'reviews' ? 'border-slate-950' : 'border-gray-300'
            }`}
            onClick={() => handleTabChange('reviews')}
          >
            <p>Recensioni</p>
            <p className="bg-slate-950 text-xs text-white px-3 py-1 rounded-full">
              {userPosts.length}
            </p>
          </div>
          <div
            className={`border-b-2 cursor-pointer flex flex-row justify-center items-center space-x-2 pb-3 ${
              activeTab === 'saved' ? 'border-slate-950' : 'border-gray-300'
            }`}
            onClick={() => handleTabChange('saved')}
          >
            <p>Whislist</p>
            <p className="bg-slate-950 text-xs text-white px-3 py-1 rounded-full">
              {userSavedBooks.length}
            </p>
          </div>
        </div>
        <div className="h-full  sm:w-full sm:gap-x-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  mx-auto">
          {activeTab === 'reviews' && userPosts.map((post: any) => (
            <Post
              key={post._id}
              src={post.image}
              alt="post review"
              userImage={post.userImage} 
              bookId={""}
              userId={post.author} 
              link={`/your-posts/${post._id}`}
              username={post.username} 
              postAuthorId={post.postAuthorId}
              postLike={post.likeCount}
              saved={false}
            />
          ))}
          {activeTab === 'saved' && userSavedBooks.map((book: any) => (
            <BookPreview id={book.id} largeImage={book.largeImage} />
          ))}
        </div>
      </div>
    );
}
