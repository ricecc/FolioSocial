"use client";
import { useEffect, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { searchBooks } from "@/lib/actions/books.actions";
import { createPost } from "@/lib/actions/posts.actions";
import TagsInput from "./TagsInput";
import { createTag } from "@/lib/actions/tag.actions";
import BookSelection from "./BookSelection";
import Header from "./HeaderNewPosst";
import AddReview from "./AddReview";
import AddQuote from "./AddQuote";


interface Props {
    idduser: string;
}

interface Book {
    _id: string;
    title: string;
    titleUrl: string;
    smallImage: string;
    author: string;
    publisher: string;
    largeImage: string;
    description: string;
    ean: string;
    genre1: string;
    genre2: string;
    genre3: string;
    year: string;
}

function NewPost({ idduser }: Props) {
    const [termResult, setTermResult] = useState<Book[]>([]);
    const [choose, setChoose] = useState<Book | undefined>(undefined);
    const [review, setReview] = useState<string>("");
    const [quote, setQuote] = useState<string>("")
    const [affiliateUrl, setAffiliateUrl] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    async function getBooks(searchTerm: string) {
        if (searchTerm.trim() === "") {
            setTermResult([]);
            return;
        }
        try {
            const response = await searchBooks(searchTerm);
            setTermResult(response);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }

    function handleBookClick(book: Book) {
        setChoose(book);
        setAffiliateUrl(book.titleUrl);
        setTermResult([]);
    }



    async function handlePublish() {
        if (!choose) {
            console.error("No book selected");
            return;
        }
        try {

            const insertedTag = await createTag(tags);

            const tagIds = insertedTag.map(tag => tag._id);

            await createPost({
                author: idduser,
                book: choose._id,
                review: review,
                quote:quote,
                image: choose.largeImage,
                path: pathname,
                genre: `${choose.genre1},${choose.genre2},${choose.genre3}`,
                affiliateUrl: affiliateUrl,
                tags: tagIds
            });


            router.push('/your-posts')

        } catch (error: any) {
            console.error("Errore nella pubblicazione del post:", error.message);
        }
    }



    return (
        <>
            <Header onPublish={handlePublish} />
            <section className="flex container h-auto md:w-2/3 font-fontMain  items-start justify-center mt-4 flex-col md:flex-row static p-5 rounded-lg shadow-xl bg-white">
                <div className="flex md:w-1/3 w-full mt-8 items-center justify-center p-7">
                    {choose ? (
                        <figure>
                            <img src={choose.largeImage} alt={choose.title} className="w-56 h-auto" />
                        </figure>
                    ) : (
                        <div className="w-full h-72 bg-slate-200 flex justify-center items-center">
                            <p>Book Cover</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col space-y-6 md:w-2/3 static">
                    <BookSelection onBookClick={handleBookClick}
                        getBooks={getBooks}
                        termResult={termResult} />
                    <AddQuote
                        quote={quote}
                        setQuote={setQuote}
                    />
                    <AddReview
                        review={review}
                        setReview={setReview}
                    />
                    <TagsInput tags={tags} setTags={setTags} placeholder="Tag" />
                    <input
                        type="text"
                        className="rounded-lg p-2 border shadow-lg w-full mt-4"
                        placeholder="affiliate link"
                        value={affiliateUrl}
                        onChange={(e) => setAffiliateUrl(e.target.value)}
                    />


                </div>
            </section>
        </>
    );
}

export default NewPost;
