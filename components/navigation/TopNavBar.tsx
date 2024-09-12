"use client";
import { UserButton } from "@clerk/nextjs";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { searchBooks } from "@/lib/actions/books.actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
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
        <Command className="border-b  md:min-w-[450px] h-auto bg-zinc-50 ">
          <div className="flex flex-row items-center  px-3 py-3 space-x-3">
            <img src="/assets/search.svg" alt="notification" width={15} height={15} className="cursor-pointer object-contain" />
            <input
              type="text"
              placeholder="What did you read?"
              onChange={(e) => getBooks(e.target.value)}
              className="   focus:outline-none bg-transparent w-full "
            />
          </div>
          {termResult.length > 0 ? (
            <CommandList className="absolute top-14 bg-zinc-50 w-4/5 ">

              <CommandGroup heading="Suggestions">
                {termResult.map((book) => (
                  <CommandItem
                    key={book._id}
                    onSelect={() => handleBookClick(book)}
                  >
                    <div className="flex flex-row justify-start items-center space-x-2">
                      <img src={book.smallImage} alt="" className="w-5 h-8" />
                      <p>{book.title}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          ) : (
            <></>
          )}

        </Command>
      </div>
      <div className="m-2 flex flex-row items-center justify-center space-x-6">
        <Image src="/assets/notifcation.svg" alt="notification" width={24} height={24} className="cursor-pointer object-contain" />
        <UserButton></UserButton>
      </div>
    </section>


  )
}

export default TopNavBar
