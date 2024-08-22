"use client";
import React, { useState } from "react";

interface AddReviewProps {
    review: string;
    setReview: (review: string) => void;
   
}

function AddReview({ review, setReview }: AddReviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <div className="mt-4 ">
            <button
                onClick={toggleAccordion}
                className="flex w-full items-center space-x-2 p-2 border-b border-slate-900  transition duration-150"
            >
                <span>{isExpanded ? "-" : "+"}</span>
                <span className="font-fontMain text-xl font-semibold text-hoverTag">Add Review</span>
            </button>
            {isExpanded && (
                
                    <div className="flex flex-col space-y-2 static">
                        <textarea
                            className="rounded-lg p-2 border shadow-lg"
                            rows={10}
                            cols={30}
                            placeholder="Scrivi una recensione..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>
    
             
            )}
            </div>
        </>
    );
}

export default AddReview;
