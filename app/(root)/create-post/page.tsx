
import AddNewPost from "@/components/forms/AddNewPost";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarded) redirect('/onboarding')

    return (
        <div className="h-full flex-col flex justify-start items-center  ">
            <AddNewPost idUser={userInfo._id.toString()}></AddNewPost>
        </div>
    )
}

export default Page;