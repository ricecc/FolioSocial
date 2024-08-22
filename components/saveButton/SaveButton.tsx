"use client"; // Assicurati che sia un client component

import React, { useState, useEffect } from "react";
import { saveBook, removeSavedBook } from "@/lib/actions/user.actions"; // Importa anche removeSavedBook

interface SaveButtonProps {
  userId: string;  
  bookId: string;  
  saved: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ userId, bookId, saved }) => {
  const [isSaved, setIsSaved] = useState(saved);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const handleSavePost = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      if (isSaved) {
        // Rimuovi il libro se è già salvato
        await removeSavedBook({ userId, bookId });
        setIsSaved(false);
      } else {
        // Salva il libro se non è ancora salvato
        await saveBook({ userId, bookId });
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error(`Failed to update save status: ${error.message}`);
    }
  };

  return (
    <div
      className={`p-2  bg-zinc-50 flex justify-center items-center cursor-pointer ${
        isSaved ? "bg-black" : "bg-red-500 hover:bg-slate-200"
      }`}
      onClick={handleSavePost}
    >
      <p className="text-black text-sm">{isSaved ? "saved" : "want to read"}</p>
    </div>
  );
};

export default SaveButton;
