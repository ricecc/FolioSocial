"use server"
import Book from "../models/book.model";
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

  } catch (error:any) {
    console.error("Error while fetching thread:", error.message);
    throw new Error("Unable to fetch thread");
  }
}

export async function searchBooks(query: string) {
  try {
    await connectToDB();

    // Cerca libri basati sul titolo con un'espressione regolare
    const books = await Book.find(
      {
        title: { $regex: query, $options: 'i' } // Cerca il query nel titolo, ignorando maiuscole/minuscole
      }
    ).limit(7); // Limita i risultati a 7 libri

    return books;
  } catch (error) {
    console.error('Failed to fetch books by title:', error);
    return []; 
  }
}
