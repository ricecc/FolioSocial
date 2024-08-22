"use client";
import React, { useState } from 'react';

interface Props {
    post: {
        authorImage: string;
        authorUsername: string;
        review: string[];
        quotes: string[];
    }
}

const PostContent = ({ post }: Props) => {
    // Stato per gestire la visualizzazione di quotes o review
    const [showQuotes, setShowQuotes] = useState(true);

    // Funzioni per cambiare la visualizzazione
    const showOnlyQuotes = () => setShowQuotes(true);
    const showOnlyReviews = () => setShowQuotes(false);

    // Determina cosa mostrare basato sullo stato e sulla disponibilità dei dati
    const shouldShowQuotes = showQuotes && post.quotes.length > 0;
    const shouldShowReviews = !showQuotes && post.review.length > 0;
    const hasQuotes = post.quotes.length > 0;
    const hasReviews = post.review.length > 0;

    return (
        <div className="h-2/3 w-full">
            <div className="h-1/3 p-9 flex flex-row justify-between items-center">
                <div className="flex flex-row items-center space-x-3">
                    <img src={post.authorImage} alt="" className="w-16 rounded-full" />
                    <p>{post.authorUsername}</p>
                </div>
                <div className="flex mt-4 space-x-4">
                    <p
                        onClick={showOnlyQuotes}
                        className={`px-4 py-2 border-b cursor-pointer ${showQuotes ? 'border-hoverTag ' : 'border-slate-950'}`}

                    >
                        Quotes
                    </p>
                    <p
                        onClick={showOnlyReviews}
                        className={`px-4 py-2 border-b cursor-pointer ${!showQuotes ? 'border-hoverTag' : 'border-slate-950'}`}
                    >
                        Reviews
                    </p>
                </div>
            </div>
            <div className="h-2/3 min-h-28 flex px-8 py-3 items-center">
                <article className="w-full">
                    {shouldShowQuotes ? (
                        post.quotes.map((quote, index) => (
                            <p key={index} className="text-justify font-fontMain">{quote}</p>
                        ))
                    ) : shouldShowReviews ? (
                        post.review.map((singleReview, index) => (
                            <p key={index} className="text-justify font-fontMain">{singleReview}</p>
                        ))
                    ) : (
                        (hasQuotes ? post.quotes : post.review).map((item, index) => (
                            <p key={index} className="text-justify font-fontMain">{item}</p>
                        ))
                    )}
                </article>
            </div>
        </div>
    );
};

export default PostContent;
