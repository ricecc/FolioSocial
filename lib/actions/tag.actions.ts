"use server";
import mongoose from 'mongoose';
import Tag from '../models/tag.model'
import { connectToDB } from '../mongoose';

export async function createTag(names: string[]) {
    console.log("Start createTag")
    try {
        connectToDB(); 
        const tags = await Promise.all(names.map(async (name) => {
           
            let tag = await Tag.findOne({ name });
            
            if (!tag) {
                tag = await Tag.create({ name });
            }
            
            return tag;
        }));
        return tags;
    } catch (error: any) {
        throw new Error(`Failed to create or update tag: ${error.message}`);
    }
}

export async function findTagByName(tagName:string){
    console.log("Start findTagByName")
    try {
        connectToDB()
        const tag = await  Tag.findOne({name:tagName});
        return tag;
    } catch (error:any) {
        throw new Error(`Failed to find  tag: ${error.message}`);
    }
}



export async function updateTagWithPostId(tagName: string,post: string) {
    console.log("Start updateTagWithPostId")
    try {
        connectToDB()
        const result = await Tag.updateOne(
            {name: tagName }, 
            { $push: { postId: post } } 
        );
        return result
    } catch (error:any) {
        throw new Error(`Failed to update tag: ${error.message}`);
    }
}