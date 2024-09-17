"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/post";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { addChildrenToComment } from "@/lib/actions/comment.actions";
import { useState } from 'react';
import Link from "next/link";
import { Suspense } from 'react';

interface Comment {
    _id: string;
    text: string;
    author: {
        id: string;
        username: string;
        image: string;
    };
}

interface ReplyCommentProps {
    parentId: string;
    currentUser: string;
    imageCurrentUser: string;
    refType: 'Quote' | 'Review';
    refId: string;
    pathname: string;
}

const ReplyComment: React.FC<ReplyCommentProps> = ({
    parentId,
    currentUser,
    imageCurrentUser,
    refType,
    refId,
    pathname
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false); // Stato di invio del commento
    const [optimisticComment, setOptimisticComment] = useState<Comment | null>(null); // Stato per il commento ottimistico

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        // Definisci un commento ottimistico
        const newOptimisticComment: Comment = {
            _id: "temp-id", // ID temporaneo
            text: values.comment,
            author: {
                id: currentUser,
                username: "Tu", // Nome visualizzato dell'utente corrente
                image: imageCurrentUser // Immagine dell'utente corrente
            },
        };

        // Aggiungi il commento ottimistico allo stato
        setOptimisticComment(newOptimisticComment);
        form.reset();
        setIsSubmitting(true);

        try {
            // Invia il commento al server
            await addChildrenToComment({
                parentCommentId: parentId,
                authorId: currentUser,
                text: values.comment,
                refId,
                refType,
                pathname
            });

            // Rimuovi l'ID temporaneo e aggiorna lo stato se necessario
            // Nota: Potresti voler aggiornare l'ID del commento qui in base alla risposta del server
        } catch (error) {
            // Rimuovi il commento ottimistico in caso di errore
            console.error("Failed to submit comment:", error);
            setOptimisticComment(null); // Pulisci il commento ottimistico in caso di errore
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            
            {optimisticComment && (
                <div className="mb-4 flex flex-row items-start space-x-2">
                    <img
                        src={optimisticComment.author.image}
                        alt={optimisticComment.author.username}
                        className="w-7 h-7 rounded-full object-cover"
                    />
                    <div className="flex flex-col justify-center w-full space-y-2">
                        <div className="flex flex-col">
                            <Link href={`/profile/${optimisticComment.author.id}`} className="font-semibold">
                                {optimisticComment.author.username}
                            </Link>
                            <p className="text-sm">{optimisticComment.text}</p>
                        </div>
                    </div>
                </div>
            )}
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
                                        autoFocus={false}
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
        </div>
    );
};

export default ReplyComment;
