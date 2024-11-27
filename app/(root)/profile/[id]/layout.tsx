import FollowButton from "@/components/UserProfile/FollowButton";
import { fetchUser, fetchUserInfoForProfile } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
const DialogFollower = dynamic(() => import('@/components/UserProfile/DialogFollower'), {
    ssr: false,
    loading: () => <p>loading...</p>,
});

export default async function Layout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
    const user = await currentUser();
    if (!user) return null;

    const fromUser = await fetchUser(user?.id);
    const userToWatch = await fetchUserInfoForProfile(params.id);

    return (
        <div className="flex justify-center items-center w-screen flex-col">
            <div className="w-full h-full">
                <div className="flex flex-col justify-center items-center w-full bg-slate-100 h-72">
                    <div className="h-auto flex flex-col justify-center items-center md:w-1/4 md:ml-8 mb-3 md:mb-0 bg-slate-100">
                        <Image src={userToWatch.image} className="w-24 h-24 rounded-full object-cover border-spacing-52" width={240} height={240} alt="Profile Image" />
                        <div className="flex flex-col justify-center space-y-2">
                            <div className="flex flex-col justify-center items-center space-y-4">
                                {userToWatch.lastName ? (
                                    <p className="text-xl font-bold pt-2">{userToWatch.name} {userToWatch.lastName}</p>
                                ) : (
                                    <p className="text-xl font-bold pt-2 flex justify-center items-center">{userToWatch.name}</p>
                                )}
                                <Suspense fallback={<>loading</>}>
                                    <FollowButton fromUserId={fromUser._id.toString()} toUserId={userToWatch._id.toString()} alreadyFollow={false /* Da gestire */}></FollowButton>
                                </Suspense>
                            </div>
                            <div className="flex flex-row space-x-1">
                                <p className="text-sm font-sans pb-2">@{userToWatch.username} -</p>
                                <DialogFollower numFollower={userToWatch.follower.length} followerUsers={userToWatch.follower} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-2 bg-red-300">
                        <Link href={`/profile/${params.id}`}>Library</Link>
                        <Link href={`/profile/${params.id}/saved`}>Saved</Link>
                    </div>

                </div>
            </div>
            <Suspense fallback={<p>loading...</p>}>
                {children}
            </Suspense>
        </div >
    )
}
