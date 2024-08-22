"use client"; 

import React from "react";
import { useRouter } from "next/navigation"; // Use the correct import for useRouter

interface SaveButtonProps {
    userId: string;
    bookId: string;
}

const NewInksButton = ({ userId, bookId }: SaveButtonProps) => {
    const router = useRouter();

    const handleSavePost = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
             router.push(`/spillInk/${userId}/${bookId}`); // Ensure that await is used if needed
        } catch (error: any) {
            console.error(`Failed to navigate: ${error.message}`);
        }
    };

    return (
        <div
            className="h-16 bg-white hover:bg-slate-800 border-l  hover:text-white text-slate-800 flex items-center justify-between border-t border-slate-600 cursor-pointer px-8"
            onClick={handleSavePost}
        >
            <p className="font-fontMain text-2xl">Spill new Ink</p>
            <img src="/assets/arrow.svg" alt="notification" width={24} height={24} className="object-contain" />
        </div>
    );
};

export default NewInksButton;
