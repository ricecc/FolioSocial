"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
import Quote from "../models/quote.model";
import Review from "../models/review.model";


export async function fetchComments(refId: string, refType: 'Quote' | 'Review', pageNumber = 1, pageSize = 5) {
    try {

        connectToDB();


        const skipAmount = (pageNumber - 1) * pageSize;


        const commentsQuery = Comment.find({
            refId: refId,
            refType: refType,
            parentId: { $in: [null, undefined] }
        })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: 'author',
                select: '_id id username image'
            })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    select: '_id id username image'
                }
            });


        const totalCommentsCount = await Comment.countDocuments({
            refId: refId,
            refType: refType,
            parentId: { $in: [null, undefined] }
        });


        const comments = await commentsQuery.exec();


        const isNext = totalCommentsCount > skipAmount + comments.length;

        const jsonComments = JSON.parse(JSON.stringify(comments));

        return { comments: jsonComments, isNext };
    } catch (err) {
        console.error("Error while fetching comments:", err);
        throw new Error("Unable to fetch comments");
    }
}

interface CommentParams {
    author: string,
    refId: string,
    refType: 'Quote' | 'Review', // Aggiungi il tipo di riferimento
    text: string,
    pathname: string
}

export async function createComment({ author, refId, refType, text, pathname }: CommentParams) {
    try {
        await connectToDB();

        // Crea il nuovo commento con refType e refId
        const newComment = await Comment.create({
            author,
            refId,  // Riferimento all'entità (Post, Quote, Review)
            refType, // Specifica il tipo di riferimento
            text
        });

        // Aggiorna l'entità associata (Post, Quote o Review) con il nuovo commento
        let updatedEntity;
        if (refType === 'Quote') {
            updatedEntity = await Quote.findByIdAndUpdate(refId, {
                $addToSet: { comments: newComment._id },
            });
        } else if (refType === 'Review') {
            updatedEntity = await Review.findByIdAndUpdate(refId, {
                $addToSet: { comments: newComment._id },
            });
        }

        if (!updatedEntity) {
            throw new Error(`${refType} specificato non esiste o è stato cancellato`);
        }

        revalidatePath(pathname);
    } catch (error: any) {
        throw new Error(`Failed to create comment: ${error.message}`);
    }
}

async function fetchAllChildComments(commentId: string): Promise<any[]> {
    // Trova tutti i commenti figli che hanno come parentId il commentId dato
    const childComments = await Comment.find({ parentId: commentId });

    const descendantComments = [];

    // Itera su tutti i commenti figli trovati
    for (const childComment of childComments) {
        // Chiamata ricorsiva per trovare eventuali discendenti del commento figlio
        const descendants = await fetchAllChildComments(childComment._id);
        // Aggiungi il commento figlio e tutti i suoi discendenti alla lista finale
        descendantComments.push(childComment, ...descendants);
    }

    return descendantComments;
}

export async function deleteComment(id: string, path: string): Promise<void> {
    try {
        await connectToDB();

        // Trova il commento principale da eliminare
        const mainComment = await Comment.findById(id);

        if (!mainComment) {
            throw new Error("Comment not found");
        }

        // Recupera tutti i commenti figli e discendenti ricorsivamente
        const descendantComments = await fetchAllChildComments(id);

        // Ottieni tutti gli ID dei commenti discendenti inclusi il commento principale e i figli
        const descendantCommentsIds = [
            id,
            ...descendantComments.map((comment) => comment._id),
        ];

        // Rimuovi i commenti dall'entità associata (Post, Quote, Review)
        if (mainComment.refType === 'Post') {
            await Post.updateMany(
                { comments: { $in: descendantCommentsIds } },
                { $pull: { comments: { $in: descendantCommentsIds } } }
            );
        } else if (mainComment.refType === 'Quote') {
            await Quote.updateMany(
                { comments: { $in: descendantCommentsIds } },
                { $pull: { comments: { $in: descendantCommentsIds } } }
            );
        } else if (mainComment.refType === 'Review') {
            await Review.updateMany(
                { comments: { $in: descendantCommentsIds } },
                { $pull: { comments: { $in: descendantCommentsIds } } }
            );
        }

        // Cancella ricorsivamente tutti i commenti figli e discendenti
        await Comment.deleteMany({ _id: { $in: descendantCommentsIds } });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete comment: ${error.message}`);
    }
}
interface AddChildrenProps{
    parentCommentId: string,
    authorId: string,
    text: string,
    refId: string,
    refType:  'Quote' | 'Review',
    pathname: string
}
export async function addChildrenToComment(
    {parentCommentId,
    authorId,
    text,
    refId,
    refType,
    pathname}:AddChildrenProps
) {
    try {
        // Connessione al database
        await connectToDB();

        // Trova il commento genitore
        const parentComment = await Comment.findById(parentCommentId);

        if (!parentComment) {
            throw new Error("Parent comment not found");
        }

        // Crea il nuovo commento figlio
        const childComment = new Comment({
            author: authorId,
            text: text,
            refId: refId,  // Riferimento all'entità (Post, Quote o Review)
            refType: refType, // Specifica il tipo di riferimento
            parentId: parentCommentId, // Imposta il commento genitore
        });

        // Salva il commento figlio nel database
        const savedChildComment = await childComment.save();

        // Aggiungi l'ID del commento figlio alla lista `children` del commento genitore
        parentComment.children.push(savedChildComment._id);
        await parentComment.save();

       
        if (refType === 'Quote') {
            await Quote.findByIdAndUpdate(refId, {
                $addToSet: { comments: savedChildComment._id },
            });
        } else if (refType === 'Review') {
            await Review.findByIdAndUpdate(refId, {
                $addToSet: { comments: savedChildComment._id },
            });
        }

      
        revalidatePath(pathname);

        return savedChildComment;
    } catch (error: any) {
        console.error("Error while adding child comment:", error);
        throw new Error(`Failed to add child comment: ${error.message}`);
    }
}


export async function fetchSubComments(parentId: string, pageNumber = 1, pageSize = 3) {
    try {
        // Connect to the database
        connectToDB();

        // Find the parent comment
        const parentComment = await Comment.findById(parentId)
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    select: '_id id username image'
                }
            })
            .exec();

        if (!parentComment) {
            throw new Error('Parent comment not found');
        }

        // Calculate the amount of documents to skip for pagination
        const skipAmount = (pageNumber - 1) * pageSize;

        // Get the children comments
        const children = parentComment.children
            .slice(skipAmount, skipAmount + pageSize);

        // Determine if there are more comments to load
        const isNext = parentComment.children.length > skipAmount + children.length;

        const jsonComments = JSON.parse(JSON.stringify(children));

        return { comments: jsonComments, isNext };
    } catch (err) {
        console.error("Error while fetching sub-comments:", err);
        throw new Error("Unable to fetch sub-comments");
    }
}