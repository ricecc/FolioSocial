import React, { useState } from 'react';
import ImageDialog from '../ImageDialog/ImageDialog';
import BookPreview from '../BookPreview/BookPreview';
import { Link } from 'lucide-react';

interface quoteSaved {
    id: string;
    page: string;
    quote: string;
}

interface reviewSaved {
    id: string;
    title: string;
    review: string;
}

interface savedBooks {
    id: string;
    title: string;
    author: string;
    largeImage: string;
}

interface UserSavedProps {
    quoteSaved: quoteSaved[];
    reviewSaved: reviewSaved[];
    savedBooks: savedBooks[];
    imageSaved: string[];
}

const UserSaved = ({ quoteSaved, reviewSaved, savedBooks, imageSaved }: UserSavedProps) => {
    const [type, setType] = useState<'books' | 'quotes' | 'notes' | 'pictures'>('books');

    const getColSpan = (text: string) => {

        const length = text.length;
        if (length > 100) return 'lg:col-span-3';
        if (length > 50) return 'lg:col-span-2';
        return 'lg:col-span-1';
    };

    const renderContent = () => {
        switch (type) {
            case 'books':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 p-4'>
                        {savedBooks.map((book) => (
                            <div key={book.id} className="w-56">
                                <BookPreview id={book.id} largeImage={book.largeImage} />
                            </div>
                        ))}
                    </div>
                );
            case 'quotes':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                        {quoteSaved.map((quote) => (
                            
                                <div
                                    key={quote.id}
                                    className={`p-4 border border-gray-300 rounded-lg shadow-md flex flex-col justify-between ${getColSpan(quote.quote)}`}
                                >
                                    <div className="flex justify-center items-center min-h-24">
                                        <p className="font-fontMain text-center">"{quote.quote}"</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center mt-4">
                                        <span className='text-xs'>page: <span className='text-hoverTag'>{quote.page}</span></span>
                                    </div>
                                </div>
                         
                        ))}
                    </div>
                );
            case 'notes':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                        {reviewSaved.map((review) => (
                            <div
                                key={review.id}
                                className={`p-4 border border-gray-300 rounded-lg shadow-md flex flex-col justify-between ${getColSpan(review.review)}`}
                            >
                                <h3 className="text-lg font-bold">{review.title}</h3>
                                <p>{review.review}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'pictures':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 p-4'>
                        {imageSaved.map((image, index) => (
                            <div key={index} className="flex justify-center items-center h-48 min-w-72 max-w-[375px] ">
                                <ImageDialog imageSrc={image} />
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='flex flex-col lg:flex-row w-full min-w-72 h-auto justify-center'>
            <div className='flex justify-center lg:w-1/4 h-auto'>
                <div className="lg:space-y-5 space-x-2 flex flex-row lg:flex-col items-center bg-zinc-50 shadow-xl h-min p-10 rounded-sm">
                    <div className={`cursor-pointer flex justify-center items-center ${type === 'books' ? 'border-b-2 border-slate-700' : 'border-b-2 border-white'}`} onClick={() => setType('books')}><p>Books</p></div>
                    <div className={`cursor-pointer flex justify-center items-center ${type === 'quotes' ? 'border-b-2 border-slate-700' : 'border-b-2 border-white'}`} onClick={() => setType('quotes')}><p>Quotes</p></div>
                    <div className={`cursor-pointer flex justify-center items-center ${type === 'notes' ? 'border-b-2 border-slate-700' : 'border-b-2 border-white'}`} onClick={() => setType('notes')}><p>Notes</p></div>
                    <div className={`cursor-pointer flex justify-center items-center ${type === 'pictures' ? 'border-b-2 border-slate-700' : 'border-b-2 border-white'}`} onClick={() => setType('pictures')}><p>Pictures</p></div>
                </div>
            </div>

            <div className="lg:w-3/4 w-auto" id="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default UserSaved;
