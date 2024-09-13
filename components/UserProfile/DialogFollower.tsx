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
    _id: string,
    id: string,
    image: string,
    username: string
}


interface followerProp {
    followerUsers: UserProps[]
    numFollower: string
}
export function DialogFollower({ numFollower, followerUsers }: followerProp) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <p className="text-sm font-sans pb-2 cursor-pointer">{numFollower} follower</p>
            </DialogTrigger>
            <DialogContent className="lg:max-w-[425px] w-80 rounded-md">
                <DialogHeader>
                    <DialogTitle>Tutti i follower</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-72 w-full ">
                    <div className="p-4">
                        {followerUsers.map((user) => (
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

            </DialogContent>
        </Dialog>
    )
}

export default DialogFollower