import React, { useState } from 'react';
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,

    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AddReviewProps {
    title: string;
    review: string;
    setTitle: (title: string) => void;
    setReview: (review: string) => void;
    index: number;
    onRemove: (index: number) => void;
}

const Review = ({ index, onRemove, title, setTitle, review, setReview }: AddReviewProps) => {

    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);


    function confirmReview(): void {
        setIsConfirmed(true);
    }

    return (
        <div className='border h-full p-4'>
            <div>
                {isConfirmed ? (
                    <div className='flex flex-col space-y-4 pt-6 '>
                        
                        <div className='space-y-3 pl-4 pt-2 '>
                            <p className='font-fontMain'><strong>{title}</strong></p>  {/* Visualizza il titolo */}
                            <p className='font-fontMain'>{review}</p>
                        </div>
                        <div className='flex justify-end'>
                            <p className='px-2 border rounded-lg w-min text-sm cursor-pointer' onClick={() => onRemove(index)}>delete</p>
                        </div>

                    </div>
                ) : (
                    <div className='space-y-4 pt-6'>
                        <Input
                            type='text'
                            placeholder='Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}  // Aggiungi la gestione del titolo
                        />
                        <Textarea
                            className=""
                            placeholder="Type your message here."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                         <div className='flex justify-end'>
                            {title || review ? (
                                <p className='px-2 border rounded-lg w-min text-sm bg-slate-900 text-white border cursor-pointer' onClick={confirmReview}>save</p>
                            ) : (
                                <p className='px-2 border rounded-lg w-min text-sm cursor-pointer' onClick={() => onRemove(index)}>delete</p>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Review;
