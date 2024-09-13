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
    await connectToDB(); 

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
        path: 'quoteSaved',
        select: 'page quote'
      })
      .populate({
        path: 'reviewSaved',
        select: 'title review'
      })
      .populate({
        path: 'savedBooks',
        select: 'largeImage title author'
      })
      .populate({
        path: 'follow',
        select: 'id username'
      })
      .populate({
        path: 'follower',
        select: 'id username'
      })
      .select('imageSaved onboarded image username name');

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

interface FollowProps {
  fromUserId: string,
  toUserId: string,
  path: string
}
export async function startFollow({ fromUserId, toUserId, path }: FollowProps) {
  try {
    connectToDB()
    const fromUserUpdate = await User.findByIdAndUpdate(
      fromUserId,
      { $addToSet: { follow: toUserId } },
      { new: true, useFindAndModify: false }
    );

    const toUserUpdate = await User.findByIdAndUpdate(
      toUserId,
      { $addToSet: { follower: fromUserId } },
      { new: true, useFindAndModify: false }
    );
    if (!fromUserUpdate || !toUserUpdate) {
      return { success: false }
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to start follow User: ${error.message}`);
  }
}

export async function removeFollow({ fromUserId, toUserId, path }: FollowProps) {
  try {
    connectToDB()
    const fromUserUpdate = await User.findByIdAndUpdate(
      fromUserId,
      { $pull: { follow: toUserId } },
      { new: true, useFindAndModify: false }
    );

    const toUserUpdate = await User.findByIdAndUpdate(
      toUserId,
      { $pull: { follower: fromUserId } },
      { new: true, useFindAndModify: false }
    );
    if (!fromUserUpdate || !toUserUpdate) {
      return { success: false }
    }
    revalidatePath(path)
    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to start remove follow User: ${error.message}`);
  }
}



//ZONA LIKEs

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

export async function searchUsers(query: string) {
  try {
    connectToDB();

    //implementare anche la ricerca per nome e congome, modificare on boarding
    const users = await User.find(
      {
        username: { $regex: query, $options: 'i' }
      }
    )
      .select('id image username')
      .limit(7);

    return users;
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}