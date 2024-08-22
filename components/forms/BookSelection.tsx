import React from "react";

interface Book {
    _id: string;
    title: string;
    titleUrl: string;
    smallImage: string;
    author: string;
    publisher: string;
    largeImage: string;
    description: string;
    ean: string;
    genre1: string;
    genre2: string;
    genre3: string;
    year: string;
}


interface BookSelectionProps {
    selectedBook?: Book;
    onBookClick: (book: Book) => void;
    getBooks: (searchTerm: string) => void;
    termResult: Book[];
}

const BookSelection: React.FC<BookSelectionProps> = ({
    selectedBook,
    onBookClick,
    getBooks,
    termResult,
}) => {
    return (
       
            <div className="flex flex-col w-full space-y-2 font-fontMain">
                <label >Titolo</label>
                <input
                    type="text"
                    className=" border-b border-slate-900 w-full focus:outline-none focus:border-hoverTag"
                    placeholder="cerca"
                    onChange={(e) => getBooks(e.target.value)}
                />
                <div
                    className={`w-full top-3  border-b border-slate-900 p-2 mt-4 ${termResult.length > 0 ? '' : 'hidden'}`}
                >
                    {termResult.length > 0 ? (
                        <ul className="w-full">
                            {termResult.map((book) => (
                                <li
                                    key={book._id}
                                    className="cursor-pointer hover:bg-slate-100 p-2 w-full"
                                    onClick={() => onBookClick(book)}
                                >
                                    <div className="flex flex-row justify-start items-center space-x-2">
                                        <img src={book.smallImage} alt="" className="w-5 h-8" />
                                        <p>{book.title}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            </div>
       
    );
};

export default BookSelection;
