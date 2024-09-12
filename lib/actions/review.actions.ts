"use server";

import Post from "../models/post.model";
import Review from "../models/review.model";
import { connectToDB } from "../mongoose";

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