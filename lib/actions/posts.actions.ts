"use server";
import mongoose from 'mongoose';
import Post from '../models/post.model';
import { connectToDB } from '../mongoose';
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Book from '../models/book.model';
import { ObjectId } from 'mongodb';
import { createTag } from './tag.actions';
import Tag from '../models/tag.model';
import Quote from '../models/quote.model';
import Review from '../models/review.model';
import Comment from '../models/comment.model';
interface Params {
  author: string,
  book: string;
  review?: string;
  quote?: string;
  image?: string;
  path: string;
  genre: string;
  affiliateUrl: string;
  tags: string[],
  postImages: string[]
}


export async function createPost({
  author,
  book,
  review,
  image,
  path,
  genre,
  affiliateUrl,
  tags,
  quote,
  postImages
}: Params) {
  console.log("Start createPost");
  try {
    connectToDB();

    const newPostData = {
      author,
      book,
      image,
      genre,
      affiliateUrl,
      tags,
      postImages,
      reviews: review ? [review] : [],
      quotes: quote ? [quote] : [],
    };


    const createPost = await Post.create(newPostData);


    await User.findByIdAndUpdate(author, {
      $push: { posts: createPost._id },
    });
  
    revalidatePath(path);
    return createPost._id
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

}

export async function fetchPostById(postId: string) {
  console.log("Start fetchPostById")
  try {
    connectToDB();
    const post = await Post.findById(postId)
      .populate({
        path: 'author',
        select: 'username image id'  // Seleziona solo il campo username dell'autore
      })
      .populate({
        path: 'book',
        model: Book,
        select: 'title author'
      })
      .populate({
        path: 'tags',
        model: Tag,
      })
      .populate({
        path: 'quotes',
        model: Quote,
        select: "quote page comments",
        populate:{
          path:'like',
          model:User,
          select:'id image username name lastName'
        }
      })
      .populate({
        path: 'reviews',
        model: Review,
        select: "review title comments",
        populate:{
          path:'like',
          model:User,
          select:'id image username name lastName'
        }

      })
      .exec();
      const data = JSON.parse(JSON.stringify(post))
     
    return data

  } catch (error: any) {
    console.error("Error while fetching post:", error.message);
    throw new Error("Unable to fetch thread");
  }
}

export async function fetchPostsFeed(pageNumber = 1, pageSize = 3) {
  console.log("Start fetchPostsFeed");

  try {
    await connectToDB();

    // Calcola l'importo da saltare
    const skipAmount = (pageNumber - 1) * pageSize;


    
    // Crea una query per ottenere i post con la paginazione
    const postsQuery = Post.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount) // Applica lo skip
      .limit(pageSize) // Limita i risultati
      .populate({
        path: 'author',
        model: User,
      })
      .populate({
        path: 'book',
        model: Book,
        select: "title author",
      })
      .populate({
        path: 'like',
        model: User,
        select: 'id image username name lastName',
      })
      .populate({
        path: 'quotes',
        model: Quote,
        select: "quote",
      });
  
    // Conta il numero totale di post
    const totalPostsCount = await Post.countDocuments();

    // Esegui la query
    const posts = await postsQuery.exec();
     // Converti i post in plain objects
     

    // Verifica se ci sono altri post disponibili per la pagina successiva
    const isNext = totalPostsCount > skipAmount + posts.length;
   
    const data = JSON.parse(JSON.stringify(posts))
    
    console.log("Posts fetched successfully");

    return { posts: data, isNext };
  } catch (error: any) {
    console.error("Error while fetching posts feed:", error.message);
    throw new Error("Unable to fetch posts");
  }
}


export async function fetchSimilarPosts(postId: string) {
  console.log("Start fetchSimilarPosts")
  try {

    await connectToDB();

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }


    if (!post.genre) {
      throw new Error('Genre is missing in the post');
    }



    const similarPosts = await Post.find(
      {
        _id: { $ne: new ObjectId(postId) },
        $text: { $search: post.genre },
      },
      {
        score: { $meta: "textScore" }
      }
    )
      .populate({
        path: 'author',
        model: User,
        select: 'id image username'
      })
      .populate({
        path: 'book',
        model: Book,
        select: 'id title author'
      })
      .populate({
        path:'quotes',
        model:Quote,
        select:'quote'
      })
      .select('image postImages like')
      .sort({ score: { $meta: "textScore" } }).limit(6).exec();

      const jsonPosts = JSON.parse(JSON.stringify(similarPosts));
     
      return jsonPosts
  } catch (error: any) {
    throw new Error(`Error to fetch similar posts: ${error.message}`);
  }
}



export async function getPostsByTag(tagId: string) {
  console.log("start getPostsByTag")
  try {
    connectToDB();
    const posts = await Post.find({ tags: tagId })
      .populate({
        path: 'author',
        model: User,
        select: 'id image username'
      })
      .populate({
        path: 'book',
        model: Book,
        select: 'id largeImage'
      });
    return posts
  } catch (error: any) {
    throw new Error(`Error to get  posts by tag: ${error.message}`);
  }
}




interface updateQuoteProps {
  postId: string,
  newQuote: string,
  quote: string,
  pathname: string
}
export async function updatePostQuote({ postId, newQuote, quote, pathname }: updateQuoteProps) {
  try {
    connectToDB()

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, quotes: quote },
      { $set: { "quotes.$": newQuote } },
      { new: true }
    );


    if (!updatedPost) {
      return false
    }


    revalidatePath(pathname);
    return true;
  } catch (error: any) {
    throw new Error(`Error to update quote:${error.message}`)
  }
}

interface updateReviewProps {
  postId: string,
  newReview: string,
  oldReview: string,
  path: string
}
export async function updatePostReview({ postId, newReview, oldReview, path }: updateReviewProps) {
  try {
    connectToDB()


    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, review: oldReview },
      { $set: { "review.$": newReview } },
      { new: true }
    );


    if (!updatedPost) {
      return false;
    }


    revalidatePath(path);
    return true;
  } catch (error: any) {
    throw new Error(`Error to update quote:${error.message}`)
  }
}

export async function removePostQuote(postId: string, quoteToRemove: string, path: string) {
  try {
    connectToDB()
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { quotes: quoteToRemove } },
      { new: true }
    );


    if (!updatedPost) {
      return false
    }


    revalidatePath(path);
    return true
  } catch (error: any) {
    throw new Error(`Error to update quote:${error.message}`)
  }
}

export async function removePostReview(postId: string, reviewToRemove: string, path: string) {
  try {
    connectToDB()

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { review: reviewToRemove } },
      { new: true }
    );


    if (!updatedPost) {
      return false
    }


    revalidatePath(path);
    return true
  } catch (error: any) {
    throw new Error(`Error to update quote:${error.message}`)
  }
}

interface PropsLikeSave {
  fromUserId: String,
  toElement: String,
  path: string,
}
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
    console.log("path",path)

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
    console.log("pat",path)
    

    return { success: true };
  } catch (error: any) {
    throw new Error(`Failed to remove like: ${error.message}`);
  }
}


export async function deletePost(id: string, path: string): Promise<void> {
  try {
    // Connetti al database
    await connectToDB();

    // Trova il post da eliminare
    const post = await Post.findById(id).populate("author");

    if (!post) {
      throw new Error("Post not found");
    }

    // Elimina le quote associate al post
    const deleteQuotes = Quote.deleteMany({ _id: { $in: post.quotes } });

    // Elimina le review associate al post
    const deleteReviews = Review.deleteMany({ _id: { $in: post.reviews } });

    // Elimina i commenti associati al post
    const deleteComments = Comment.deleteMany({ _id: { $in: post.comments } });

    // Rimuovi il post dall'array `posts` dell'autore
    const updateUser = User.findByIdAndUpdate(
      post.author._id,
      { $pull: { posts: post._id } }, // Rimuovi il post dall'array posts
      { new: true }
    );

    // Elimina il post
    const deletePost = Post.findByIdAndDelete(id);

    // Esegui tutte le eliminazioni in parallelo
    await Promise.all([deleteQuotes, deleteReviews, deleteComments, updateUser, deletePost]);
    revalidatePath(path)
    console.log("Post and related entities deleted successfully, and user updated.");
  } catch (error: any) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}