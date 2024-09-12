"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchBooks } from "@/lib/actions/books.actions";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Plus, LibraryBig } from "lucide-react";

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

function MobileTopNavBar() {
    const router = useRouter();
    const [termResult, setTermResult] = useState<Book[]>([]);
    const [isOpen, setIsOpen] = useState(false);

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
        setTermResult([]);
        router.push(`/book/${book._id.toString()}`);
    }

    function handleMenuClick() {
        setIsOpen(!isOpen);
    }

    function handleCloseMenu() {
        setIsOpen(false);
    }

    return (
        <section className="flex w-full flex-row items-center justify-between bg-zinc-50 p-3 sticky top-0 z-10">
            <div className="m-3 items-center justify-center">
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger onClick={handleMenuClick}>
                        <img
                            src="/assets/mobileMenu.svg"
                            alt="menu"
                            width={24}
                            height={24}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="ml-6 mt-5">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleCloseMenu}
                        >
                            <Link href="/" className="flex flex-row items-center">
                                <LibraryBig className="mr-2 h-4 w-4" />
                                <span>Home</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleCloseMenu}
                        >
                            <Link href="/your-posts" className="flex flex-row items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profilo</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleCloseMenu}
                        >
                            <Link href="/create-post" className="flex flex-row items-center">
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Crea folio</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="w-4/5 flex-1">
                <Command className="border-b md:min-w-[450px] h-auto bg-zinc-50">
                    <div className="flex flex-row items-center px-3 py-3 space-x-3">
                        <img
                            src="/assets/search.svg"
                            alt="search"
                            width={15}
                            height={15}
                            className="cursor-pointer object-contain"
                        />
                        <input
                            type="text"
                            placeholder="What did you read?"
                            onChange={(e) => getBooks(e.target.value)}
                            className="focus:outline-none bg-transparent w-full"
                        />
                    </div>
                    {termResult.length > 0 && (
                        <CommandList className="absolute top-14 bg-zinc-50 w-4/5">
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
                    )}
                </Command>
            </div>
            <div className="m-2 flex flex-row items-center justify-center space-x-6">
                <UserButton />
            </div>
        </section>
    );
}

export default MobileTopNavBar;
