


import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";


export default async function Home() {
  try {

    const user = await currentUser();
    if (!user) return notFound();

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) {
      redirect('/onboarding');
    }





    return (
      <div className="h-screen flex justify-center items-start ">
        <h1 className="text-6xl mt-20 text-slate-650 font-extrabold font-fontMain ">Welcome to Book Board</h1>
        <p>{userInfo?.onboarded}</p>
      </div>
    );
  } catch (error) { 
    console.error("Error loading page data:", error);
    return <div>Error loading page data</div>;
  }
}
