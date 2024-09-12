"use server";

import Post from "../models/post.model";
import Review from "../models/review.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
interface ReviewProps {
    title: string,
    review: string,
    postId: string
}
export async function createReview({ title, review, postId }: ReviewProps) {
    try {

        connectToDB();
        const newReview = await Review.create({
            postId,
            title,
            review,
            createdAt: new Date(),
        });
       
        await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { reviews: newReview._id } }, 
            { new: true } 
        );

        return newReview;
    } catch (error: any) {
        throw new Error(`Failed to create review: ${error.message}`);
    }
}

interface PropsLikeSave {
    fromUserId: String,
    toElement: String,
    path: string,
}

export async function putLikeToReview({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start putLikeToReview")
    try {
      // Connessione al database
      connectToDB();
  
      // Trova il post e aggiorna l'array dei "likes"
      const updatedReview = await Review.findByIdAndUpdate(
        toElement,
        { $addToSet: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
        { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        fromUserId,
        { $addToSet: { reviewLiked: toElement } }, // Usa $addToSet per evitare duplicati
        { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
      );
  
      if (!updatedReview) {
        throw new Error('Review to like not found');
      }
      if (!updatedUser) {
        throw new Error('User faild')
      }
      revalidatePath(path)
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to put like to review: ${error.message}`);
    }
  }
  
  export async function removeLikeToReview({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start putLikeToReview")
    try {
      // Connessione al database
      connectToDB();
  
      // Trova il post e aggiorna l'array dei "likes"
      const updatedReview = await Review.findByIdAndUpdate(
        toElement,
        { $pull: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
        { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        fromUserId,
        { $pull: { reviewLiked: toElement } }, // Usa $addToSet per evitare duplicati
        { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
      );
  
      if (!updatedReview) {
        throw new Error('Review to like not found');
      }
      if (!updatedUser) {
        throw new Error('User faild')
      }
      revalidatePath(path)
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to put like to review: ${error.message}`);
    }
  }

  export async function saveReview({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start saveReview")
    try {
      
      connectToDB();
  
     
      const updatedReview = await Review.findByIdAndUpdate(
        toElement,
        { $addToSet: { saved: fromUserId } },
        { new: true, useFindAndModify: false } 
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        fromUserId,
        { $addToSet: { reviewSaved: toElement } }, 
        { new: true, useFindAndModify: false } 
      );
  
      if (!updatedReview) {
        throw new Error('Review to save not found');
      }
      if (!updatedUser) {
        throw new Error('User faild')
      }
      revalidatePath(path)
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to save review: ${error.message}`);
    }
  }
  export async function removeSaveReview({ fromUserId, toElement, path }: PropsLikeSave) {
    console.log("Start removeSaveReview")
    try {
      
      connectToDB();
  
     
      const updatedReview = await Review.findByIdAndUpdate(
        toElement,
        { $pull: { saved: fromUserId } },
        { new: true, useFindAndModify: false } 
      );
  
      const updatedUser = await User.findByIdAndUpdate(
        fromUserId,
        { $pull: { reviewSaved: toElement } }, 
        { new: true, useFindAndModify: false } 
      );
  
      if (!updatedReview) {
        throw new Error('Review to remove not found');
      }
      if (!updatedUser) {
        throw new Error('User faild')
      }
      revalidatePath(path)
      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to remove review: ${error.message}`);
    }
  }