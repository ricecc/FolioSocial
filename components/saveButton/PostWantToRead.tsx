"use client"; 

import { removeSavedBook, saveBook } from "@/lib/actions/books.actions";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";


interface SaveButtonProps {
    userId: string;
    bookId: string;
    saved: boolean;
}

const WantToRead = ({ userId, bookId, saved }:SaveButtonProps) => {
    const [isSaved, setIsSaved] = useState(saved);
    const path = usePathname();
    
    const handleSavePost = async (event: React.MouseEvent) => {
        event.stopPropagation();
            if (isSaved) {
                await removeSavedBook({ userId, bookId,path });
                setIsSaved(false);
            } else {
                
                await saveBook({ userId, bookId,path });
                setIsSaved(true);
            }
       
    };

    return (

        <div className=" hover:bg-slate-900   w-full h-full  flex items-center justify-center  cursor-pointer px-8 " onClick={handleSavePost} >
            <p className="font-fontMain lg:text-2xl text-md">{isSaved ? "Saved" : "Want to read"}</p>
        </div>

    );
};

export default WantToRead;
