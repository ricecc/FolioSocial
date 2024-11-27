"use client";

import { removeSavedBook, saveBook } from "@/lib/actions/books.actions";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface SaveButtonProps {
    userId: string;
    bookId: string;
    saved: boolean;
}

const WantToRead = ({ userId, bookId, saved }: SaveButtonProps) => {
    const [isSaved, setIsSaved] = useState(saved);
    const path = usePathname();

    // Funzione per ottenere la data corrente in un formato leggibile
    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleString("it-IT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });
    };

    const handleSavePost = async (event: React.MouseEvent) => {
        event.stopPropagation();
        if (isSaved) {
            toast("Libro tolto dagli elementi salvati", {
                description: getCurrentDate(), // Usa la data corrente
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            await removeSavedBook({ userId, bookId, path });
            setIsSaved(false);
            // Mostra toast quando viene rimosso
           
        } else {
            toast("Libro aggiunto tra gli elementi salvati", {
                description: getCurrentDate(), // Usa la data corrente
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            });
            await saveBook({ userId, bookId, path });
            setIsSaved(true);
            // Mostra toast quando viene aggiunto
           
        }
    };

    const handleClick = (event: React.MouseEvent) => {
        handleSavePost(event);
    };

    return (
        <div
            className="hover:bg-slate-900 hover:text-zinc-50 w-full h-[70px] flex items-center justify-start cursor-pointer px-8"
            onClick={handleClick}
        >
            <p className="font-fontMain lg:text-2xl text-md">
                {isSaved ? "Saved" : "Want to read"}
            </p>
        </div>
    );
};

export default WantToRead;
