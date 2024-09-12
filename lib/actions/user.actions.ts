"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

import { FilterQuery, SortOrder } from "mongoose";
import Post from "../models/post.model";
import Book from "../models/book.model";
import { any } from "zod";
import Quote from "../models/quote.model";
import Review from "../models/review.model";



interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

interface PropsLikeSave {
  fromUserId: String,
  toElement: String,
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

export async function fetchUser(userId: string) {
  console.log("Start fetchUser")
  try {
    connectToDB()

    return await User.findOne({ id: userId })
    /*.populate({
       path: 'Communities',
       model: Community
    })*/
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export async function fetchUserInfoForProfile(userId: string) {
  console.log("Start FetchUserInfoForProfile");

  try {
    await connectToDB(); // Assicurati che la connessione al DB sia corretta

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'posts',
        model: Post,
        select: 'image',
        populate: {
          path: 'book',
          model: Book,
          select: 'title author'
        }
      })
      .populate({
        path: 'quoteLiked',
        select: 'page quote'
      })
      .populate({
        path: 'reviewLiked',
        select: 'title review'
      })
      .populate({
        path: 'savedBooks',
        select: 'largeImage title author'
      })
      .select('imageLiked onboarded image username');

    if (!user) {
      console.warn(`No user found with ID ${userId}`);
      return null;
    }
    

    return user
  } catch (error: any) {
    console.error('Error fetching user profile:', error.message);
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}



export async function fetchUserPosts(userId: string) {
  console.log("Start FetchUserPost")
  try {
    connectToDB();
    const user = await User.findOne({ id: userId })
      .populate({
        path: 'posts',
        model: Post,
        populate: {
          path: 'like',
          model: 'User',
          select: '_id username',
        },
      });
    return user;
  } catch (error: any) {
    throw new Error(`Faild to fetch user posts: ${error.message}`)
  }
}

export async function fetchUserSavedBooks(userId: string) {
  console.log("Start fetchUserSavedBooks")
  try {
    connectToDB();
    const books = await User.findOne({ id: userId })
      .populate({
        path: 'savedBooks',
        model: Book, // Campo nei documenti User che fa riferimento ai post salvati
        select: '_id largeImage'
      }).select('savedBooks')
    return books;
  } catch (error: any) {
    throw new Error(`Faild to fetch user saved posts: ${error.message}`)
  }
}


//ZONA SAVE

interface Props {
  userId: String,
  bookId: String,
}
export async function saveBook({ userId, bookId }: Props) {
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


  } catch (error: any) {
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

export async function saveImage({ fromUserId, toElement, path }: PropsLikeSave) {
  console.log("Start saveImage")
  try {
    
    connectToDB();


    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $addToSet: { imageSaved: toElement } },
      { new: true, useFindAndModify: false } 
    );


    if (!updatedUser) {
      throw new Error('User faild')
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to SAVE image: ${error.message}`);
  }
}
export async function removeSaveImage({ fromUserId, toElement, path }: PropsLikeSave) {
  console.log("Start removeSaveImage")
  try {
    
    connectToDB();


    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $pull: { imageSaved: toElement } },
      { new: true, useFindAndModify: false } 
    );


    if (!updatedUser) {
      throw new Error('User faild')
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to remove image: ${error.message}`);
  }
}

//FINE ZONA SAVE






//ZONA LIKE


export async function putLikeToPost({ fromUserId, toElement, path }: PropsLikeSave) {
  console.log("Start putLike")
  try {
    // Connessione al database
    connectToDB();

    // Trova il post e aggiorna l'array dei "likes"
    const updatedQuote = await Post.findByIdAndUpdate(
      toElement,
      { $addToSet: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $addToSet: { postLiked: toElement } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    if (!updatedQuote) {
      throw new Error('Post to like not found');
    }
    if (!updatedUser) {
      throw new Error('User faild')
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to put like: ${error.message}`);
  }
}

export async function removeLikeToPost({ fromUserId, toElement, path }: PropsLikeSave) {
  console.log("Start removeLike");
  try {
    // Connessione al database
    connectToDB();

    // Trova il post e aggiorna l'array dei "likes"
    const updatedQuote = await Post.findByIdAndUpdate(
      toElement,
      { $pull: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $pull: { postLiked: toElement } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    if (!updatedQuote) {
      throw new Error('Post to like not found');
    }
    if (!updatedUser) {
      throw new Error('User faild')
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to remove like: ${error.message}`);
  }
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
    // Connessione al database
    connectToDB();

    // Trova il post e aggiorna l'array dei "likes"
    const updatedQuote = await Quote.findByIdAndUpdate(
      toElement,
      { $pull: { like: fromUserId } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $pull: { quoteLiked: toElement } }, // Usa $addToSet per evitare duplicati
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
    throw new Error(`Failed to remove like: ${error.message}`);
  }
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

export async function putLikeToImage({ fromUserId, toElement, path }: PropsLikeSave) {
  console.log("Start putLikeToImage")
  try {
    // Connessione al database
    connectToDB();


    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $addToSet: { imageLiked: toElement } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );


    if (!updatedUser) {
      throw new Error('User faild')
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to put like to image: ${error.message}`);
  }
}
export async function removeLikeToImage({ fromUserId, toElement, path }: PropsLikeSave) {
  console.log("Start putLikeToImage")
  try {
    // Connessione al database
    connectToDB();


    const updatedUser = await User.findByIdAndUpdate(
      fromUserId,
      { $pull: { imageLiked: toElement } }, // Usa $addToSet per evitare duplicati
      { new: true, useFindAndModify: false } // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );


    if (!updatedUser) {
      throw new Error('User faild')
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to put like to image: ${error.message}`);
  }
}
//FINE ZONA LIKE

interface Post {

}
export async function getUserPostByBookId(userId: string, bookId: string) {
  try {
    connectToDB()
    const user = await User.findById(userId).populate({
      path: 'posts',
      match: { book: bookId },
      select: 'title content book'
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.posts.length === 0) {
      return false
    }
    return user.posts[0]._id;
  } catch (error: any) {
    throw new Error(`Faild to get user post by book id:${error.message}`)
  }
}