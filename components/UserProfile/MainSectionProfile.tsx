"use client"
import React, { useState } from 'react'
import UserLibrary from './UserLibrary'
import UserSaved from './UserSaved'
import { usePathname } from 'next/navigation'

interface posts {
    _id: string,
    book: {
        id: string,
        title: string,
        author: string,
    }
    image: string
}

interface quoteSaved {
    id: string,
    page: string,
    quote: string
}

interface reviewSaved {
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
    posts: any[],
    quoteSaved: quoteSaved[],
    reviewSaved: reviewSaved[],
    savedBooks: savedBooks[],
    imageSaved: string[],

}

const MainSectionProfile = ({ posts, quoteSaved, reviewSaved, savedBooks, imageSaved }: MainSectionProps) => {
    const [activeTab, setActiveTab] = useState<'library' | 'saved'>('library');
    const pathname = usePathname(); // Ottieni il pathname corrente
    const isOnYourPosts = pathname === '/your-posts';
    const handleTabChange = (tab: 'library' | 'saved') => {
        setActiveTab(tab);
    };

    return (
        <section className="flex flex-col w-full  h-auto flex items-center ">
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
                            {savedBooks.length + reviewSaved.length + quoteSaved.length + imageSaved.length}
                        </p>
                    </div>
                </div>
            </div>
            <div className=' w-auto '>
                {activeTab === "library" ? (
                    <UserLibrary posts={posts} isYourPost={isOnYourPosts}></UserLibrary>
                ) : (
                    <UserSaved quoteSaved={quoteSaved} reviewSaved={reviewSaved} savedBooks={savedBooks} imageSaved={imageSaved}></UserSaved>
                )}
            </div>

        </section>
    )
}

export default MainSectionProfile
