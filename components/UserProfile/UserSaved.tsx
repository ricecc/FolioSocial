import React, { useState } from 'react'
import ImageDialog from '../ImageDialog/ImageDialog'
import BookPreview from '../BookPreview/BookPreview'
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
interface UserSavedProps {

    quoteLiked: quoteLiked[],
    reviewLiked: reviewLiked[],
    savedBooks: savedBooks[],
    imageLiked: string[],

}
const UserSaved = ({ quoteLiked, reviewLiked, savedBooks, imageLiked }: UserSavedProps) => {
    const [type, setType] = useState<'books' | 'quotes' | 'notes' | 'pictures'>('books')
    const renderContent = () => {
        switch (type) {
            case 'books':
                return (
                    <div>
                        {savedBooks.map((book) => (
                            <div key={book.id}>
                                <BookPreview id={book.id} largeImage={book.largeImage}></BookPreview>
                            </div>
                        ))}
                    </div>
                );
            case 'quotes':
                return (
                    <div className='flex flex-row gap-2  '>
                        {quoteLiked.map((quote) => (
                            <div key={quote.id} className="p-4 min-w-72 min-h-48  border flex justify-between flex-col ">
                                <div className="flex justify-center items-center min-h-24">
                                    <p className="font-fontMain">"{quote.quote}"</p>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <span>page:12</span>
                                </div>

                            </div>
                        ))}
                    </div>
                );
            case 'notes':
                return (
                    <div className='flex flex-row gap-2'>
                        {reviewLiked.map((review) => (
                            <div key={review.id} className=" p-4 min-w-72 max-w-[375px] min-h-48 border border-gray-300 rounded  space-y-4">
                                <h3 className="text-lg font-bold">{review.title}</h3>
                                <p>{review.review}</p>

                            </div>
                        ))}
                    </div>
                );
            case 'pictures':
                return (
                    <div className='flex flex-row gap-2'>
                        {imageLiked.map((image, index) => (
                            <div key={index} className="flex justify-center min-h-48  min-w-72 max-w-[375px]">
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
        <div className='flex fle-row w-full h-full'>
            <div className='flex justify-center w-1/4  '>
                <ul className="space-y-5  bg-zinc-50 shadow-xl h-min p-10 rounded-sm">
                    <li className={`cursor-pointer flex justify-center items-center ${type === 'books' ? 'border-b-2 border-slate-700' : ''}`} onClick={() => setType('books')}><p>Books</p></li>
                    <li className={`cursor-pointer flex justify-center items-center ${type === 'quotes' ? 'border-b-2 border-slate-700' : ''}`} onClick={() => setType('quotes')}><p>Quotes</p></li>
                    <li className={`cursor-pointer flex justify-center items-center ${type === 'notes' ? 'border-b-2 border-slate-700' : ''}`} onClick={() => setType('notes')}><p>Notes</p></li>
                    <li className={`cursor-pointer flex justify-center items-center ${type === 'pictures' ? 'border-b-2 border-slate-700' : ''}`} onClick={() => setType('pictures')}><p>Pictures</p></li>
                </ul>
            </div>

            <div className="w-3/4  ">
              
                    {renderContent()}
               
            </div>
        </div>
    )
}

export default UserSaved
