"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import Post from "../models/post.model";
import Comment from "../models/comment.model";

interface CommentParams {
    author: string,
    postId: string,
    text: string,
    pathname: string
}
export async function fetchComments(postId: string, pageNumber = 1, pageSize = 20) {
    try {
        // Connessione al database
        await connectToDB();

        // Calcola l'importo da saltare per la paginazione
        const skipAmount = (pageNumber - 1) * pageSize;

        // Crea la query per recuperare i commenti top-level (quelli senza parentId) del post specificato
        const commentsQuery = Comment.find({
            post: postId, // Filtra per postId
            parentId: { $in: [null, undefined] } // Solo commenti top-level
        })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: 'author',
                select: '_id id username image'  // Seleziona solo i campi necessari dell'autore
            })
            .populate({
                path: 'children', // Popola il campo `children` (se i commenti hanno delle risposte)
                populate: {
                    path: 'author',
                    select: '_id id username image'  // Seleziona solo i campi necessari dell'autore dei commenti figli
                }
            });

        // Conta il numero totale di commenti top-level per il post specificato
        const totalCommentsCount = await Comment.countDocuments({
            post: postId, // Filtra per postId
            parentId: { $in: [null, undefined] }
        });

        // Esegui la query per ottenere i commenti
        const comments = await commentsQuery.exec();

        // Determina se ci sono ulteriori commenti disponibili per la paginazione
        const isNext = totalCommentsCount > skipAmount + comments.length;
        // Converte i commenti in JSON
        const jsonComments = JSON.parse(JSON.stringify(comments));

        return { comments: jsonComments, isNext };
    } catch (err) {
        console.error("Error while fetching comments:", err);
        throw new Error("Unable to fetch comments");
    }
}

export async function createComment({ author, postId, text, pathname }: CommentParams) {
    try {
        connectToDB()
        const newComment = await Comment.create({
            author,
            post: postId,
            text
        })

        const postUpdated = await Post.findByIdAndUpdate(postId, {
            $addToSet: { comments: newComment._id },
        });
        if (!postUpdated) {
            throw new Error('Il post specificato non esiste o è stato cancellato');
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
        // Connessione al database
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

        // Aggiorna il modello Post rimuovendo i riferimenti ai commenti eliminati
        await Post.updateMany(
            { comments: { $in: descendantCommentsIds } },
            { $pull: { comments: { $in: descendantCommentsIds } } }
        );

        // Cancella ricorsivamente tutti i commenti figli e discendenti
        await Comment.deleteMany({ _id: { $in: descendantCommentsIds } });



        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Failed to delete comment: ${error.message}`);
    }
}

export async function addCommentToPost(
    postId: string,
    commentText: string,
    userId: string,
    path: string
) {
    try {
        // Connessione al database
        await connectToDB();

        // Trova il post originale per il quale aggiungere il commento
        const originalPost = await Post.findById(postId);

        if (!originalPost) {
            throw new Error("Post not found");
        }

        // Crea il nuovo commento
        const newComment = new Comment({
            text: commentText,
            author: userId,
            post: postId, // Imposta il postId come riferimento al post
        });

        // Salva il nuovo commento nel database
        const savedComment = await newComment.save();

        // Aggiungi l'ID del nuovo commento all'array `comments` del post originale
        originalPost.comments.push(savedComment._id);

        // Salva il post aggiornato nel database
        await originalPost.save();


        revalidatePath(path);

    } catch (err) {
        console.error("Error while adding comment:", err);
        throw new Error("Unable to add comment");
    }
}