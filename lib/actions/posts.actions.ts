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
  interface Params {
    author: string,
    book: string;
    review?: string;
    quote?:string;
    image?: string;
    path: string;
    genre: string;
    affiliateUrl: string;
    tags:string[]
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
        review: review ? [review] : [], 
        quotes: quote ? [quote] : [],  
      };
  
     
      const createPost = await Post.create(newPostData);
  
      
      await User.findByIdAndUpdate(author, {
        $push: { posts: createPost._id },
      });
      revalidatePath(path);
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
        select: 'username image'  // Seleziona solo il campo username dell'autore
      })
      .populate({
        path: 'book',
        model: Book,
        select: 'title author'
      })
      .populate({
        path:'tags',
        model:Tag,
      }).exec();
    return post

  } catch (error: any) {
    console.error("Error while fetching post:", error.message);
    throw new Error("Unable to fetch thread");
  }
}

export async function fetchPostsFeed() {
  console.log("Start fetchPostsFeed")
  try {
    console.log("Attempting to connect to DB...");
    connectToDB();
    console.log("Successfully connected to DB");

    console.log("Fetching posts...");
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        model: User,
      })
      .populate({
        path: 'book',
        model: Book
      })
      .exec();

    console.log("Posts fetched successfully");
    return posts;
  } catch (error: any) {
    console.error("Error while fetching feed post:", error.message);
    throw new Error("Unable to fetch Post");
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
        model: User
      })
      .populate({
        path:'book',
        model:Book,
        select:'id'
      })
      .sort({ score: { $meta: "textScore" } }).limit(10).exec();


    return similarPosts;
  } catch (error: any) {
    throw new Error(`Error to fetch similar posts: ${error.message}`);
  }
}



export async function getPostsByTag(tagId:string) {
  console.log("start getPostsByTag")
  try {
    connectToDB();
    const posts = await Post.find({ tags: tagId })
    .populate({
      path:'author',
      model:User,
      select:'id image username'
    })
    .populate({
      path:'book',
      model:Book,
      select:'id largeImage'
    });
    return posts
  } catch (error:any) {
    throw new Error(`Error to get  posts by tag: ${error.message}`);
  }
}