import NewPost from "@/components/forms/NewPost";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page(){
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id)
    
    if(!userInfo?.onboarded) redirect('/onboarding')

    return (
        <div className=" flex-col h-full flex justify-start items-center  ">
               
                
                <NewPost idduser={userInfo._id.toString()} />
        </div>
    )
}

export default Page;