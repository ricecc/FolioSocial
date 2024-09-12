"use client"; 

import React, { useState, useEffect } from "react";
import { saveBook, removeSavedBook } from "@/lib/actions/user.actions";

interface SaveButtonProps {
    userId: string;
    bookId: string;
    saved: boolean;
}

const WantToRead = ({ userId, bookId, saved }:SaveButtonProps) => {
    const [isSaved, setIsSaved] = useState(saved);

    useEffect(() => {
        setIsSaved(saved);
    }, [saved]);

    const handleSavePost = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            if (isSaved) {
                await removeSavedBook({ userId, bookId });
                setIsSaved(false);
            } else {
                
                await saveBook({ userId, bookId });
                setIsSaved(true);
            }
        } catch (error: any) {
            console.error(`Failed to update save status: ${error.message}`);
        }
    };

    return (

        <div className=" hover:bg-slate-900   w-full h-full  flex items-center justify-center  cursor-pointer px-8 " onClick={handleSavePost} >
            <p className="font-fontMain text-2xl">{isSaved ? "Saved" : "Want to read"}</p>
        </div>

    );
};

export default WantToRead;
