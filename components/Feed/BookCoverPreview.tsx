import Image from 'next/image';
import React from 'react';

interface Props {
    bookCover: string;
}

const BookCoverPreview = ({ bookCover }: Props) => {
    return (
        <div
            className='flex justify-center items-center bg-gradient-to-b from-white to-slate-200 h-full  w-full' 
        >
            <img
                src={bookCover}
                alt="Book Cover"
                className='w-auto max-h-60 h-64 max-w-[420px]'
            />
        </div>
    );
};

export default BookCoverPreview;
