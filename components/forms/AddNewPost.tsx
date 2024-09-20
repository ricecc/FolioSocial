"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Review from "./Review";
import Quote from "./Quote";
import DropZone from "../DropZone/DropZone";
import BookSelection from "./BookSelection";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { createPost } from "@/lib/actions/posts.actions";
import { createQuote } from "@/lib/actions/quote.actions";
import { createReview } from "@/lib/actions/review.actions";
import { getUserPostByBookId } from "@/lib/actions/user.actions";
import Header from "./HeaderNewPosst";
import TagsInput from "./TagsInput";
import { createTag } from "@/lib/actions/tag.actions";
import AlertNewPost from "./AlertNewPost";
import Image from "next/image";


interface DivData {
    type: "quote" | "review" | "image";
    rowSpan: boolean;
    review?: string;
    imageUrl?: string;
    quote?: string;
    titleReview?: string;
    page?: string;
}

interface Book {
    _id: string;
    title: string;
    author: string;
    smallImage: string;
    largeImage: string;
    genre1: string;
    genre2: string;
    genre3: string;
}

interface UserProps {
    idUser: string;
}

export default function AddNewPost({ idUser }: UserProps) {
    const [divs, setDivs] = useState<DivData[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
    const [postAlreadyExists, setPostAlreadyExists] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    const addDiv = (type: "quote" | "review" | "image", rowSpan = false) => {
        setDivs([...divs, { type, rowSpan }]);
    };

    const removeDiv = (index: number) => {
        setDivs(divs.filter((_, i) => i !== index));
    };

    const updateDiv = (index: number, updates: Partial<DivData>) => {
        const updatedDivs = [...divs];
        updatedDivs[index] = { ...updatedDivs[index], ...updates };
        setDivs(updatedDivs);
    };

    const handleBookClick = async (book: Book) => {
        await checkIfPostExists(book._id);
        setSelectedBook(book);
    };

    const checkIfPostExists = async (bookId: string) => {
        const post = await getUserPostByBookId(idUser, bookId);
        setPostAlreadyExists(post ? post : null);
    };

    const handlePublish = async () => {
        if (!selectedBook) {
            alert("No book selected");
            return;
        }
        const insertedTag = await createTag(tags);

        const tagIds = insertedTag.map(tag => tag._id);
        const images = divs
            .filter(div => div.type === 'image' && div.imageUrl !== undefined)
            .map(div => div.imageUrl as string);


        const filteredImages: string[] = images.filter((image): image is string => image !== undefined);
        const post = await createPost({
            author: idUser,
            book: selectedBook._id.toString(),
            image: selectedBook.largeImage,
            path: pathname,
            genre: `${selectedBook.genre1},${selectedBook.genre2},${selectedBook.genre3}`,
            affiliateUrl: "",
            tags: tagIds,
            postImages: filteredImages
        });

        await Promise.all(
            divs.map(async (div) => {
                if (div.type === 'quote' && div.quote) {
                    await createQuote({
                        page: div.page || "",
                        quote: div.quote,
                        postId: post.toString()
                    });
                } else if (div.type === 'review' && div.review) {
                    await createReview({
                        title: div.titleReview || "",
                        review: div.review,
                        postId: post.toString()
                    });
                }
            })
        );
        router.push('/your-posts');
    };


    return (
        <>

            <Header onPublish={handlePublish} />
            <section className="flex h-auto justify-center flex-col lg:w-2/3 w-full">
                <div className="grid w-full md:grid-cols-2 grid-cols-1 ">
                    <div className="bg-zinc-50 min-h-48 pt-6 p-5 border flex flex-col justify-between">
                        <div>
                            {selectedBook ? (
                                <>
                                    <p className="text-2xl">{selectedBook.title}</p>
                                    <p>{selectedBook.author}</p>
                                </>
                            ) : (
                                <BookSelection onBookClick={handleBookClick} />
                            )}
                        </div>
                        {selectedBook ? (
                            <div className="flex justify-end">
                                <p className='px-2 border rounded-lg w-min text-sm cursor-pointer' onClick={() => setSelectedBook(undefined)}>annulla</p>
                            </div>
                        ) : (<></>)}

                    </div>
                    <div className="bg-zinc-100 md:row-span-2 min-h-48 flex justify-center items-center">
                        {selectedBook&&(
                            <img src={selectedBook.largeImage} alt="" className="max-h-96" />
                        )}
                    </div>
                    {divs.map((div, index) => (
                        <div key={index} className={div.rowSpan ? "md:row-span-2 " : ""}>
                            {div.type === "quote" && (
                                <Quote
                                    quote={div.quote || ''}
                                    page={div.page || ''}
                                    setQuote={(newQuote) => updateDiv(index, { quote: newQuote })}
                                    setPage={(newPage) => updateDiv(index, { page: newPage })}
                                    index={index}
                                    onRemove={() => removeDiv(index)}
                                />
                            )}
                            {div.type === "review" && (
                                <Review
                                    title={div.titleReview || ''}
                                    setTitle={(newTitle) => updateDiv(index, { titleReview: newTitle })}
                                    review={div.review || ''}
                                    setReview={(newReview) => updateDiv(index, { review: newReview })}
                                    index={index}
                                    onRemove={() => removeDiv(index)}
                                />
                            )}
                            {div.type === "image" && (
                                <DropZone
                                    index={index}
                                    onRemove={() => removeDiv(index)}
                                    imageUrl={div.imageUrl || ''}
                                    setImageUrl={(url) => updateDiv(index, { imageUrl: url })}
                                />
                            )}
                        </div>
                    ))}

                </div>
                <div className={`mt-6  flex justify-center`}>
                    <Accordion type="single" className={`${divs.length === 0 ? "w-full" : "md:w-2/3 w-full"}`} collapsible>
                        <AccordionItem
                            value="item-1"
                            className="group flex justify-between items-center p-5 cursor-pointer hover:bg-slate-800 transition-colors duration-100"
                            onClick={() => addDiv("quote")}
                        >
                            <p className="group-hover:text-white">Quote</p>
                            <img src="/assets/plus.svg" alt="plus" width={24} height={24} className="cursor-pointer object-contain group-hover:bg-white group-hover:rounded-full" />
                        </AccordionItem>
                        <AccordionItem
                            value="item-2"
                            className="group flex justify-between items-center p-5 cursor-pointer hover:bg-slate-800 transition-colors duration-100"
                            onClick={() => addDiv("review")}
                        >
                            <p className="group-hover:text-white">Review</p>
                            <img src="/assets/plus.svg" alt="plus" width={24} height={24} className="cursor-pointer object-contain group-hover:bg-white group-hover:rounded-full" />
                        </AccordionItem>
                        <AccordionItem
                            value="item-3"
                            className="group flex justify-between items-center p-5 cursor-pointer hover:bg-slate-800 transition-colors duration-100"
                            onClick={() => addDiv("image", true)}
                        >
                            <p className="group-hover:text-white">Image</p>
                            <img src="/assets/plus.svg" alt="plus" width={24} height={24} className="cursor-pointer object-contain group-hover:bg-white group-hover:rounded-full" />
                        </AccordionItem>
                        <AccordionItem
                            value="item-4"
                        >
                            <TagsInput tags={tags} setTags={setTags} placeholder="Tag" />
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
        </>
    );
}
