"use server";

import Post from "../models/post.model";
import Quote from "../models/quote.model";
import { connectToDB } from "../mongoose";

interface QuoteProps{
    page:string,
    quote:string,
    postId:string
}
export async function createQuote({ page, quote,postId }: QuoteProps) {
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