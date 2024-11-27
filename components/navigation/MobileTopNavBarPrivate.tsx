"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchUsers } from "@/lib/actions/user.actions";
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
import { useAuth, UserButton } from "@clerk/nextjs";


interface User {
    id: string;
    image: string;
    name: string;
    lastName: string;
    username: string;
}

function MobileTopNavBarPrivate() {
    const router = useRouter();
    const [termResult, setTermResult] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    async function getUsers(searchTerm: string) {
        setSearchTerm(searchTerm);
        if (searchTerm.trim() === "") {
            setTermResult([]);
            return;
        }
        try {
            const response = await searchUsers(searchTerm);
            setTermResult(response);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    function userClick(user: User) {
        setTermResult([]);
        setSearchTerm("");
        router.push(`/profile/${user.id}`);
    }

    function clear() {
        setTermResult([]);
        setSearchTerm("");
    }

    function handleMenuClick() {
        setIsOpen(!isOpen);
    }

    function handleCloseMenu() {
        setIsOpen(false);
    }
    const {userId} = useAuth()
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
                                <Link href="/feed" className="flex flex-row items-center">
                                    <LibraryBig className="mr-2 h-4 w-4" />
                                    <span>Home</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={handleCloseMenu}
                            >
                                <Link href={`/profile/${userId}`} className="flex flex-row items-center">
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
                <div className="lg:w-3/4 w-72 ">
                    <Command className="border-b h-auto bg-transparent ">
                        <div className="flex flex-row justify-between items-center px-3 py-3 space-x-3">
                            <div className="flex flex-row items-center space-x-3 w-full">
                                <img
                                    src="/assets/search.svg"
                                    alt="search"
                                    width={15}
                                    height={15}
                                    className="cursor-pointer object-contain"
                                />
                                <input
                                    type="text"
                                    placeholder="@username"
                                    value={searchTerm}
                                    onChange={(e) => getUsers(e.target.value)}
                                    className="focus:outline-none w-full bg-transparent"
                                />
                            </div>
    
                        </div>
                        {searchTerm.trim() !== "" && (
                            termResult.length > 0 ? (
                                <CommandList className="absolute top-14 bg-zinc-50 lg:w-3/4 w-72 shadow-2xl rounded-md">
                                    <CommandGroup heading="Suggeriti">
                                        {termResult.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                onSelect={() => userClick(user)}
                                                className="cursor-pointer"
                                            >
                                                <div className="flex flex-row justify-start items-center space-x-2">
                                                    <img
                                                        src={user.image}
                                                        alt=""
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-regular">{user.username}</span>
                                                        <p className="font-extralight text-xs">{user.name} {user.lastName}</p>
                                                    </div>
    
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            ) : (
                                <CommandList className="absolute top-14 bg-zinc-50 lg:w-3/4 w-72 shadow-2xl rounded-md">
                                    <CommandGroup heading="Utente non trovato" />
                                </CommandList>
                            )
                        )}
                    </Command>
                </div>
                <div className="m-2 flex flex-row items-center justify-center space-x-6">
                        <UserButton />
                </div>
            </section>
        );
    
  
}

export default MobileTopNavBarPrivate;
