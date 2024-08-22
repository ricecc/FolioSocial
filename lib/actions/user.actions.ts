"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

import { FilterQuery, SortOrder } from "mongoose";
import Post from "../models/post.model";
import Book from "../models/book.model";



interface Params{
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}


export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    try {
      connectToDB();
  
      await User.findOneAndUpdate(
        { id: userId },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },
        { upsert: true }
      );
  
      if (path === "/profile/edit") {
        revalidatePath(path);
      }
    } catch (error: any) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
  }

  export async function fetchUser(userId: string){
    console.log("Start fetchUser")
    try {
        connectToDB()

        return await User.findOne({id: userId})
                         /*.populate({
                            path: 'Communities',
                            model: Community
                         })*/
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId:string) {
  console.log("Start FetchUserPost")
  try {
    connectToDB();
    const user = await User.findOne({id:userId})
    .populate({
      path: 'posts',
      model: Post,
      populate: {
        path: 'like',
        model: 'User',
        select: '_id username', // Seleziona i campi necessari
      },
    });
    return user;
  } catch (error:any) {
    throw new Error(`Faild to fetch user posts: ${error.message}`)
  }
}

export async function fetchUserSavedBooks(userId:string) {
  console.log("Start fetchUserSavedBooks")
  try {
    connectToDB();
    const books = await User.findOne({id:userId})
    .populate({
      path: 'savedBooks',
      model: Book, // Campo nei documenti User che fa riferimento ai post salvati
      select:'_id largeImage'
    }).select('savedBooks')
    return books;
  } catch (error:any) {
    throw new Error(`Faild to fetch user saved posts: ${error.message}`)
  }
}




interface Props{
  userId:String,
  bookId:String,
}
export async function saveBook({userId, bookId}:Props){
  console.log("Start saveBook")
  try {
    await connectToDB();

    
    // Trova l'utente
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedBooks: bookId } },  // Utilizza $addToSet per evitare duplicati
      { new: true, useFindAndModify: false }  // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );


    return user;

    
  } catch (error:any) {
    throw new Error(`Faild to save post: ${error.message}`)
  }
}

export async function removeSavedBook({ userId, bookId }: Props) {
  console.log("Start removeSavedBook")
  try {
    await connectToDB();

    // Trova l'utente e rimuove bookId da savedBooks
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedBooks: bookId } },  // Utilizza $pull per rimuovere bookId
      { new: true, useFindAndModify: false }  // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

  
    return user;

  } catch (error: any) {
    throw new Error(`Failed to remove book: ${error.message}`);
  }
}


interface PutLikeProps{
  fromUserId:String,
  toPostId:String,
  path:string,
}
export async function putLike({ fromUserId, toPostId,path }: PutLikeProps) {
  console.log("Start putLike")
  try {
    // Connessione al database
    await connectToDB();
    
    // Trova il post e aggiorna l'array dei "likes"
    const updatedPost = await Post.findByIdAndUpdate(
      toPostId,
      { $addToSet: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    if (!updatedPost) {
      throw new Error('Post to like not found');
    }
    revalidatePath(path)
    return { success: true, post: updatedPost };
  } catch (error: any) {
    throw new Error(`Failed to put like: ${error.message}`);
  }
}

export async function removeLike({ fromUserId, toPostId,path }: { fromUserId: string, toPostId: string,path:string }) {
  console.log("Start removeLike");
  try {
    // Connessione al database
    await connectToDB();
    
    // Trova il post e aggiorna l'array dei "likes" rimuovendo il like dell'utente
    const updatedPost = await Post.findByIdAndUpdate(
      toPostId,
      { $pull: { like: fromUserId } }, // Usa $pull per rimuovere l'ID dell'utente dall'array "like"
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    if (!updatedPost) {
      throw new Error('Post to remove like from not found');
    }
    revalidatePath(path)
    return { success: true, post: updatedPost };
  } catch (error: any) {
    throw new Error(`Failed to remove like: ${error.message}`);
  }
}