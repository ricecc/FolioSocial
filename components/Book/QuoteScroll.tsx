"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';

interface Post {
    userId: string;
    quote: string;
    username: string;
}

interface Props {
    post: Post[];
}

const QuoteScroll = ({ post }: Props) => {

    useEffect(() => {
        const scrollContainer = document.getElementById('scroll-container') as HTMLElement;

        if (scrollContainer) {
          
            const autoScroll = () => {
                const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                
                if (scrollContainer.scrollLeft >= maxScrollLeft) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 1; 
                }
            };

            
            const scrollInterval = setInterval(autoScroll, 50); 

      
            return () => clearInterval(scrollInterval);
        }
    }, []);
    const truncateQuote = (review: string | null, length: number = 60) => {
       
        if (!review) return ''; 
        return review.length > length ? review.substring(0, length) + '...' : review;
    };
    return (
        <div className="p-auto m-auto flex flex-col bg-white mt-12">
            <h1 className="mx-5 flex px-5 py-5 text-4xl font-bold text-gray-800 md:mx-20 md:px-10 lg:mx-40 lg:px-20">
                Quotes
            </h1>
            <div className="hide-scroll-bar flex overflow-x-scroll pb-10" id="scroll-container">
                <div className="ml-10 flex flex-nowrap md:ml-20 lg:ml-40">
                    {post.map((item, index) => (
                        <div key={index} className="inline-block px-3">
                            <div className="h-48 w-96 flex justify-start items-center max-w-xs overflow-hidden rounded-lg bg-zinc-50 shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl">
                                <div className="flex flex-col space-y-2 pl-5">
                                    <p>"{truncateQuote(item.quote)}"</p>
                                    <Link href={`/profile/${item.userId}`}>
                                        <p>From <span className='text-hoverTag'>{item.username}</span></p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .hide-scroll-bar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scroll-bar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

export default QuoteScroll;
