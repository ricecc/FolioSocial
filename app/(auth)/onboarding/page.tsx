import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/");
  const userData = {
    id: user.id,
    objectId: userInfo?._id.toString(),
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    lastName: userInfo ? userInfo?.lastName : user.lastName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  //aggiungere generi
  return (
    <main className='mx-auto flex w-full  flex flex-col justify-center  px-10 py-20 bg-slate-800  '>
      <section className='lg:mt-3 bg-dark-2 lg:p-2 flex justify-center'>
        <Card className="lg:w-[750px] w-[350px]">
          <CardHeader>
            <CardTitle>Benvenuto su Book Board!</CardTitle>
            <CardDescription>Onboarding</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountProfile user={userData} btnTitle='Continue' />
          </CardContent>
          <CardFooter className="flex justify-between">
           
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export default Page;