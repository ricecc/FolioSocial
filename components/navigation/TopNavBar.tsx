"use client";
import { UserButton } from "@clerk/nextjs";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { searchBooks } from "@/lib/actions/books.actions";
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
function TopNavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [termResult, setTermResult] = useState<Book[]>([]);
  const [choose, setChoose] = useState<Book | undefined>(undefined);
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
    setTermResult([]);
    router.push(`/book/${book._id.toString()}`)
  }
  return (
    <section className="flex w-full flex-row items-center justify-between  bg-zinc-50  p-3  sticky top-0 z-10 ">
      <div className=" m-3 cursor-pointer  ">
        <Link href="/"><p className="text-lg">F</p></Link>
      </div>
      <div className="m-3 flex flex-row items-center justify-center space-x-4">
        <Link href="/your-posts"><Image src="/assets/profile.svg" alt="notification" width={24} height={24} className="cursor-pointer object-contain" /></Link>
        <Link href="/create-post"><Image src="/assets/newPost.svg" alt="notification" width={24} height={24} className="cursor-pointer object-contain" /></Link>
      </div>
      <div className="w-4/5 flex-1 ">
        <input
          type="text"
          className="w-full rounded-full p-2 bg-slate-100 "
          placeholder="search"
          onChange={(e) => getBooks(e.target.value)}
        />
        <div
          className={`w-max absolute top-14  border bg-white rounded-lg p-2 mt-4  ${termResult.length > 0 ? '' : 'hidden'
            }`}
        >
          {termResult.length > 0 ? (
            <ul className="w-full">
              {termResult.map((book) => (
                <li
                  key={book._id}
                  className="cursor-pointer hover:bg-slate-100 p-2 w-full"
                  onClick={() => handleBookClick(book)}
                >

                  <div className="flex flex-row justify-start items-center space-x-2">
                    <img src={book.smallImage} alt="" className="w-5 h-8" />
                    <p>{book.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
      <div className="m-2 flex flex-row items-center justify-center space-x-6">
        <Image src="/assets/notifcation.svg" alt="notification" width={24} height={24} className="cursor-pointer object-contain" />
        <UserButton></UserButton>
      </div>
    </section>


  )
}

export default TopNavBar
