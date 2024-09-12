"use client"
import React, { useState } from 'react'
import UserLibrary from './UserLibrary'
import UserSaved from './UserSaved'

interface posts {
    id: string,
    book: {
        id: string,
        title: string,
        author: string,
    }
    image: string
}

interface quoteLiked {
    id: string,
    page: string,
    quote: string
}

interface reviewLiked {
    id: string,
    title: string,
    review: string
}

interface savedBooks {
    id: string,
    title: string,
    author: string,
    largeImage: string
}

interface MainSectionProps {
    posts: posts[],
    quoteLiked: quoteLiked[],
    reviewLiked: reviewLiked[],
    savedBooks: savedBooks[],
    imageLiked: string[],

}

const MainSectionProfile = ({ posts, quoteLiked, reviewLiked, savedBooks, imageLiked }: MainSectionProps) => {
    const [activeTab, setActiveTab] = useState<'library' | 'saved'>('library');

    const handleTabChange = (tab: 'library' | 'saved') => {
        setActiveTab(tab);
    };
    return (
        <section className="flex flex-col w-full  h-screen flex items-center ">
            <div className='w-full flex justify-center items-center bg-slate-100  mb-16 '>
                <div className="bg-slate-100 flex flex-row justify-center items-center space-x-5    ">
                    <div
                        className={`border-b-2  cursor-pointer flex flex-row space-x-2 pb-3 justify-center items-center ${activeTab === 'library' ? 'border-slate-950' : 'border-gray-300'
                            }`}
                        onClick={() => handleTabChange('library')}
                    >
                        <p>Library</p>
                        <p className="bg-slate-950 text-xs text-white px-3 py-1 rounded-full">
                            {posts.length}
                        </p>
                    </div>
                    <div
                        className={`border-b-2 cursor-pointer flex flex-row justify-center items-center space-x-2 pb-3 ${activeTab === 'saved' ? 'border-slate-950' : 'border-gray-300'
                            }`}
                        onClick={() => handleTabChange('saved')}
                    >
                        <p>Saved</p>
                        <p className="bg-slate-950 text-xs text-white px-3 py-1 rounded-full">
                            {savedBooks.length + reviewLiked.length + quoteLiked.length +imageLiked.length }
                        </p>
                    </div>
                </div>
            </div>
            <div className='w-[1000px]  '>
                {activeTab==="library"?(
                    <UserLibrary posts={posts}></UserLibrary>
                ):(
                    <UserSaved quoteLiked={quoteLiked} reviewLiked={reviewLiked} savedBooks={savedBooks} imageLiked={imageLiked}></UserSaved>
                )}
            </div>

        </section>
    )
}

export default MainSectionProfile
