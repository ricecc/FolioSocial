"use server";


import Post from "../models/post.model";
import Quote from "../models/quote.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
interface QuoteProps {
    page: string,
    quote: string,
    postId: string
}
export async function createQuote({ page, quote, postId }: QuoteProps) {
    try {

        connectToDB();
        const newQuote = await Quote.create({
            postId,
            page,
            quote,
            createdAt: new Date(),
        });


        await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { quotes: newQuote._id } },
            { new: true }
        );
        return newQuote;

    } catch (error: any) {
        throw new Error(`Failed to create quote: ${error.message}`);
    }
}

interface PropsLikeSave {
    fromUserId: String,
    toElement: String,
    path: string,
}


export async function putLikeToQuote({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start putLikeToQuote")
    try {
        // Connessione al database
        connectToDB();

        // Trova il post e aggiorna l'array dei "likes"
        const updatedQuote = await Quote.findByIdAndUpdate(
            toElement,
            { $addToSet: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
            { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
        );

        const updatedUser = await User.findByIdAndUpdate(
            fromUserId,
            { $addToSet: { quoteLiked: toElement } }, // Usa $addToSet per evitare duplicati
            { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
        );

        if (!updatedQuote) {
            throw new Error('Quote to like not found');
        }
        if (!updatedUser) {
            throw new Error('User faild')
        }
        revalidatePath(path)
        return { success: true };
    } catch (error: any) {
        throw new Error(`Failed to put like to quote: ${error.message}`);
    }
}

export async function removeLikeToQuote({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start removeLike");

    try {
        // Assicurati che la connessione al DB sia completata prima di proseguire
        await connectToDB();

        const updatedQuote = await Quote.findByIdAndUpdate(
            toElement,
            { $pull: { like: fromUserId } },
            { new: true }
        );

        const updatedUser = await User.findByIdAndUpdate(
            fromUserId,
            { $pull: { quoteLiked: toElement } },
            { new: true }
        );

        if (!updatedQuote) {
            throw new Error('Quote not found while trying to remove like');
        }
        if (!updatedUser) {
            throw new Error('User not found while trying to update liked quotes');
        }


        revalidatePath(path);

        return { success: true };
    } catch (error: any) {
        console.error("Failed to remove like:", error);
        throw new Error(`Failed to remove like: ${error.message}`);
    }
}

export async function saveQuote({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start saveQuote")
    try {
     
      connectToDB();
  
      
      const updatedQuote = await Quote.findByIdAndUpdate(
        toElement,
        { $addToSet: { saved: fromUserId } }, 
        { new: true, useFindAndModify: false } 
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        fromUserId,
        { $addToSet: { quoteSaved: toElement } }, 
        { new: true, useFindAndModify: false }
      );
  
      if (!updatedQuote) {
        throw new Error('Quote to save not found');
      }
      if (!updatedUser) {
        throw new Error('User faild')
      }
      revalidatePath(path)
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to put save quote: ${error.message}`);
    }
  }
  
  export async function removeSaveQuote({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start removeSaveQuote")
    try {
     
      connectToDB();
  
      
      const updatedQuote = await Quote.findByIdAndUpdate(
        toElement,
        { $pull: { saved: fromUserId } }, 
        { new: true, useFindAndModify: false } 
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        fromUserId,
        { $pull: { quoteSaved: toElement } }, 
        { new: true, useFindAndModify: false }
      );
  
      if (!updatedQuote) {
        throw new Error('Quote to remove not found');
      }
      if (!updatedUser) {
        throw new Error('User faild')
      }
      revalidatePath(path)
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to put remove quote: ${error.message}`);
    }
  }