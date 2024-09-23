"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
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
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { Button } from "../ui/button";



function MobileTopNavBarPublic() {
    const router = useRouter();


    return (
        <section className="flex w-full flex-row items-center justify-between bg-zinc-50 p-3 sticky top-0 z-10">
            <div className="m-3 items-center justify-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Menu />
                    </SheetTrigger>
                    <SheetContent side='left'>
                        <div className="flex flex-col">
                            <Link href="" className="flex h-16  flex-row items-center">
                                <span className="text-xl">About us</span>
                            </Link>
                            <Link href="" className="flex   h-16 flex-row items-center">
                                <span className="text-2xl">Contact</span>
                            </Link>
                            <Link href="" className="flex  h-16  flex-row items-center">
                                <span className="text-2xl">La nostra missione</span>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="lg:w-3/4 w-72 flex justify-center items-center ">
                <p>Book Board</p>
            </div>
            <div className="m-2 flex flex-row items-center justify-center space-x-6">

                <div className="flex flex-row space-x-2">
                    <Link href={'/sign-up'} className="border rounded-md px-2">Registrati</Link>
                    <Link href={'/sign-in'} className="bg-black text-zinc-50 rounded-md px-2">Login</Link>
                </div>


            </div>
        </section>
    );
}

export default MobileTopNavBarPublic;
