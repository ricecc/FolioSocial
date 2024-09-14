"use server"
import { revalidatePath } from "next/cache";
import Book from "../models/book.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";


export async function fetchBooksHome() {
  try {

    await connectToDB();


    const books = await Book.find({
      score: { $gt: 3.8 },

      published: { $gt: 2005 }
    })
      //.sort({ ratings: -1 }) // Ordina per ratings in ordine decrescente
      .limit(15);

    return books;
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export async function fetchBookById(bookId: string) {
  connectToDB();
  try {

    const book = await Book.findById(bookId).exec();
    return book

  } catch (error: any) {
    console.error("Error while fetching book:", error.message);
    throw new Error("Unable to fetch thread");
  }
}

export async function searchBooks(query: string) {
  try {
    await connectToDB();
      const books = await Book.find(
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
          ]
        }
      )
        .select('_id title author smallImage largeImage genre1 genre2 genre3')
        .limit(7);
    
    
    return books.map((book) => ({
      _id: book._id.toString(),
      title: book.title,
      author: book.author, 
      smallImage: book.smallImage,
      largeImage: book.largeImage,
      genre1:book.genre1,
      genre2:book.genre2,
      genre3:book.genre3
    }));
  } catch (error) {
    console.error('Failed to fetch books by title:', error);
    return [];
  }
}

export async function getPostsByBookId(bookId: string) {
  try {
    connectToDB()
    const posts = await Post.find({ book: bookId })
      .populate({
        path: 'author',
        select: 'id username image'  // Seleziona solo il campo username dell'autore
      })
    return posts;
  } catch (error: any) {
    throw new Error(`Failed to get Posts by book id: ${error.message}`);
  }
}

interface Props {
  userId: string,
  bookId: string,
  path: string
}
export async function saveBook({ userId, bookId, path }: Props) {
  console.log("Start saveBook")
  try {
    await connectToDB();


    // Trova l'utente
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedBooks: bookId } },  // Utilizza $addToSet per evitare duplicati
      { new: true, useFindAndModify: false }  // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    revalidatePath(path)

    return { success: true };


  } catch (error: any) {
    throw new Error(`Faild to save post: ${error.message}`)
  }
}

export async function removeSavedBook({ userId, bookId, path }: Props) {
  console.log("Start removeSavedBook")
  try {
    await connectToDB();

    // Trova l'utente e rimuove bookId da savedBooks
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedBooks: bookId } },  // Utilizza $pull per rimuovere bookId
      { new: true, useFindAndModify: false }  // Restituisce il documento aggiornato e utilizza l'opzione senza deprecare useFindAndModify
    );

    revalidatePath(path)
    return user;

  } catch (error: any) {
    throw new Error(`Failed to remove book: ${error.message}`);
  }
}
