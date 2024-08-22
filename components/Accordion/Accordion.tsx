"use client";
import React, { useState } from 'react';

interface AccordionProps {
    content: string;
}

const Accordion  = ({ content } :AccordionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };

    // Mostra solo le prime 200 caratteri se non è espanso
    const previewText = content.substring(0, 900);
    // Se il contenuto è più lungo, mostra "..." alla fine del preview
    const shouldShowMore = content.length > 200;

    return (
        <div className="mt-4 flex  justify-center flex-col text-justify w-full">
            <div className="flex items-start justify-between">
                <p className="text-gray-700">
                    {isExpanded ? content : `${previewText}${shouldShowMore ? '...' : ''}`}
                </p>
            </div>
            <div className='flex justify-end items-center'>
            {shouldShowMore && (
                    <button
                        onClick={toggleAccordion}
                        className="text-blue-500 hover:text-blue-700 ml-2"
                    >
                        {isExpanded ? '−' : '+'}
                    </button>
                )}
            </div>

        </div>
    );
};

export default Accordion;
