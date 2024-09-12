import React from 'react';

interface Props {
    bookCover: string;
}

const BookCoverPreview = ({ bookCover }: Props) => {
    return (
        <div
            className='flex justify-center items-center bg-red-200 '
            
        >
            <img
                src={bookCover}
                alt="Book Cover"
                className='w-auto max-h-60 shadow-xl'
            />
        </div>
    );
};

export default BookCoverPreview;
