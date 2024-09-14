import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface UserProps {
    id: string,
    image: string,
    name: string,
    lastName: string,
    username: string
}


interface likedProps {
    userLiked: UserProps[]
    numLike: number
}
export function DialogLike({ numLike, userLiked }: likedProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <p className="text-sm font-sans  cursor-pointer"> e altri {numLike}</p>
            </DialogTrigger>
            <DialogContent className="lg:max-w-[425px] w-80 rounded-md">
                {numLike > 0 ? (
                    <ScrollArea className="h-72 w-full ">
                        <div className="p-4">
                            {userLiked.map((user) => (
                                <>
                                    <div key={user.id} className="flex flex-row justify-start items-center space-x-2">
                                        <img
                                            src={user.image}
                                            alt=""
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                        <Link href={`/profile/${user.id}`}>
                                            <p>{user.username}</p>
                                        </Link>

                                    </div>
                                    <Separator className="my-2" />
                                </>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <p>Ancora nessun like</p>
                )}


            </DialogContent>
        </Dialog>
    )
}

export default DialogLike