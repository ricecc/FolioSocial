"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/post";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { createComment } from "@/lib/actions/comment.actions";
import { useState } from 'react';
import Link from "next/link";

interface DialogCommentParams {
    comments: any[];
    totalComment: number;
    postId: string;
    currentUser: string;
    pathname: string;
    hasMore: boolean;
    isLoading: boolean;
    loadMoreComments: () => void;
    imageCurrentUser: string;
    onClose: () => void; // Funzione per chiudere il dialogo
}

export function DialogComment({ 
    comments, 
    totalComment, 
    postId, 
    currentUser, 
    pathname,
    hasMore,
    isLoading,
    loadMoreComments,
    imageCurrentUser,
    onClose
}: DialogCommentParams) {
    const [isSubmitting, setIsSubmitting] = useState(false); // Stato di invio del commento

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        const optimisticComment = {
            _id: "temp-id", // ID temporaneo
            text: values.comment,
            author: {
                id: currentUser,
                username: "Tu", // Nome visualizzato dell'utente corrente
                image: imageCurrentUser // Immagine dell'utente corrente
            },
        };

        // Aggiungi il commento ottimistico allo stato
        comments.unshift(optimisticComment); // Aggiungi all'inizio della lista
        form.reset();
        setIsSubmitting(true);

        try {
            // Invia il commento al server
            await createComment({
                author: currentUser,
                text: values.comment,
                postId,
                pathname,
            });

            // In caso di successo, aggiorna lo stato (se necessario, rimuovi l'ID temporaneo)
            // Aggiorna l'ID del commento se necessario
        } catch (error) {
            // Rimuovi il commento ottimistico in caso di errore
            console.error("Failed to submit comment:", error);
            comments.shift(); // Rimuovi il commento ottimistico
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose} >
            <DialogContent className="lg:max-w-[425px] max-w-[425px] rounded-lg">
                {totalComment > 0 ? (
                    <ScrollArea className="h-72 w-full">
                        <div className="p-4">
                            {comments.map((comment) => (
                                <div key={comment._id} className="mb-4">
                                    <div className="flex flex-row items-center space-x-2">
                                        <img
                                            src={comment.author.image}
                                            alt={comment.author.username}
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                        <Link href={`/profile/${comment.author.id}`} className="font-semibold">
                                            {comment.author.username}
                                        </Link>
                                    </div>
                                    <p className="ml-10 mt-1 text-sm">{comment.text}</p>
                                    <Separator className="my-2" />
                                </div>
                            ))}
                            {!hasMore && <p className="text-sm">Non ci sono altri commenti.</p>}
                        </div>
                    </ScrollArea>
                ) : (
                    <p>Commenta per primo</p>
                )}

                {hasMore && (
                    <div className="text-center mt-4">
                        <p
                            onClick={loadMoreComments}
                            className="text-sm text-blue-500 cursor-pointer"
                        >
                            {isLoading ? 'Caricamento...' : 'Carica altri'}
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Form {...form}>
                        <form className='w-full flex items-center gap-3' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='comment'
                                render={({ field }) => (
                                    <FormItem className='flex w-full'>
                                        <FormControl className='border-none bg-transparent'>
                                            <Input
                                                type='text'
                                                {...field}
                                                placeholder='Comment...'
                                                className='no-focus text-light-1 outline-none'
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='ml-2' disabled={isSubmitting}>
                                {isSubmitting ? 'Caricamento...' : 'Reply'}
                            </Button>
                        </form>
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
