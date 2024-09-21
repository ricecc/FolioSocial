"use client";
import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import UserLibrary from './UserLibrary';

// Lazy loading per le componenti UserLibrary e UserSaved
const UserSaved = dynamic(() => import('./UserSaved'), { ssr: false });

interface Posts {
    _id: string,
    book: {
        id: string,
        title: string,
        author: string,
    },
    image: string,
    like:string[]
}

interface QuoteSaved {
    id: string,
    page: string,
    quote: string,
}

interface ReviewSaved {
    id: string,
    title: string,
    review: string,
}

interface SavedBooks {
    id: string,
    title: string,
    author: string,
    largeImage: string,
}

interface MainSectionProps {
    posts: Posts[],
    quoteSaved: QuoteSaved[],
    reviewSaved: ReviewSaved[],
    savedBooks: SavedBooks[],
    imageSaved: string[],
}

const MainSectionProfile = ({ posts, quoteSaved, reviewSaved, savedBooks, imageSaved }: MainSectionProps) => {
    const [activeTab, setActiveTab] = useState<'library' | 'saved'>('library');
    const pathname = usePathname();
    const isOnYourPosts = pathname === '/your-posts';

    // Memoization per calcolare i conteggi in modo efficiente
    const totalSavedItems = useMemo(() => {
        return savedBooks.length + reviewSaved.length + quoteSaved.length + imageSaved.length;
    }, [savedBooks, reviewSaved, quoteSaved, imageSaved]);

    const handleTabChange = (tab: 'library' | 'saved') => {
        setActiveTab(tab);
    };

    return (
        <section className="flex flex-col w-full h-auto items-center">
            <div className="w-full flex justify-center items-center bg-slate-100 mb-16">
                <div className="bg-slate-100 flex flex-row justify-center items-center space-x-5">
                    <div
                        className={`border-b-2 cursor-pointer flex flex-row space-x-2 pb-3 justify-center items-center ${activeTab === 'library' ? 'border-slate-950' : 'border-gray-300'}`}
                        onClick={() => handleTabChange('library')}
                    >
                        <p>Library</p>
                        <p className="bg-slate-950 text-xs text-white px-3 py-1 rounded-full">
                            {posts.length}
                        </p>
                    </div>
                    <div
                        className={`border-b-2 cursor-pointer flex flex-row justify-center items-center space-x-2 pb-3 ${activeTab === 'saved' ? 'border-slate-950' : 'border-gray-300'}`}
                        onClick={() => handleTabChange('saved')}
                    >
                        <p>Saved</p>
                        <p className="bg-slate-950 text-xs text-white px-3 py-1 rounded-full">
                            {totalSavedItems}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-auto">
                {activeTab === 'library' ? (
                    // Carica solo UserLibrary quando activeTab è 'library'
                    <UserLibrary posts={posts} isYourPost={isOnYourPosts} />
                ) : (
                    // Carica solo UserSaved quando activeTab è 'saved'
                    <UserSaved
                        quoteSaved={quoteSaved}
                        reviewSaved={reviewSaved}
                        savedBooks={savedBooks}
                        imageSaved={imageSaved}
                    />
                )}
            </div>
        </section>
    );
};

export default React.memo(MainSectionProfile);
